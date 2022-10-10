<template>
  <Fragment>
    <Portal to="dealHeader">
      <DealStatusTag
        :class="$style.dealStatusTag"
        :deal-status="dealDetails.status"
        filled
      />
      <div :class="$style.headerInfo">
        <IconText :icon="icons.IconPartner" :text="partnerName" />
        <IconText :icon="icons.IconGroup" :text="numberOfGroups" />
        <IconText v-if="budget" :icon="icons.IconBudget" :text="budget" />
        <IconText v-if="note" :icon="icons.IconNote" :text="note" />
        <IconText v-if="priority" :icon="icons.IconWarning" text="Priority" />
      </div>

      <ButtonRegular
        v-if="hasAccess(Role.Admin, Role.Manager)"
        :class="$style.createOfferButton"
        @click="onCreateOfferClick"
      >
        Create offer
      </ButtonRegular>
      <VPopover
        v-if="hasAccess(Role.Admin, Role.Sales)"
        :class="$style.dropdown"
        :container="false"
        placement="bottom-start"
      >
        <ButtonGhost oval>
          <template #icon>
            <IconEllipsis />
          </template>
        </ButtonGhost>
        <template #popover>
          <DropdownList
            :class="$style.dropdownList"
            :custom-item-class="$style.dropdownListItem"
            :items="dropdownListItems"
            @select="onDropdownListItemClick"
          >
            <template #item="{ item }">
              {{ item.label }}
            </template>
          </DropdownList>
        </template>
      </VPopover>
    </Portal>

    <main :class="$style.main">
      <div :class="$style.left">
        <div :class="$style.content">
          <TimelineMessage
            :class="$style.commentWrapper"
            :current-user="currentUser"
            :message-creator="currentUser"
          >
            <template #heading>
              <InputTextarea
                v-model="comment"
                :class="$style.commentInput"
                placeholder="Enter text to leave a comment"
                autosize
              />
              <ButtonRegular
                v-show="comment"
                :class="$style.commentButton"
                :is-loading="isCommentLoading"
                @click="onComment"
                >Comment
              </ButtonRegular>
            </template>
          </TimelineMessage>

          <div v-if="dealDetails" :class="$style.dealDetailsContainer">
            <template v-for="message in dealDetails.messages">
              <Component
                :is="message.component"
                :key="message.id"
                :class="$style.message"
                :message="message"
                :current-user="currentUser"
                @offer:copy-and-edit="copyAndEditOffer(message.offer)"
                @offer:status-change="changeOfferStatus(message.offer, $event)"
                @pdf:create="showCreatePdfOfferModal(message.offer.id)"
                @pdf:view="viewPdfs(message.offer.id)"
                @send-to-pms="sendToPms"
              />
            </template>
          </div>
        </div>
      </div>
      <div :class="$style.right">
        <template v-if="isCreateNewOfferFormShown">
          <NewOfferForm
            :class="$style.newOffer"
            :offer="offer"
            :properties="properties"
            :services="services"
            :unit-types="unitTypes"
            :v="$v"
            :loading="isCreateNewOfferLoading"
            @cancel="discardOffer"
            @minimize="minimizeOffer"
            @analysis:offer="onOfferAnalysis"
            @analysis:offer-group="onOfferGroupAnalysis"
            @submit="submitNewOffer"
          />
        </template>
        <template v-else>
          <div :class="$style.emptyState">
            <EmptyStateIllustration />
          </div>
        </template>
        <Portal to="modals">
          <AnalysisCalculator
            v-if="isAnalysisShown"
            :class="$style.calculator"
            :analysis-calculator="analysisCalculator"
            :properties="properties"
            :date-range="analysisCalculator.dateRange"
            :partners="partners"
            :is-loading="isAnalysisCalculatorLoading"
            :is-error="isAnalysisCalculatorError"
            @filters:apply="applyFilters"
            @close="discardAnalysis"
            @minimize="minimizeAnalysis"
            @reset="onAnalysisReset"
          />
        </Portal>
        <div :class="$style.tabs">
          <div v-show="tabs.analysis" :class="$style.tab" @click="showAnalysis">
            <IconAnalysis />
            <span>Analysis</span>
            <IconClose
              :class="$style.iconClose"
              @click.stop="discardAnalysis"
            />
          </div>
          <div v-show="tabs.offer" :class="$style.tab" @click="showOffer">
            <IconDocument />
            <span>New offer</span>
            <IconClose :class="$style.iconClose" @click.stop="discardOffer" />
          </div>
        </div>
      </div>
      <PdfOfferModal
        v-if="isCreatePdfOfferModalShown"
        title="New PDF offer"
        submit-button-text="Continue"
        :name="deal.name"
        :on-submit="createPdfOffer"
        @close="closeCreatePdfOfferModal"
      >
        Create new PDF offer for <b>{{ dealName }}</b> ({{ partnerName }})
      </PdfOfferModal>
      <ActionModal
        v-if="isCancelDealModalOpen"
        size="small"
        title="Cancel deal?"
        cancel-button-text="No, keep it open"
        submit-button-text="Yes, cancel deal"
        is-destructive
        :is-loading="isCancelDealModalLoading"
        @submit="cancelDeal"
        @close="isCancelDealModalOpen = false"
      >
        Are you sure you want to cancel deal
        <b>{{ dealName }} ({{ partnerName }})?</b>
      </ActionModal>
      <ActionModal
        v-if="isDeleteDealModalOpen"
        size="small"
        title="Delete deal?"
        cancel-button-text="Cancel"
        submit-button-text="Delete deal"
        is-destructive
        :is-loading="isDeleteDealModalLoading"
        @submit="deleteDeal"
        @close="isDeleteDealModalOpen = false"
      >
        Are you sure you want to delete deal
        <b>{{ dealName }} ({{ partnerName }})?</b>
        <br />
        The deal will be deleted immediately. You can’t undo this action.
      </ActionModal>
    </main>
  </Fragment>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import { mapGetters } from 'vuex';
  import { first, fromPairs, get, keyBy, map, mapValues, values } from 'lodash';
  import { Fragment } from 'vue-fragment';

  import IconGroup from '@/assets/images/icons/Deals/group.svg';
  import IconBudget from '@/assets/images/icons/groups/new-inquiry/budget.svg';
  import IconNote from '@/assets/images/icons/groups/new-inquiry/note-2px.svg';
  import IconBack from '@/assets/images/icons/Deal page/Header/back-icon.svg';
  import IconWarning from '@/assets/images/icons/warning.svg';
  import IconEllipsis from '@/assets/images/icons/ellipsis.svg';

  import IconNewDeal from '@/assets/images/icons/Deal page/Header/Status/new-deal.svg';
  import IconDocument from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Misc/ic-24-document.svg';
  import IconArchive from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Misc/ic-24-archive.svg';
  import IconPartner from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Deals/ic-24-deals-partner.svg';
  import IconCheckCircle from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Misc/ic-24-check-circle.svg';
  import IconSidebarDeals from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Sidebar/ic-24-sidebar-deals.svg';

  import IconChevronRight from '@/assets/images/icons/Navigation/Chevron/chevron-right.svg';
  import IconClose from '@/assets/images/icons/close-2px.svg';

  import IconText from '@/components/groups/deal/IconText.vue';
  import TimelineIcon from '@/components/groups/deal/TimelineIcon.vue';

  import EmptyStateIllustration from '@/assets/images/icons/Empty state/Deals/New offer.svg';
  import ButtonRegular from '@/components/buttons/ButtonRegular.vue';
  import NewOfferForm from '@/components/groups/new-offer/NewOfferForm.vue';
  import UserAvatar from '@/components/groups/deal/UserAvatar.vue';
  import InputText from '@/components/inputs/new/InputText.vue';
  import InputTextarea from '@/components/inputs/new/InputTextarea.vue';
  import TimelineMessage from '@/components/groups/deal/TimelineMessage.vue';
  import Button from '@/components/core/Button.vue';

  import Offer from '@/components/groups/new-offer/models/Offer.model';
  import DealCreatedCard from '@/components/groups/timeline/DealCreatedCard.vue';
  import { required } from 'vuelidate/lib/validators';

  import { analysisModule, groupsModule } from '@/store';
  import NewOfferCard from '@/components/groups/timeline/NewOfferCard.vue';
  import { navigate } from '@/utils/navigation';
  import { pages } from '@/enums/pages';
  import AppLoader from '@/components/app/AppLoader.vue';
  import LoadingView from '@/components/app/LoadingView.vue';
  import IconAnalysis from '@/assets/images/icons/Deals/ic-24-deals-analysis.svg';

  import { formatPriceNumber } from '@/utils/format';
  import { formatISODate } from '@/utils/date';
  import AnalysisCalculator from '@/components/groups/analysis/AnalysisCalculator.vue';
  import AnalysisCalculatorModel, {
    UnitType
  } from '@/models/analysis/AnalysisCalculator.model';
  import CommentCard from '@/components/groups/timeline/CommentCard.vue';
  import { abbreviation } from '@/utils/string';
  import Breadcrumbs from '@/components/app/Breadcrumbs.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import DropdownList from '@/components/core/DropdownList.vue';
  import ActionModal from '@/components/modals/ActionModal.vue';
  import { DealDetails } from '@/components/groups/new-inquiry/models/DealDetails.model';
  import PdfOfferModal from '@/components/groups/PdfOfferModal.vue';
  import { Role } from '@/enums/Role.enum';
  import DealStatusTag from '@/components/groups/DealStatusTag.vue';
  import DealStatus from '@/enums/DealStatus.enum';

  @Component({
    components: {
      DealStatusTag,
      ActionModal,
      DropdownList,
      ButtonGhost,
      Breadcrumbs,
      PdfOfferModal,
      CommentCard,
      AnalysisCalculator,
      LoadingView,
      AppLoader,
      NewOfferCard,
      DealCreatedCard,
      Button,
      TimelineMessage,
      InputTextarea,
      InputText,
      UserAvatar,
      NewOfferForm,
      ButtonRegular,
      TimelineIcon,
      IconText,
      IconNote,
      IconBudget,
      IconGroup,
      IconDocument,
      IconNewDeal,
      IconArchive,
      IconPartner,
      IconCheckCircle,
      IconSidebarDeals,
      IconChevronRight,
      EmptyStateIllustration,
      IconBack,
      IconClose,
      IconAnalysis,
      IconWarning,
      IconEllipsis,
      VPopover,
      Fragment
    },
    computed: mapGetters(['currentUser', 'hasAccess']),
    validations: {
      offer: {
        property: {
          required
        },
        groups: {
          $each: {
            dateRange: {
              from: { required },
              to: { required }
            },
            units: {
              $each: {
                price: {
                  required
                }
              }
            }
          }
        }
      }
    }
  })
  export default class DealPage extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly dealId: string;

    @Prop({
      type: DealDetails,
      required: true
    })
    readonly dealDetails: DealDetails;

    isCreateNewOfferFormShown = false;

    isAnalysisShown = false;

    comment = '';

    isCommentLoading = false;

    offer = null;

    isCreateNewOfferLoading = false;

    analysisCalculator = null;

    isAnalysisCalculatorLoading = false;
    isAnalysisCalculatorError = false;

    tabs = {
      analysis: false,
      offer: false
    };

    currentUser: any;

    isCreatePdfOfferModalShown = false;

    isCancelDealModalOpen = false;
    isCancelDealModalLoading = false;

    isDeleteDealModalOpen = false;
    isDeleteDealModalLoading = false;

    currentOfferId = null;

    hasAccess: (...roles) => boolean;

    get Role() {
      return Role;
    }

    get currentUserInitials() {
      return abbreviation(this.currentUser.name);
    }

    get icons() {
      return {
        IconGroup,
        IconBudget,
        IconNote,
        IconNewDeal,
        IconDocument,
        IconArchive,
        IconPartner,
        IconCheckCircle,
        IconSidebarDeals,
        IconChevronRight,
        IconWarning
      };
    }

    get properties() {
      return groupsModule.properties;
    }

    get unitTypes() {
      return groupsModule.roomTypes;
    }

    get services() {
      return groupsModule.packages;
    }

    get partners() {
      return groupsModule.partners;
    }

    get deal() {
      return this.dealDetails.inquiry;
    }

    get dealName() {
      return this.deal?.name;
    }

    get partnerName() {
      return this.dealDetails.partner.name;
    }

    get numberOfGroups() {
      return String(this.dealDetails.numOfGroups);
    }

    get budget() {
      const { budget, otherExpenses } = this.dealDetails;

      if (budget.amount === null && otherExpenses.amount === null) {
        return null;
      }

      let budgetFormatted = budget.amount
        ? formatPriceNumber(budget.amount)
        : '';

      if (otherExpenses.amount) {
        budgetFormatted += ` + ${formatPriceNumber(otherExpenses.amount)}`;
      }

      return budgetFormatted;
    }

    get note() {
      return this.deal.note;
    }

    get priority() {
      return this.deal.priority;
    }

    get dropdownListItems() {
      const actions = [
        // TODO: uncomment this after deal duplication gets implemented
        // this.createDropdownListItem('Duplicate deal', this.duplicateDeal)
      ];

      if (this.dealDetails.status !== DealStatus.Canceled) {
        actions.push(
          this.createDropdownListItem(
            'Cancel deal',
            () => (this.isCancelDealModalOpen = true)
          )
        );
      }

      actions.push(
        this.createDropdownListItem(
          'Delete deal',
          () => (this.isDeleteDealModalOpen = true)
        )
      );

      return actions;
    }

    createDropdownListItem(label: string, action: () => any) {
      return {
        label,
        action
      };
    }

    onDropdownListItemClick({ action }) {
      action();
    }

    duplicateDeal() {
      console.log('Duplicate deal');
    }

    async cancelDeal() {
      this.isCancelDealModalLoading = true;

      try {
        await groupsModule.cancelDeal(this.dealId);

        this.isCancelDealModalOpen = false;
      } catch (e) {
        console.error(e);
      } finally {
        this.isCancelDealModalLoading = false;
      }
    }

    async deleteDeal() {
      this.isDeleteDealModalLoading = true;

      try {
        await groupsModule.deleteDeal(this.dealId);

        this.isDeleteDealModalOpen = false;

        await this.navigateToDealsPage();
      } catch (e) {
        console.error(e);
      } finally {
        this.isDeleteDealModalLoading = false;
      }
    }

    onCreateOfferClick() {
      this.offer = Offer.from(
        this.dealDetails.id,
        this.dealDetails.inquiry,
        groupsModule.configuration
      );

      this.isCreateNewOfferFormShown = true;
    }

    copyAndEditOffer(offer) {
      this.offer = offer.duplicate();
      this.offer.dealId = this.dealId; // TODO: remove this after API changes

      this.isCreateNewOfferFormShown = true;
    }

    get offerGroupUnitTypeToAnalysisGroupUnitType() {
      return {
        single: UnitType.Single,
        double: UnitType.Double,
        triple: UnitType.Triple,
        quad: UnitType.Family,
        suite: UnitType.Suite
      };
    }

    createAnalysisGroupDto(offerGroup) {
      const {
        dateRange: { from: dateFrom, to: dateTo },
        units
      } = offerGroup;

      const unitsByRoomId = mapValues(
        keyBy(
          units,
          unit =>
            this.offerGroupUnitTypeToAnalysisGroupUnitType[unit.unitType.id]
        ),
        'quantity'
      );

      return {
        dateFrom: formatISODate(dateFrom),
        dateTo: formatISODate(dateTo),
        rooms: fromPairs(
          map(values(UnitType), unitType => [
            unitType,
            get(unitsByRoomId, unitType, 0)
          ])
        )
      };
    }

    async fetchAnalysis(payload) {
      try {
        this.isAnalysisCalculatorLoading = true;
        this.isAnalysisCalculatorError = false;

        const analysisData = await analysisModule.fetchDisplacementAnalysis(
          payload
        );

        this.analysisCalculator = AnalysisCalculatorModel.from(
          this.offer.property,
          this.dealDetails.partner,
          payload.dateRanges,
          analysisData
        );
      } catch (e) {
        this.isAnalysisCalculatorError = true;
      } finally {
        this.isAnalysisCalculatorLoading = false;
      }
    }

    async onOfferAnalysis() {
      const propertyId = this.offer.property.id;
      const partnerId = this.dealDetails.partner.id;

      const groupsDto = map(this.offer.groups, this.createAnalysisGroupDto);

      const payload = {
        propertyId,
        partnerId,
        subchannel: 'GRP BUSINESS',
        dateRanges: groupsDto
      };

      await this.fetchAnalysis(payload);

      this.showAnalysis();
    }

    async onOfferGroupAnalysis(offerGroup) {
      const property = this.offer.property;
      const partner = this.dealDetails.partner;

      const groupDto = this.createAnalysisGroupDto(offerGroup);

      const payload = {
        propertyId: property.id,
        partnerId: partner.id,
        subchannel: 'GRP BUSINESS',
        dateRanges: [groupDto]
      };

      await this.fetchAnalysis(payload);

      this.showAnalysis();
    }

    async applyFilters() {
      this.isAnalysisCalculatorLoading = true;
      this.isAnalysisCalculatorError = false;

      try {
        this.analysisCalculator.analysisData =
          await analysisModule.fetchDisplacementAnalysis(
            this.analysisCalculator.filters
          );
      } catch (e) {
        this.isAnalysisCalculatorError = true;
      } finally {
        this.isAnalysisCalculatorLoading = false;
      }
    }

    onAnalysisReset() {
      this.onOfferGroupAnalysis(first(this.offer.groups));
    }

    showAnalysis() {
      this.isAnalysisShown = true;

      this.tabs.analysis = false;
    }

    discardAnalysis() {
      this.isAnalysisShown = false;

      this.tabs.analysis = false;
    }

    minimizeAnalysis() {
      this.isAnalysisShown = false;

      this.tabs.analysis = true;
    }

    showOffer() {
      this.isCreateNewOfferFormShown = true;

      this.tabs.offer = false;
    }

    minimizeOffer() {
      this.isCreateNewOfferFormShown = false;

      this.tabs.offer = true;
    }

    discardOffer() {
      this.isCreateNewOfferFormShown = false;

      this.offer = null;
      this.tabs.offer = false;

      this.$v.$reset();
    }

    navigateToDealsPage() {
      return navigate(this.$router, { name: pages.DEALS });
    }

    async onComment() {
      this.isCommentLoading = true;
      try {
        await groupsModule.comment(this.comment);

        this.comment = '';
      } finally {
        this.isCommentLoading = false;
      }
    }

    async submitNewOffer(offer) {
      this.isCreateNewOfferLoading = true;

      try {
        await groupsModule.createOffer(offer);

        this.discardOffer();
      } finally {
        this.isCreateNewOfferLoading = false;
      }
    }

    showCreatePdfOfferModal(offerId: string) {
      this.currentOfferId = offerId;
      this.isCreatePdfOfferModalShown = true;
    }

    closeCreatePdfOfferModal() {
      this.isCreatePdfOfferModalShown = false;
    }

    async createPdfOffer(pdfOfferName: string) {
      const newPdfOffer = await groupsModule.createFinalOffer({
        offerId: this.currentOfferId,
        name: pdfOfferName
      });

      this.navigateToPdfOfferPage(newPdfOffer.id);
    }

    navigateToPdfOfferPage(pdfOfferId: string) {
      navigate(this.$router, {
        name: pages.PDF_OFFER,
        params: {
          dealId: this.dealId,
          offerId: this.currentOfferId,
          pdfOfferId
        }
      });
    }

    viewPdfs(offerId) {
      navigate(this.$router, {
        name: pages.PDF_OFFERS,
        params: { dealId: this.dealId, offerId: offerId }
      });
    }

    changeOfferStatus(offer, status) {
      groupsModule.changeOfferStatus({
        offerId: offer.id,
        status: status
      });
    }

    sendToPms(offer) {
      this.changeOfferStatus(offer, 'sentToPms');
    }

    created() {
      groupsModule.UPDATE_BREADCRUMBS([
        {
          path: '/deals',
          label: 'Deals'
        },
        {
          path: `/deals/${this.dealId}`,
          prefix: `#${this.dealId} `,
          label: this.deal?.name
        }
      ]);

      if (!groupsModule.partners) {
        groupsModule.loadPartners();
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;

    min-height: 100vh;
    min-width: 1280px;
  }

  .header-info {
    @include flex-center;

    margin-left: auto;
    max-width: 50%;

    > *:nth-child(1),
    > *:nth-of-type(4) {
      flex-grow: 1;
      min-width: 10ch;
    }

    > * {
      min-width: auto;
    }

    > * + * {
      margin-left: 16px;
    }
  }

  .deal-status-tag {
    margin-left: 24px;
  }

  .dropdown {
    margin-left: 8px;
  }

  .dropdown-list {
    margin-top: 12px;

    background-color: $color-bg-light;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
    border-radius: 4px;

    padding: 8px 0;
    width: 178px;

    &-item {
      height: 48px;
    }
  }

  .header {
    @include row;

    align-items: center;

    padding: 14px 16px 14px 24px;

    border-bottom: 1px solid $color-border-main-light;
    background-color: $color-bg-light;
  }

  .header-title {
    margin: 0;
  }

  .back-btn {
    cursor: pointer;
    margin-right: 32px;
  }

  .icons {
    @include row;
    align-items: center;
    justify-content: space-between;

    flex: 1;

    margin-left: 32px;

    .left {
      @include flex-center;

      > * + * {
        margin-left: 32px;
      }
    }

    .right {
      @include flex-center;

      > * + * {
        margin-left: 8px;
      }
    }
  }

  .main {
    @include row;
    min-height: 0;

    flex: 1;

    > div {
      @include column;
      flex: 1;
    }

    .left {
      border-right: 1px solid $color-border-main-light;
      background-color: $color-bg-main-dimmed;
    }

    .right {
      min-height: 0;

      background-color: $color-bg-main-dimmed;
    }
  }

  .message {
    margin-top: 8px;

    position: relative;

    &:not(:last-child)::before {
      content: '';
      position: absolute;
      top: 40px;
      left: 15px;
      bottom: 0;
      border-left: 2px solid $color-border-main-light;
    }
  }

  .comment-wrapper {
    padding: 24px 40px 24px 24px;
    border-bottom: 1px solid $color-border-main-light;
  }

  .deal-details-container {
    padding: 24px 40px 24px 24px;
  }

  .new-offer {
    min-height: 0;

    background-color: $color-bg-light;
  }

  .row {
    @include row;
    align-items: center;
  }

  .comment-input {
    display: flex;
    flex: 1;
  }

  .comment-button {
    width: 88px;
    height: 36px;

    margin-left: 16px;
  }

  .comment-text {
    max-width: 544px;
  }

  .user-avatar {
    align-self: flex-start;
    margin-right: 20px;
  }

  .create-offer-button {
    width: 120px;
    height: 32px;

    margin-left: 32px;
  }

  .empty-state {
    @include column;
    align-items: center;
    padding: 40px;
  }

  .card {
    margin-left: 60px;
  }

  .badge {
    margin-left: 12px;
  }

  .tabs {
    @include row;

    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    right: 16px;

    > .tab + .tab {
      margin-left: 4px;
    }
  }

  .tab {
    @include row;
    align-items: center;

    padding: 10px 16px;

    width: 260px;

    background: #2a3139;

    cursor: pointer;

    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.08);
    border-radius: 8px 8px 0px 0px;

    color: $color-text-light;

    &:hover {
      background-color: #444d56;
    }

    > * + * {
      margin-left: 8px;
    }

    .icon-close {
      margin-left: auto;

      cursor: pointer;
    }
  }

  .calculator {
    position: fixed;
    bottom: 0;
    z-index: $z-tooltip;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
