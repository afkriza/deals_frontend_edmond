<template>
  <Fragment>
    <Portal to="dealHeader">
      <div v-if="finalOffer" :class="$style.info">
        <div :class="$style.dateInfo">
          <span>Created</span>
          <span>{{ createdDate }}</span>
        </div>
        <div :class="$style.dateInfo">
          <span>Last edited</span>
          <span>{{ lastEditedDate }}</span>
        </div>

        <ButtonGhost text="Rename" @click="openPdfOfferRenameModal">
          <template #icon>
            <IconEdit />
          </template>
        </ButtonGhost>
        <ButtonGhost text="Delete" @click="openPdfOfferDeleteModal">
          <template #icon>
            <IconTrash />
          </template>
        </ButtonGhost>
      </div>
    </Portal>
    <main :class="$style.scroll">
      <AppLoader
        v-if="isLoading"
        :class="$style.loader"
        loading-text="Loading final offer..."
      />
      <template v-else>
        <PdfForm
          :unit-types="unitTypes"
          :services="services"
          :properties="properties"
          :languages="languages"
          :currencies="currencies"
          :final-offer="finalOffer"
          :partner="partner"
          :presets="presets"
          :create-preset="createPreset"
          :edit-preset="editPreset"
          :delete-preset="deletePreset"
          @partner:edit="openEditPartnerModal"
        />
        <PdfPreview
          v-show="isPdfPreviewOpen"
          :class="$style.viewer"
          :is-loading="isPdfPreviewLoading"
          :is-downloading="isPdfDownloading"
          :pdf-source="pdfData"
          @minimize="minimizePdfPreview"
          @download="downloadPdfFile"
        />
      </template>

      <div :class="$style.tabs">
        <div
          v-show="!isPdfPreviewOpen"
          :class="$style.tab"
          @click="showPdfPreview"
        >
          <IconPdf />
          <b>PDF preview</b>
        </div>
      </div>
      <PartnerModal
        v-if="isEditPartnerModalOpen"
        :existing-partner="partner"
        :is-loading="isEditPartnerModalLoading"
        @submit="editPartner"
        @close="closeEditPartnerModal"
      />
      <PdfOfferModal
        v-if="isPdfOfferRenameModalOpen"
        title="Rename PDF offer"
        submit-button-text="Save"
        :name="finalOffer.name"
        :on-submit="renamePdfOffer"
        @close="closePdfOfferRenameModal"
      />
      <PdfOfferModal
        v-if="isPdfOfferDeleteModalOpen"
        title="Delete PDF offer?"
        submit-button-text="Delete pdf offer"
        destructive
        :on-submit="deletePdfOffer"
        @close="closePdfOfferDeleteModal"
      >
        Are you sure you want to delete offer
        <b>{{ finalOffer.name }}</b> ({{ dealName }} {{ partnerName }})?<br />
        The PDF offer will be deleted immediately. You can’t undo this action.
      </PdfOfferModal>
    </main>
  </Fragment>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { format } from 'date-fns';
  import {
    debounce,
    find,
    isEmpty,
    pick,
    map,
    isEqual,
    zip,
    forEach,
    uniqueId,
    reject
  } from 'lodash';

  import PdfForm from '@/components/pdf/PdfForm.vue';

  import { groupsModule } from '@/store';
  import PdfPreview from '@/components/pdf/PdfPreview.vue';
  import Breadcrumbs from '@/components/app/Breadcrumbs.vue';

  import IconPdf from '@/assets/images/icons/Misc/ic-24-PDF.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';
  import IconEdit from '@/assets/images/icons/Analytics/edit.svg';
  import PartnerModal from '@/components/modals/PartnerModal.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import PdfOfferModal from '@/components/groups/PdfOfferModal.vue';
  import { navigate } from '@/utils/navigation';
  import { pages } from '@/enums/pages';

  import { Fragment } from 'vue-fragment';
  import AppLoader from '@/components/app/AppLoader.vue';
  import { DealDetails } from '@/components/groups/new-inquiry/models/DealDetails.model';
  import { FinalOffer } from '@/models/groups/FinalOffer.model';
  import PresetModal from '@/components/groups/PresetModal.vue';
  import { Preset } from '@/models/groups/Preset.model';

  @Component({
    components: {
      PresetModal,
      AppLoader,
      PdfOfferModal,
      ButtonGhost,
      PartnerModal,
      Breadcrumbs,
      PdfPreview,
      PdfForm,
      IconPdf,
      IconTrash,
      IconEdit,
      Fragment
    }
  })
  export default class PdfOfferPage extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly dealId: string;

    @Prop({
      type: String,
      required: true
    })
    readonly offerId: string;

    @Prop({
      type: String,
      required: true
    })
    readonly pdfOfferId: string;

    @Prop({
      type: DealDetails,
      required: true
    })
    readonly dealDetails: DealDetails;

    isLoading = true;

    finalOffer: FinalOffer = null;

    isPdfPreviewOpen = true;

    isEditPartnerModalOpen = false;
    isEditPartnerModalLoading = false;

    isPdfOfferRenameModalOpen = false;
    isPdfOfferDeleteModalOpen = false;

    isCreateNewPresetModalOpen = false;
    isRenamePresetModalOpen = false;
    isDeletePresetModalOpen = false;

    get deal() {
      return this.dealDetails;
    }

    get dealName() {
      return this.deal.inquiry.name;
    }

    get partnerName() {
      return this.deal.partner.name;
    }

    get offer() {
      return find(this.deal?.offers, ['id', this.offerId]);
    }

    get unitTypes() {
      return groupsModule.roomTypes;
    }

    get services() {
      return groupsModule.packages;
    }

    get properties() {
      return groupsModule.properties;
    }

    get languages() {
      return groupsModule.languages;
    }

    get currencies() {
      return groupsModule.currencies;
    }

    get partner() {
      return this.deal.partner;
    }

    get createdDate() {
      if (!this.finalOffer) {
        return '';
      }

      return format(this.finalOffer.createdAt, 'd.M.yyyy');
    }

    get lastEditedDate() {
      if (!this.finalOffer) {
        return '';
      }

      return format(this.finalOffer.updatedAt, 'd.M.yyyy');
    }

    openEditPartnerModal() {
      this.isEditPartnerModalOpen = true;
    }

    closeEditPartnerModal() {
      this.isEditPartnerModalOpen = false;
    }

    openPdfOfferRenameModal() {
      this.isPdfOfferRenameModalOpen = true;
    }

    closePdfOfferRenameModal() {
      this.isPdfOfferRenameModalOpen = false;
    }

    openPdfOfferDeleteModal() {
      this.isPdfOfferDeleteModalOpen = true;
    }

    closePdfOfferDeleteModal() {
      this.isPdfOfferDeleteModalOpen = false;
    }

    showPdfPreview() {
      this.isPdfPreviewOpen = true;

      if (this.shouldPreviewReloadWhenOpened) {
        this.downloadPdf();

        this.shouldPreviewReloadWhenOpened = false;
      }
    }

    minimizePdfPreview() {
      this.isPdfPreviewOpen = false;
    }

    async renamePdfOffer(name: string) {
      this.finalOffer.name = name;

      await this.updateFinalOffer();

      this.updateBreadcrumbs();

      this.closePdfOfferRenameModal();
    }

    get pdfOfferPreviewTriggers() {
      return {
        partner: this.deal.partner
      };
    }

    get pdfOfferUpdateTriggers() {
      if (!this.finalOffer) {
        return null;
      }

      return {
        ...pick(this.finalOffer, [
          'language',
          'currency',
          'title',
          'note',
          'htmlIntro',
          'htmlConclusion',
          'validUntil',
          'property'
        ]),
        groups: map(this.finalOffer.groups, group => ({
          dateRange: pick(group.dateRange, ['from', 'to']),
          units: map(group.units, unit =>
            pick(unit, ['quantity', 'roomType.id', 'price', 'package.id'])
          )
        }))
      };
    }

    @Watch('pdfOfferUpdateTriggers', { deep: true })
    async onFinalOfferChange(newValue, oldValue) {
      if (
        isEmpty(oldValue) ||
        isEqual(newValue, oldValue) ||
        newValue.name !== oldValue.name
      ) {
        return;
      }

      this.updateFinalOfferDebounced(true);
    }

    async editPartner(partner) {
      this.isEditPartnerModalLoading = true;

      try {
        const partnerEdited = await groupsModule.editPartner(partner);

        groupsModule.UPDATE_DEAL_ATTR_VALUE({
          dealId: this.deal.id,
          attr: 'partner',
          value: partnerEdited
        });

        this.closeEditPartnerModal();
      } catch (e) {
        console.error(e);
      } finally {
        this.isEditPartnerModalLoading = false;
      }
    }

    async updateFinalOffer(downloadPdfIfPreviewOpen = false) {
      try {
        const finalOfferUpdated: FinalOffer =
          await groupsModule.updateFinalOffer({
            finalOfferId: this.pdfOfferId,
            finalOfferDto: this.finalOffer.serialize()
          });

        // in case of adding new unit(s), the id mapping is needed
        forEach(
          zip(finalOfferUpdated.groups, this.finalOffer.groups),
          ([newGroup, oldGroup]) => {
            forEach(
              zip(newGroup.units, oldGroup.units),
              ([newUnit, oldUnit]) => {
                oldUnit.id = newUnit.id;
              }
            );
          }
        );

        if (downloadPdfIfPreviewOpen && !this.isPdfPreviewOpen) {
          this.shouldPreviewReloadWhenOpened = true;
        }

        if (downloadPdfIfPreviewOpen && this.isPdfPreviewOpen) {
          return this.downloadPdf();
        }
      } catch (e) {
        console.error(e);
      }
    }

    updateFinalOfferDebounced = debounce(this.updateFinalOffer, 2000);

    async deletePdfOffer() {
      await groupsModule.deleteFinalOffer(this.pdfOfferId);

      return this.navigateToPDFOffersPage();
    }

    navigateToPDFOffersPage() {
      return navigate(this.$router, {
        name: pages.PDF_OFFERS,
        params: { dealId: this.dealId, offerId: this.offerId }
      });
    }

    pdfData = null;
    isPdfDownloading = false;
    isPdfPreviewLoading = false;
    shouldPreviewReloadWhenOpened = false;

    async downloadPdfFile() {
      if (this.isPdfDownloading) {
        return;
      }

      this.isPdfDownloading = true;

      try {
        await groupsModule.downloadFinalOfferPdf(this.pdfOfferId);
      } catch (e) {
        console.error(e);
      } finally {
        this.isPdfDownloading = false;
      }
    }

    @Watch('pdfOfferPreviewTriggers', { immediate: true })
    async downloadPdf() {
      this.isPdfPreviewLoading = true;
      this.pdfData = await groupsModule.fetchFinalOfferPdf(this.pdfOfferId);
      this.isPdfPreviewLoading = false;
    }

    updateBreadcrumbs() {
      groupsModule.UPDATE_BREADCRUMBS([
        {
          path: '/deals',
          label: 'Deals'
        },
        {
          path: `/deals/${this.dealId}`,
          label: this.deal.inquiry.name
        },
        {
          path: `/deals/${this.dealId}/offers/${this.offerId}/pdfs`,
          label: this.offer.title
        },
        {
          path: `/deals/${this.dealId}/offers/${this.offerId}/pdfs/${this.pdfOfferId}`,
          label: this.finalOffer.name
        }
      ]);
    }

    activePreset = null;

    get presets() {
      return groupsModule.presets;
    }

    createPreset(preset: Preset) {
      return groupsModule.createPreset(preset);
    }

    editPreset(preset: Preset) {
      return groupsModule.editPreset(preset);
    }

    deletePreset(preset: Preset) {
      return groupsModule.deletePreset(preset.id);
    }

    async created() {
      this.isLoading = true;

      this.finalOffer = await groupsModule.fetchFinalOffer(this.pdfOfferId);

      if (!groupsModule.arePresetsLoaded) {
        await groupsModule.loadPresets();
      }

      this.updateBreadcrumbs();

      this.isLoading = false;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .loader {
    grid-column: 1 / 3;
  }

  .scroll {
    display: grid;
    grid-template-columns: 1fr 1fr;

    grid-template-areas: 'left right';

    overflow: auto;
  }

  .viewer {
    position: relative;

    grid-area: right;

    overflow: auto;

    background: $color-bg-main-dimmed;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .tabs {
    @include row;

    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    right: 16px;
  }

  .tab {
    @include row;
    align-items: center;

    padding: 10px 16px;

    width: 260px;

    background: $color-bg-primary-darker;

    cursor: pointer;

    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px 8px 0px 0px;

    color: $color-text-light;

    &:hover {
      background-color: $color-bg-primary-mid;
    }
  }

  .info {
    @include row;
    align-items: center;

    margin-left: auto;
    padding-left: 32px;
  }

  .date-info {
    white-space: nowrap;

    > span:first-child {
      color: $color-text-main-light;

      margin-right: 8px;
    }

    &:last-of-type {
      margin-left: 40px;
      margin-right: 48px;
    }
  }
</style>
