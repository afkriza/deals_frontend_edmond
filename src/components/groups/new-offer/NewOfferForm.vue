<template>
  <div :class="$style.container">
    <header :class="$style.header">
      <div>
        <IconDocument />
        <h4>New offer</h4>
      </div>
      <div>
        <IconMinus @click="onMinimize" />
        <IconClose @click="onCancel" />
      </div>
    </header>
    <form>
      <div :class="[$style.section, $style.property]">
        <label for="property">Property</label>

        <InputSelect
          id="property"
          v-model="offer.property"
          :class="$style.propertyInput"
          :options="properties"
          searchable
          search-by="name"
          placeholder="Search properties"
        />
        <ButtonGhost
          v-show="numberOfGroups > 1"
          :class="$style.buttonOfferAnalysis"
          type="button"
          text="Show analysis for this offer"
          @click="onOfferAnalysisClick"
        >
          <template #icon>
            <IconAnalysis />
          </template>
        </ButtonGhost>
      </div>
      <div
        v-for="(group, groupIndex) in offer.groups"
        :key="group.id"
        :class="$style.section"
      >
        <div :class="$style.sectionHeader">
          <ValidationField
            :v="v.offer.groups.$each.$iter[groupIndex].dateRange"
          >
            <template #default="{ isError }">
              <InputDateRange
                :class="$style.dateRangeInput"
                :date-from.sync="group.dateRange.from"
                :date-to.sync="group.dateRange.to"
                :error="isError"
                label-from="From"
                label-to="To"
                :message-from="isError ? 'Enter start date' : ''"
                :message-to="isError ? 'Enter end date' : ''"
                calendar
                clearable
                @focus="
                  v.offer.groups.$each.$iter[groupIndex].dateRange.$reset()
                "
              />
            </template>
          </ValidationField>
          <div :class="$style.sectionHeaderActions">
            <ButtonGhost
              type="button"
              tooltip-text="Show analysis for this date range"
              oval
              @click="onOfferGroupAnalysisClick(group)"
            >
              <template #icon>
                <IconAnalysis />
              </template>
            </ButtonGhost>
            <ButtonGhost
              type="button"
              tooltip-text="Duplicate"
              oval
              @click="duplicateGroup(group)"
            >
              <template #icon>
                <IconCopy />
              </template>
            </ButtonGhost>
            <ButtonGhost
              v-show="offer.groups.length > 1"
              type="button"
              tooltip-text="Delete"
              destructive
              oval
              @click="deleteGroup(group)"
            >
              <template #icon>
                <IconTrash />
              </template>
            </ButtonGhost>
          </div>
        </div>

        <div :class="$style.unitTypeGrid">
          <span>Unit type</span>
          <span>Quantity</span>
          <span>Service</span>
          <span>Price</span>
          <div></div>
          <div
            v-for="(unit, unitIndex) in group.units"
            :key="unit.id"
            :class="$style.unitTypeGrid"
          >
            <InputSelect
              v-model="unit.unitType"
              :options="unitTypes"
              search-by="name"
            />
            <InputNumber v-model="unit.quantity" :default-value="0" />
            <InputSelect
              v-model="unit.service"
              :options="services"
              search-by="name"
            />
            <ValidationField
              :v="
                v.offer.groups.$each.$iter[groupIndex].units.$each.$iter[
                  unitIndex
                ].price
              "
              :error-messages="{ required: 'Please enter a price' }"
            >
              <template #default="{ isError, errorMessage }">
                <InputCurrency
                  v-model="unit.price"
                  decimal
                  :error="isError"
                  :message="errorMessage"
                  clearable
                  @focus="
                    v.offer.groups.$each.$iter[groupIndex].units.$each.$iter[
                      unitIndex
                    ].price.$reset()
                  "
                />
              </template>
            </ValidationField>
            <div :class="[$style.row, $style.actions]">
              <ButtonGhost
                type="button"
                tooltip-text="Duplicate"
                oval
                @click="duplicateUnit(group, unit)"
              >
                <template #icon>
                  <IconCopy />
                </template>
              </ButtonGhost>
              <ButtonGhost
                v-show="group.units.length > 1"
                type="button"
                destructive
                oval
                tooltip-text="Delete"
                @click="removeUnit(group, unit)"
              >
                <template #icon>
                  <IconTrash />
                </template>
              </ButtonGhost>
            </div>
          </div>
          <InputSelect
            :class="$style.addUnitTypeInput"
            :options="unitTypes"
            search-by="name"
            placeholder="Add unit type"
            @select="addUnit(group, $event)"
          />
        </div>
      </div>
      <ButtonGhost
        :class="$style.addDateBtn"
        text="Add date"
        type="button"
        @click="addGroup"
      >
        <template #icon>
          <IconAddFlat />
        </template>
      </ButtonGhost>
    </form>
    <footer :class="$style.footer">
      <ButtonOutline type="button" theme="secondary" @click="onCancel"
        >Discard</ButtonOutline
      >
      <ButtonRegular :is-loading="loading" @click="onSubmit"
        >Send offer</ButtonRegular
      >
    </footer>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import { first, size } from 'lodash';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import Offer from '@/components/groups/new-offer/models/Offer.model';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import ButtonRegular from '@/components/buttons/ButtonRegular.vue';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconAddFlat from '@/assets/images/icons/add-flat.svg';
  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import OfferGroup from '@/components/groups/new-offer/models/OfferGroup.model';
  import OfferGroupUnit from '@/components/groups/new-offer/models/OfferGroupUnit.model';
  import InputMultiselect from '@/components/inputs/new/InputMultiselect.vue';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import IconDocument from '@/assets/images/icons/Deal page/Header/Timeline/Offer/Status/Misc/ic-24-document.svg';
  import IconMinus from '@/assets/images/icons/widget-operators/minus.svg';
  import IconClose from '@/assets/images/icons/close-2px.svg';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';
  import IconAnalysis from '@/assets/images/icons/Deals/ic-24-deals-analysis.svg';

  import ButtonOutline from '@/components/buttons/ButtonOutline.vue';
  import ValidationField from '@/components/renderless/ValidationField';
  import DateRange from '@/components/groups/new-inquiry/models/DateRange.model';

  @Component({
    components: {
      ValidationField,
      ButtonOutline,
      InputCurrency,
      InputNumber,
      InputMultiselect,
      InputDateRange,
      ButtonGhost,
      BaseCard,
      ButtonRegular,
      ButtonFlat,
      InputSelect,
      IconAddFlat,
      IconCopy,
      IconTrash,
      IconDocument,
      IconClose,
      IconMinus,
      IconAnalysis
    }
  })
  export default class NewOfferForm extends Vue {
    @Prop({
      type: Offer,
      required: true
    })
    readonly offer;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly unitTypes;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly services;

    @Prop({
      type: Object,
      required: true
    })
    readonly v;

    @Prop({
      type: Boolean
    })
    readonly loading: boolean;

    get numberOfGroups() {
      return size(this.offer.groups);
    }

    get defaultUnit() {
      return new OfferGroupUnit({
        unitType: first(this.unitTypes),
        quantity: 1,
        service: first(this.services),
        price: null
      });
    }

    get defaultGroup() {
      return new OfferGroup({
        dateRange: new DateRange({ from: null, to: null }),
        offerGroupUnits: [this.defaultUnit.duplicate()]
      });
    }

    addGroup() {
      this.offer.addGroup(this.defaultGroup.duplicate());
    }

    @Emit('analysis:offer')
    onOfferAnalysisClick() {
      return this.offer;
    }

    @Emit('analysis:offer-group')
    onOfferGroupAnalysisClick(offerGroup) {
      return offerGroup;
    }

    duplicateGroup(group) {
      this.offer.duplicateGroup(group);
    }

    deleteGroup(group) {
      this.offer.deleteGroup(group);
    }

    removeUnit(group, unit) {
      group.removeUnit(unit);
    }

    duplicateUnit(group, unit) {
      group.addUnit(unit.duplicate());
    }

    addUnit(group, unitType) {
      const defaultUnit = this.defaultUnit.duplicate();
      defaultUnit.unitType = unitType;

      group.addUnit(defaultUnit);
    }

    onSubmit() {
      this.v.$touch();

      if (this.v.$invalid) {
        return;
      }

      this.$emit('submit', this.offer);
    }

    @Emit('cancel')
    onCancel() {
      return;
    }

    @Emit('minimize')
    onMinimize() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    display: grid;
    grid-template-rows: 44px 1fr 80px;
    grid-template-columns: 1fr;

    flex: 1;

    form {
      overflow-y: auto;
    }
  }

  .header {
    @include row;
    justify-content: space-between;
    background-color: $color-bg-primary-dark;
    color: $color-bg-light;

    padding: 10px 24px;

    h4 {
      margin: 0;
    }

    div {
      @include row;
      align-items: center;
    }

    div > * + * {
      margin-left: 8px;
    }

    svg {
      cursor: pointer;
    }
  }

  .section-header {
    @include row;
    justify-content: space-between;

    margin-bottom: 26px;
  }

  .section-header-actions {
    @include flex-center;
  }

  .footer {
    @include row;
    justify-content: flex-end;
    align-items: center;

    position: sticky;
    bottom: 0;

    padding: 16px 24px;
    background-color: $color-bg-light;

    border-top: 1px solid $color-border-main-light;

    button {
      width: 220px;
      height: 48px;
    }

    button + button {
      margin-left: 16px;
    }
  }

  .section {
    border-bottom: 1px solid $color-border-main-light;
    padding: 16px 24px;

    &.property {
      @include row;
      align-items: center;

      > * + * {
        margin-left: 32px;
      }

      .button-offer-analysis {
        margin-left: auto;
      }
    }
  }

  .unit-type-grid {
    display: grid;
    grid-template-columns: minmax(190px, 290px) 120px minmax(160px, 191px) 120px minmax(
        104px,
        1fr
      );
    column-gap: 16px;

    > span {
      color: $color-text-main-light;
      text-transform: uppercase;
      font-size: 12px;
      line-height: 16px;
      margin-bottom: 6px;
      font-weight: bold;
    }

    & > .unit-type-grid {
      grid-column: 1/6;
      margin: 0 -24px;
      padding: 10px 24px;

      &:hover {
        background-color: $color-bg-primary-dimmed;
      }

      &:hover .actions {
        visibility: visible;
      }
    }
  }

  .add-unit-type-input {
    margin: 10px 0;
  }

  .actions {
    @include row;

    visibility: hidden;
    margin-left: 24px;
  }

  .property-input {
    width: 320px;
  }

  .date-range-input {
    width: 256px;
  }

  .card {
    @include column;
  }

  .add-date-btn {
    width: 100%;
    height: 72px;

    justify-content: flex-start;

    border: none !important;
    border-radius: 0;
    padding: 24px 32px;
  }
</style>
