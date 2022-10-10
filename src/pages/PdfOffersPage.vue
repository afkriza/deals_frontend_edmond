<template>
  <Fragment>
    <Portal to="dealHeader">
      <ButtonGhost
        :class="$style.buttonNewPdfOffer"
        text="New PDF offer"
        @click="openNewPdfOfferModal"
      >
        <template #icon>
          <IconAdd />
        </template>
      </ButtonGhost>
    </Portal>
    <main>
      <AppLoader v-if="isLoading" loading-text="Loading final offers..." />
      <AppEmptyState
        v-else-if="isEmpty"
        :class="$style.emptyState"
        title="There are no PDFs for this offer"
        description="Create a new one by clicking the button in the top right."
        :empty-state-icon="EmptyStateIllustration"
      />
      <div v-else :class="$style.table">
        <div :class="$style.tableHeader">
          <span>Name</span>
          <span>Language</span>
          <span>Currency</span>
          <span>Created</span>
          <span>Last edited</span>
        </div>
        <div
          v-for="finalOffer in finalOffers"
          :id="finalOffer.id"
          :class="$style.tableRow"
          @click="navigateToPdfOfferPage(finalOffer.id)"
        >
          <IconPdf :class="$style.icon" />
          <b>{{ finalOffer.name }}</b>
          <span :class="$style.language">{{
            languageMap[finalOffer.language] || '-'
          }}</span>
          <span :class="$style.currency">{{
            currencyMap[finalOffer.currency] || '-'
          }}</span>
          <span>{{ formatDate(finalOffer.createdAt) }}</span>
          <span>{{ formatDate(finalOffer.updatedAt) }}</span>
          <div :class="$style.actions">
            <ButtonGhost
              tooltip-text="Duplicate"
              oval
              @click.stop="onDuplicateClick(finalOffer)"
            >
              <template #icon>
                <IconCopy />
              </template>
            </ButtonGhost>
            <ButtonGhost
              destructive
              tooltip-text="Delete"
              oval
              @click.stop="onFinalOfferDeleteClick(finalOffer)"
            >
              <template #icon>
                <IconTrash />
              </template>
            </ButtonGhost>
          </div>
        </div>
      </div>
      <PdfOfferModal
        v-if="isNewFinalOfferModalOpen"
        title="New PDF offer"
        submit-button-text="Continue"
        :name="dealName"
        :on-submit="createNewFinalOffer"
        @close="closeNewPdfOfferModal"
      >
        Create new PDF offer for <b>{{ dealName }}</b> ({{ partnerName }})
      </PdfOfferModal>
      <PdfOfferModal
        v-if="isDuplicateFinalOfferModalOpen"
        title="Duplicate PDF offer"
        submit-button-text="Duplicate"
        :name="activeFinalOffer.name + ' - copy'"
        :on-submit="duplicateFinalOffer"
        @close="closeDuplicatePdfOfferModal"
      />
      <PdfOfferModal
        v-if="isDeleteFinalOfferModalOpen"
        title="Delete PDF offer?"
        submit-button-text="Delete pdf offer"
        destructive
        :on-submit="deleteFinalOffer"
        @close="closeDeletePdfOfferModal"
      >
        Are you sure you want to delete offer
        <b>{{ activeFinalOffer.name }}</b> ({{ dealName }}
        {{ partnerName }}})?<br />
        The PDF offer will be deleted immediately. You can’t undo this action.
      </PdfOfferModal>
    </main>
  </Fragment>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  import IconAdd from '@/assets/images/icons/add-flat.svg';
  import IconPdf from '@/assets/images/icons/Misc/ic-24-PDF.svg';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';

  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  import { groupsModule } from '@/store';
  import AppLoader from '@/components/app/AppLoader.vue';
  import PdfOfferModal from '@/components/groups/PdfOfferModal.vue';
  import Breadcrumbs from '@/components/app/Breadcrumbs.vue';
  import { format, formatISO, parseISO } from 'date-fns';
  import { find, reject, size, uniqueId } from 'lodash';
  import { navigate } from '@/utils/navigation';
  import { pages } from '@/enums/pages';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import EmptyStateIllustration from '@/assets/images/icons/emptystate-no-units.svg';
  import { DealDetails } from '@/components/groups/new-inquiry/models/DealDetails.model';
  import { Fragment } from 'vue-fragment';

  interface FinalOffer {
    id: string;
    name: string;
    language: string;
    currency: string;
    created: Date;
    lastEdited: Date;
  }

  @Component({
    components: {
      AppEmptyState,
      Breadcrumbs,
      PdfOfferModal,
      AppLoader,
      ButtonGhost,
      IconAdd,
      IconPdf,
      IconCopy,
      IconTrash,
      Fragment
    }
  })
  export default class PdfOffersPage extends Vue {
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
      type: DealDetails,
      required: true
    })
    readonly dealDetails: DealDetails;

    finalOffers: FinalOffer[] = null;
    isLoading = false;
    isNewFinalOfferModalOpen = false;
    isDuplicateFinalOfferModalOpen = false;
    isDeleteFinalOfferModalOpen = false;

    activeFinalOffer = null;

    get deal() {
      return this.dealDetails;
    }

    get isEmpty() {
      return size(this.finalOffers) === 0;
    }

    get EmptyStateIllustration() {
      return EmptyStateIllustration;
    }

    get currencyMap() {
      return {
        '€': 'EUR'
      };
    }

    get languageMap() {
      return {
        hr: 'Croatian'
      };
    }

    get dealName() {
      return this.deal.inquiry.name;
    }

    get partnerName() {
      return this.deal.partner.name;
    }

    get offer() {
      return find(this.deal.offers, ['id', this.offerId]);
    }

    openNewPdfOfferModal() {
      this.isNewFinalOfferModalOpen = true;
    }

    closeNewPdfOfferModal() {
      this.isNewFinalOfferModalOpen = false;
    }

    async createNewFinalOffer(finalOfferName: string) {
      const newFinalOffer = await groupsModule.createFinalOffer({
        offerId: this.offerId,
        name: finalOfferName
      });

      this.navigateToPdfOfferPage(newFinalOffer.id);
    }

    openDeletePdfOfferModal() {
      this.isDeleteFinalOfferModalOpen = true;
    }

    closeDeletePdfOfferModal() {
      this.isDeleteFinalOfferModalOpen = false;
    }

    onFinalOfferDeleteClick(finalOffer: FinalOffer) {
      this.openDeletePdfOfferModal();

      this.activeFinalOffer = finalOffer;
    }

    async deleteFinalOffer() {
      try {
        await groupsModule.deleteFinalOffer(this.activeFinalOffer.id);

        this.finalOffers = reject(this.finalOffers, [
          'id',
          this.activeFinalOffer.id
        ]);

        this.closeDeletePdfOfferModal();
      } catch (e) {
        console.error(e);
      }
    }

    openDuplicatePdfOfferModal() {
      this.isDuplicateFinalOfferModalOpen = true;
    }

    closeDuplicatePdfOfferModal() {
      this.isDuplicateFinalOfferModalOpen = false;
    }

    onDuplicateClick(finalOffer: FinalOffer) {
      this.openDuplicatePdfOfferModal();

      this.activeFinalOffer = finalOffer;
    }

    async duplicateFinalOffer(finalOfferName: string) {
      const finalOfferDuplicate = await groupsModule.duplicateFinalOffer({
        name: finalOfferName,
        finalOfferId: this.activeFinalOffer.id
      });

      this.navigateToPdfOfferPage(finalOfferDuplicate.id);
    }

    formatDate(date: string) {
      return format(parseISO(date), 'd.M.yyyy');
    }

    navigateToPdfOfferPage(pdfOfferId: string) {
      navigate(this.$router, {
        name: pages.PDF_OFFER,
        params: {
          dealId: this.dealId,
          offerId: this.offerId,
          pdfOfferId
        }
      });
    }

    async created() {
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
        }
      ]);

      this.isLoading = true;

      try {
        this.finalOffers = await groupsModule.fetchFinalOffers(this.offerId);
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .empty-state {
    height: auto;
    align-self: start;
    margin-top: 80px;
  }

  .button-new-pdf-offer {
    margin-left: auto;
  }

  .table {
    &-header {
      display: grid;
      grid-template-columns: 3fr 1fr 3fr 1fr 1fr 1fr;

      padding: 11px 0 11px 76px;

      border-bottom: 1px solid $color-border-main-light;

      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;
      color: $color-text-main-lighter;
    }

    &-row {
      display: grid;
      grid-template-columns: 76px 3fr 1fr 3fr 1fr 1fr 1fr;

      align-items: center;

      padding: 14px 0;

      cursor: pointer;

      .icon {
        margin-left: auto;
        margin-right: 12px;
      }

      .actions {
        @include row;
        justify-content: flex-end;

        padding-right: 14px;

        visibility: hidden;
      }

      &:hover {
        background-color: $color-bg-primary-dimmed;

        .actions {
          visibility: visible;
        }
      }

      &:nth-child(2n + 1) {
        background-color: $color-bg-main-dimmed;

        &:hover {
          background-color: $color-bg-primary-dimmed;
        }
      }
    }
  }

  .language {
    text-transform: capitalize;
  }

  .currency {
    text-transform: uppercase;
  }
</style>
