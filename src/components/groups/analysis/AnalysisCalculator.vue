<template>
  <section :class="$style.container">
    <div :class="$style.icons">
      <IconMinus :class="$style.icon" @click="onMinimize" />
      <IconClose :class="$style.icon" @click="onClose" />
    </div>

    <aside :class="$style.sidebar">
      <h3 :class="$style.title">Group analysis</h3>
      <template v-if="hasMultipleGroups">
        <span :class="$style.sectionFromOfferTitle"
          >Showing analysis for the offer:</span
        >
        <section :class="$style.sectionFromOffer">
          <h3>{{ property.name }}</h3>
          <span v-for="group in groups" :class="$style.dateRange">{{
            formatDateRange(group.dateRange.dateFrom, group.dateRange.dateTo)
          }}</span>
        </section>
        <ButtonOutline
          :class="$style.btnResetAnalysis"
          theme="tertiary"
          @click="onResetAnalysisClick"
          >Reset analysis</ButtonOutline
        >
      </template>
      <template v-else>
        <InputSelect
          v-model="selectedProperty"
          :class="$style.input"
          :options="properties"
          placeholder="Search properties"
          searchable
          search-by="name"
          dark
          transparent
        />
        <InputDateRange
          :class="$style.input"
          v-bind.sync="firstGroup.dateRange"
          dark
          calendar
          transparent
        />
        <InputSelect
          v-model="selectedPartner"
          :class="$style.input"
          :options="partners"
          placeholder="Search partners"
          search-by="name"
          searchable
          dark
          transparent
        />

        <div :class="$style.inputs">
          <div :class="$style.unitRow">
            <span>Unit</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
          <div
            v-for="unit in firstGroup.units"
            :key="unit.unitType"
            :class="$style.unitRow"
          >
            <InputRadio
              v-model="selectedUnitType"
              :class="$style.input"
              :value="unit.unitType"
              dark
            >
              <template #label>
                <b :class="$style.label">{{ unit.unitType }}</b>
              </template>
            </InputRadio>
            <InputNumber
              :value="unit.quantity"
              :class="$style.input"
              dark
              transparent
              @update="onQuantityUpdate(unit, $event)"
            />
            <InputCurrency
              :value="unit.price"
              :class="$style.input"
              dark
              decimal
              transparent
              @change="onPriceChange(unit, $event)"
            />
          </div>
          <footer :class="$style.footer">
            <ButtonRegular
              :class="$style.btnAction"
              is-inverted
              @click="applyFilters"
              >Apply filters</ButtonRegular
            >
          </footer>
        </div>
      </template>
    </aside>
    <template v-if="isLoading">
      <AppLoader :class="$style.loader" loading-text="Loading..." dark />
    </template>
    <template v-else-if="isError">
      <AppEmptyState
        :class="$style.error"
        :empty-state-icon="ErrorStateIllustration"
        title="Something went wrong"
        description="We couln’t load the analysis."
        dark
      />
    </template>
    <template v-else>
      <AnalysisCalculatorUnitPrice
        :unit-type="selectedUnitType"
        :cancellation-probability="cancellationProbability"
        :wash-factor="washFactor"
        :recommended-price="recommendedPrice"
        :break-even-price="breakEvenPrice"
        :current-price.sync="selectedRoomPrice"
        :history-data="historyData"
        :range="range"
        @table-view="showTableView"
      />
      <AnalysisCalculatorOccupancyAndRevenue
        :class="$style.occupancyAndRevenue"
        :booking-periods="bookingPeriods"
        :room-prices="roomPrices"
      />
    </template>
  </section>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import SegmentControl from '@/components/inputs/SegmentControl.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  import IconTableDark from '@/assets/images/icons/table-dark.svg';
  import AnalysisCalculatorTextCard from '@/components/groups/analysis/AnalysisCalculatorTextCard.vue';
  import AnalysisCalculatorGraphCard from '@/components/groups/analysis/AnalysisCalculatorGraphCard.vue';
  import AnalysisCalculatorOccupancyAndRevenue from '@/components/groups/analysis/AnalysisCalculatorOccupancyAndRevenue.vue';
  import AnalysisCalculatorUnitPrice from '@/components/groups/analysis/AnalysisCalculatorUnitPrice.vue';

  import IconMinus from '@/assets/images/icons/widget-operators/minus.svg';
  import IconClose from '@/assets/images/icons/close-2px.svg';
  import InputCheckbox from '@/components/inputs/new/InputCheckbox.vue';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import InputRadio from '@/components/inputs/new/InputRadio.vue';
  import ButtonRegular from '@/components/buttons/ButtonRegular.vue';
  import IconAddFlat from '@/assets/images/icons/add-flat.svg';
  import { first, values, size, last } from 'lodash';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import AppLoader from '@/components/app/AppLoader.vue';
  import ErrorStateIllustration from '@/assets/images/icons/Error state/general-dark.svg';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';

  import { pages } from '@/enums/pages';

  import { RoomTypes } from '@/enums/analysis-calculator';
  import ButtonOutline from '@/components/buttons/ButtonOutline.vue';
  import UserAvatar from '@/components/groups/deal/UserAvatar.vue';
  import UserAvatarInfo from '@/components/groups/deal/UserAvatarInfo.vue';
  import {
    AnalysisGroup,
    UnitType
  } from '@/models/analysis/AnalysisCalculator.model';
  import { formatDateRange } from '@/components/groups/shared/utils';
  import { formatISO } from 'date-fns';

  @Component({
    components: {
      UserAvatarInfo,
      UserAvatar,
      ButtonOutline,
      AppEmptyState,
      AppLoader,
      ButtonFlat,
      ButtonRegular,
      InputRadio,
      InputNumber,
      InputCheckbox,
      AnalysisCalculatorUnitPrice,
      AnalysisCalculatorOccupancyAndRevenue,
      AnalysisCalculatorGraphCard,
      AnalysisCalculatorTextCard,
      ButtonGhost,
      InputCurrency,
      SegmentControl,
      InputDateRange,
      InputSelect,
      IconTableDark,
      IconMinus,
      IconClose,
      IconAddFlat,
      ErrorStateIllustration
    },
    methods: {
      formatDateRange
    }
  })
  export default class AnalysisCalculator extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly analysisCalculator;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly partners;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Prop({
      type: Boolean
    })
    readonly isError: boolean;

    get groups(): AnalysisGroup[] {
      return this.analysisCalculator.groups;
    }

    get hasMultipleGroups() {
      return size(this.groups) > 1;
    }

    get dateRange() {
      return {
        dateFrom: this.firstGroup.dateRange.dateFrom,
        dateTo: this.lastGroup.dateRange.dateTo
      };
    }

    get firstGroup() {
      return first(this.groups);
    }

    get lastGroup() {
      return last(this.groups);
    }

    get selectedUnitType() {
      return this.analysisCalculator.selectedUnitType;
    }

    set selectedUnitType(unitType: UnitType) {
      this.analysisCalculator.selectedUnitType = unitType;
    }

    get property() {
      return this.analysisCalculator.property;
    }

    get partner() {
      return this.analysisCalculator.partner;
    }

    get breakEvenPrice() {
      return this.analysisCalculator.breakEvenPrice;
    }

    get recommendedPrice() {
      return this.analysisCalculator.recommendedPrice;
    }

    get selectedRoomPrice() {
      return this.analysisCalculator.selectedUnitTypePrice;
    }

    set selectedRoomPrice(price: number) {
      this.analysisCalculator.selectedUnitTypePrice = price;
    }

    get historyData() {
      return this.analysisCalculator.historyData;
    }

    get range() {
      return this.analysisCalculator.range;
    }

    get bookingPeriods() {
      return this.analysisCalculator.bookingPeriods;
    }

    get roomPrices() {
      return this.analysisCalculator.roomPrices;
    }

    get cancellationProbability() {
      return this.analysisCalculator.cancellationProbability;
    }

    get washFactor() {
      return this.analysisCalculator.washFactor;
    }

    get unitTypes() {
      return values(RoomTypes);
    }

    get ErrorStateIllustration() {
      return ErrorStateIllustration;
    }

    get selectedProperty() {
      return this.property;
    }

    set selectedProperty(property) {
      this.analysisCalculator.property = property;
    }

    get selectedPartner() {
      return this.partner;
    }

    set selectedPartner(partner) {
      this.analysisCalculator.partner = partner;
    }

    onQuantityUpdate(unit, quantity) {
      if (quantity < 0) {
        return;
      }

      unit.quantity = quantity;
    }

    onPriceChange(unit, price) {
      const range = this.analysisCalculator.analysisData.ranges[unit.unitType];

      unit.price = Math.max(range.from, Math.min(price, range.to));
    }

    showTableView() {
      const routeData = this.$router.resolve({
        name: pages.PRICE_ANALYSIS,
        query: {
          propertyId: this.property.id,
          partnerId: this.partner.id,
          beginDate: formatISO(this.dateRange.dateFrom, {
            representation: 'date'
          }),
          endDate: formatISO(this.dateRange.dateTo, { representation: 'date' })
        }
      });
      window.open(routeData.href, '_blank');
    }

    @Emit('reset')
    onResetAnalysisClick() {
      return true;
    }

    @Emit('close')
    onClose() {
      return true;
    }

    @Emit('minimize')
    onMinimize() {
      return;
    }

    @Emit('filters:apply')
    applyFilters() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    position: relative;
    display: grid;

    grid-template-columns: 300px 440px 462px;
    grid-template-rows: 1fr;
    grid-template-areas: 'sidebar price displacement';
    grid-gap: 16px;

    height: 554px;

    background: #21272f;

    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
    border-radius: 12px 12px 0 0;

    padding: 20px 16px 16px;
  }

  .sidebar {
    @include column;

    color: $color-text-light;

    .title {
      margin: 0 0 16px;
    }

    .input {
      width: 100%;
    }

    .input + .input {
      margin-top: 10px;
    }
  }

  .section-from-offer-title {
    color: $color-text-main-mild-light;

    margin-bottom: 8px;
  }

  .section-from-offer {
    @include column;

    padding: 20px;

    background-color: $color-bg-primary-darker;

    border-radius: 6px;

    flex: 1;

    h3 {
      margin: 0 0 12px;
    }

    .date-range {
      display: block;
      color: $color-text-main-lighter;
    }
  }

  .btn-reset-analysis {
    height: 32px;
    background-color: transparent;
    border-color: #444d56;
    margin-top: 16px;
  }

  .unit-row {
    @include row;

    > span {
      font-size: 12px;
      color: $color-text-main-mild-light;
    }

    > * + * {
      margin-left: 4px;
    }

    > * {
      &:nth-child(1) {
        flex: 1;
      }

      &:nth-child(2) {
        width: 96px;
      }

      &:nth-child(3) {
        width: 116px;
      }
    }
  }

  .icons {
    @include row;
    position: absolute;

    top: 16px;
    right: 16px;

    color: $color-text-light;

    .icon {
      cursor: pointer;
    }

    > * + * {
      margin-left: 8px;
    }
  }

  .row {
    display: flex;

    .card + .card {
      margin-left: 8px;
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr minmax(48px, 64px);
    grid-template-areas: 'left right' 'bottom-left right';
    grid-gap: 16px;
  }

  .loader,
  .error {
    grid-area: 1 / 2 / 2 / 4;
  }

  .occupancy-and-revenue {
  }

  .card-unit-price {
    padding: 12px 20px 18px;
  }

  .card {
    background: #2a3139;
    border-radius: 6px;

    flex: 1;

    .title {
      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;

      color: $color-text-main-mild-light;
    }
  }

  .inputs {
    @include column;
    margin-top: 20px;

    flex: 1;
  }

  .cancellation-probability {
    @include flex-center;
    justify-content: space-between;
    padding: 12px 20px;

    flex: 1;
  }

  .btn {
    margin-left: auto;
  }

  .checkbox {
    padding: 7px 3px;
  }

  .footer {
    @include row;
    justify-content: flex-end;

    margin-top: auto;
  }

  .label {
    color: $color-text-light;

    text-transform: capitalize;
  }

  .btn-action {
    text-transform: uppercase;
    height: 32px;
    min-width: 88px;
    padding: 6px 16px;
  }

  .btn-action + .btn-action {
    margin-left: 8px;
  }

  .btn-units {
    position: relative;
    left: -8px;
    align-self: flex-start;

    margin-top: 8px;
  }

  .cancellation-probability + .cancellation-probability {
    margin-left: 4px;
  }
</style>
