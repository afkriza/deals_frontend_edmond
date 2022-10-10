<template>
  <div>
    <div :class="$style.row">
      <ValidationField
        :v="v.dateRange.from"
        :error-messages="errorMessagesDateRangeFrom"
      >
        <template
          #default="{ isError: isErrorFrom, errorMessage: errorMessageFrom }"
        >
          <ValidationField
            :v="v.dateRange.to"
            :error-messages="errorMessagesDateRangeTo"
          >
            <template
              #default="{ isError: isErrorTo, errorMessage: errorMessageTo }"
            >
              <InputDateRange
                :class="$style.inputDateRange"
                :date-from.sync="alternative.dateRange.from"
                :date-to.sync="alternative.dateRange.to"
                :error="isErrorFrom || isErrorTo"
                label-from="From"
                label-to="To"
                :message-from="isErrorFrom ? errorMessageFrom : ''"
                :message-to="isErrorTo ? errorMessageTo : ''"
                calendar
                clearable
                @focus="v.$reset()"
              />
            </template>
          </ValidationField>
        </template>
      </ValidationField>
      <InputMultiselect
        v-model="alternative.properties"
        :class="$style.inputProperties"
        :options="properties"
        search-by="name"
        label="Properties (optional)"
        searchable
      >
        <template #append>
          <IconSearch />
        </template>
      </InputMultiselect>
    </div>
    <div :class="$style.roomsAndServices">
      <span :class="$style.roomsAndServicesTitle">Rooms & services</span>
      <div :class="[$style.row, $style.radios]">
        <InputRadio v-model="mode" label="Whole date range" value="whole" />
        <InputRadio v-model="mode" label="Day by day" value="dayByDay" />
      </div>
      <DayByDayTabs
        v-if="isIntervalValid"
        v-show="mode === 'dayByDay'"
        v-model="activeDate"
        :class="$style.tabs"
        :date-from="alternative.dateRange.from"
        :date-to="alternative.dateRange.to"
      />
      <span v-if="!isIntervalValid && mode === 'dayByDay'" :class="$style.info"
        >Please select a valid date range first</span
      >
      <template v-else>
        <div :class="$style.roomsAndServicesRow">
          <span>Unit type</span>
          <span>Services</span>
          <span>Quantity</span>
        </div>
        <div
          v-for="entry in entries"
          :key="entry.id"
          :class="[$style.roomsAndServicesRow, $style.hover]"
        >
          <InputSelect
            :value="entry.roomType"
            :options="roomTypes"
            search-by="name"
            placeholder="Add unit type"
            @select="onRoomTypeSelect(entry, $event)"
          />
          <InputMultiselect
            :value="entry.packages"
            :options="packages"
            search-by="name"
            placeholder="e.g. “B&B”"
            @select="onPackagesSelect(entry, $event)"
          />
          <InputNumber
            :value="entry.quantity"
            @update="onQuantityInput(entry, $event)"
          />
          <div :class="[$style.row, $style.actions]">
            <ButtonGhost
              v-show="entries.length > 1"
              type="button"
              destructive
              tooltip-text="Delete"
              @click="remove(entry)"
            >
              <template #icon>
                <IconTrash />
              </template>
            </ButtonGhost>
            <ButtonGhost
              type="button"
              tooltip-text="Duplicate"
              @click="duplicate(entry)"
            >
              <template #icon>
                <IconCopy />
              </template>
            </ButtonGhost>
          </div>
        </div>
        <div :class="$style.roomsAndServicesRow">
          <InputSelect
            :options="roomTypes"
            search-by="name"
            placeholder="Add unit type"
            @select="addNewEntry"
          />
        </div>
        <ButtonGhost
          v-if="mode === 'dayByDay'"
          :class="$style.applyToAllDaysBtn"
          type="button"
          text="Apply to all days"
          @click="applyToAllDays"
        />
      </template>
    </div>
    <div :class="$style.buttons">
      <ButtonRegular type="button" @click="onSaveClick">Save</ButtonRegular>
      <ButtonFlat v-if="showCancel" type="button" @click="onCancelClick"
        >Cancel</ButtonFlat
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { cloneDeep, forEach, has, head, keyBy, without } from 'lodash';
  import InputDate from '@/components/inputs/new/InputDate.vue';
  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import InputMultiselect from '@/components/inputs/new/InputMultiselect.vue';
  import IconSearch from '@/assets/images/icons/search.svg';
  import RadioSelect from '@/components/core/RadioSelect.vue';
  import RadioButton from '@/components/core/RadioButton.vue';
  import InputRadio from '@/components/inputs/new/InputRadio.vue';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import ButtonRegular from '@/components/buttons/ButtonRegular.vue';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import DayByDayTabs from '@/components/groups/new-inquiry/DayByDayTabs.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';
  import { eachDayOfInterval, formatISO, isBefore, isValid } from 'date-fns';
  import ValidationField from '@/components/renderless/ValidationField';
  import GroupAlternativeItemEntry from '@/components/groups/new-inquiry/models/GroupAlternativeItemEntry.model.js';
  import GroupAlternativeItem from '@/components/groups/new-inquiry/models/GroupAlternativeItem.model.js';
  import GroupAlternative from '@/components/groups/new-inquiry/models/GroupAlternative.model.js';

  import { errorMessagesFactory } from '@/utils/validation';

  @Component({
    components: {
      ValidationField,
      ButtonGhost,
      DayByDayTabs,
      ButtonFlat,
      ButtonRegular,
      InputNumber,
      InputSelect,
      InputRadio,
      RadioButton,
      RadioSelect,
      InputMultiselect,
      InputDateRange,
      InputDate,
      IconSearch,
      IconCopy,
      IconTrash
    }
  })
  export default class AddAlternativeForm extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly roomTypes;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly packages;

    @Prop({
      type: Object,
      required: true
    })
    readonly alternative!: GroupAlternative;

    @Prop({
      type: Object
    })
    readonly v;

    @Prop({
      type: Boolean
    })
    readonly showCancel: boolean;

    alternativeLocal = this.alternative.duplicate();

    mode = this.alternative.areAllEntriesEqual() ? 'whole' : 'dayByDay';

    activeDate = null;

    get entriesByDate() {
      return keyBy(this.alternative.groupAlternativeItems, 'bookingDate');
    }

    get wholeDateRangeEntries() {
      return head<GroupAlternativeItem>(this.alternative.groupAlternativeItems)
        .entries;
    }

    get dayByDayEntries() {
      return this.entriesByDate[this.activeDateISO].entries;
    }

    get entries() {
      return this.mode === 'whole'
        ? this.wholeDateRangeEntries
        : this.dayByDayEntries;
    }

    set entries(newEntries) {
      if (this.mode === 'whole') {
        this.alternative.applyToAllDays(newEntries);
      } else {
        this.entriesByDate[this.activeDateISO].entries = newEntries;
      }
    }

    get activeDateISO() {
      if (!this.activeDate) {
        return null;
      }

      return this.formatDate(this.activeDate);
    }

    get interval(): Interval {
      return {
        start: this.alternative.dateRange.from,
        end: this.alternative.dateRange.to
      };
    }

    get errorMessagesDateRangeFrom() {
      return errorMessagesFactory({
        required: 'Enter start date',
        presentOrFuture: "Can't be in the past"
      });
    }

    get errorMessagesDateRangeTo() {
      return errorMessagesFactory({
        required: 'Enter end date',
        presentOrFuture: "Can't be in the past"
      });
    }

    onRoomTypeSelect(entry, roomType) {
      entry.roomType = roomType;
    }

    onPackagesSelect(entry, packages) {
      entry.packages = packages;
    }

    onQuantityInput(entry, quantity) {
      if (quantity < 1) {
        return;
      }
      entry.quantity = quantity;
    }

    defaultEntry(roomType?) {
      return GroupAlternativeItemEntry.default({
        roomType: roomType || head(this.roomTypes),
        packages: []
      });
    }

    addNewEntry(roomType) {
      this.entries.push(this.defaultEntry(roomType));
    }

    remove(entry) {
      this.entries = without(this.entries, entry);
    }

    duplicate(entry) {
      this.entries.push(entry.duplicate());
    }

    applyToAllDays() {
      this.alternative.updateAllEntries(this.entries);
    }

    get isIntervalValid() {
      return (
        isValid(this.interval.start) &&
        isValid(this.interval.end) &&
        isBefore(this.interval.start, this.interval.end)
      );
    }

    onSaveClick() {
      this.v.$touch();

      if (this.v.$invalid) {
        return;
      }

      if (this.mode === 'whole') {
        this.applyToAllDays();
      }

      this.$emit('save');
    }

    onCancelClick() {
      if (this.alternative.saved) {
        this.alternative.update(this.alternativeLocal);
      }

      this.$emit('cancel');
    }

    formatDate(date: Date) {
      return formatISO(date, { representation: 'date' });
    }

    @Watch('mode')
    onModeChange() {
      if (!this.isIntervalValid) {
        return;
      }
      this.applyToAllDays();
    }

    @Watch('interval', { immediate: true })
    onDateFromChange() {
      if (!this.isIntervalValid) {
        return;
      }

      this.activeDate = this.interval.start;

      const groupAlternativeItems = [];
      forEach(eachDayOfInterval(this.interval), date => {
        const isoDate = this.formatDate(date);

        if (this.mode === 'whole' || !has(this.entriesByDate, isoDate)) {
          groupAlternativeItems.push(
            new GroupAlternativeItem({
              bookingDate: isoDate,
              entries: cloneDeep(this.wholeDateRangeEntries)
            })
          );
        } else {
          groupAlternativeItems.push(this.entriesByDate[isoDate]);
        }
      });

      this.alternative.groupAlternativeItems = groupAlternativeItems;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .rooms-and-services-row {
    @include row;

    padding: 10px 18px 10px 24px;

    &.hover:hover {
      background-color: $color-bg-primary-dimmed;
    }

    &:hover .actions {
      visibility: visible;
    }

    &:first-of-type {
      color: $color-text-main-light;
      text-transform: uppercase;
      font-size: 12px;
      line-height: 16px;
    }

    > :first-child {
      width: 216px;
    }

    > :nth-child(2) {
      width: 432px;
      margin-left: 16px;
    }

    > :nth-child(3) {
      width: 120px;
      margin-left: 16px;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 216px 1fr 120px;
    grid-auto-flow: row;
    grid-gap: 16px 16px;
  }

  .input-date-range {
    width: 256px;
  }

  .input-properties {
    width: 320px;
  }

  .input-unit-type {
    width: 216px;
  }

  .row {
    @include row;

    > * + * {
      margin-left: 16px;
    }
  }

  .rooms-and-services {
    border: 1px solid #e3e4e5;
    margin-top: 48px;

    padding-top: 24px;
    padding-bottom: 24px;

    border-radius: 4px;

    &-title {
      margin-top: -44px;
      margin-left: 8px;

      background-color: $color-bg-light;

      display: block;
      width: fit-content;

      padding: 8px;

      font-size: 17px;
      font-weight: bold;
    }
  }

  .tabs {
    padding-left: 24px;
    margin-bottom: 24px;
  }

  .radios {
    margin-left: 24px;
    margin-top: 24px;
    margin-bottom: 22px;
  }

  .buttons {
    margin-top: 32px;

    > button + button {
      margin-left: 8px;
    }

    button {
      width: 88px;
      height: 32px;
    }
  }

  .actions {
    visibility: hidden;
    margin-left: auto;
  }

  .apply-to-all-days-btn {
    margin-left: 20px;
    margin-top: 16px;
  }

  .info {
    display: inline-block;
    margin-left: 24px;
    margin-top: 8px;
  }
</style>
