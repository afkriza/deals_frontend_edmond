<template>
  <div :class="[$style.header, showBottomBorder && $style.bottomBorder]">
    <basic-dropdown
      :customContentClass="$style.dropdownPicker"
      :disabled="true"
      :isOpen="isPickerOpen"
      :offset="{ horizontal: 0, vertical: 15 }"
      :resetStyle="true"
      @dropdown:close="toggleDatePicker"
    >
      <template slot="trigger">
        <date-slider
          :class="$style.dateSlider"
          :month="activeMonth"
          :type="timeGranulation"
          :year="activeYear"
          @click:left="onDateSubmitted"
          @click:right="onDateSubmitted"
          @click:title="toggleDatePicker"
        />
      </template>
      <date-picker
        :class="$style.datePicker"
        :current-month="activeMonth"
        :current-year="activeYear"
        :type="timeGranulation"
        @date:change="onDateSubmitted"
      />
    </basic-dropdown>
    <progress-info
      :class="$style.progressInfo"
      :progress="progress"
      :total="total"
      v-if="showProgressInfo"
    />
    <simple-dropdown
      :class="$style.timeGranulationDropdown"
      :customContentClass="$style.dropdownPicker"
      :isOpen="isPickerSelectOpen"
      @dropdown:close="onPickerSelectClose"
      @dropdown:open="onPickerSelectOpen"
      theme="dark"
    >
      <template slot="trigger">
        <span :class="$style.timeGranulationDropdownTitle">{{
          pickerSelectTitle
        }}</span>
      </template>
      <template>
        <time-granulation-dropdown-list
          :class="$style.timeGranulationList"
          :items="timeGranulationItems"
          @select="onPickerItemSelect"
        />
      </template>
    </simple-dropdown>
  </div>
</template>

<script>
  import SimpleDropdown from '../core/SimpleDropdown.vue';
  import DatePicker from './DatePicker.vue';
  import DateSlider from './DateSlider.vue';
  import ProgressInfo from './ProgressInfo.vue';
  import TimeGranulationDropdownList from './TimeGranulationDropdownList.vue';
  import BasicDropdown from 'components/core/BasicDropdown';

  import {
    CURRENT_YEAR,
    MONTHS,
    TIME_GRANULATION_LIST
  } from '../../enums/date.js';
  import { isKey } from 'utils/keyboard-events';
  import { KEY_M, KEY_Y } from 'constants/keyboard';

  export default {
    components: {
      SimpleDropdown,
      DatePicker,
      DateSlider,
      ProgressInfo,
      TimeGranulationDropdownList,
      BasicDropdown
    },
    name: 'OverviewHeader',
    props: {
      timeGranulation: {
        type: String,
        required: true,
        validator(value) {
          return ['month', 'year'].includes(value);
        }
      },
      progress: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 100
      },
      activeYear: {
        type: Number,
        required: true
      },
      activeMonth: {
        type: Number,
        required: true
      },
      showBottomBorder: {
        type: Boolean,
        default: false
      },

      activeDate: {
        type: Object,
        default() {
          return {
            year: CURRENT_YEAR,
            month: MONTHS[1]
          };
        },
        validator(value) {
          return value.year && Number.isInteger(value.year);
        }
      },

      isLoading: Boolean
    },
    data() {
      return {
        isPickerSelectOpen: false,
        isPickerOpen: false,
        timeGranulationItems: TIME_GRANULATION_LIST
      };
    },

    computed: {
      pickerSelectTitle() {
        return this.timeGranulation === 'month'
          ? TIME_GRANULATION_LIST[0].name
          : TIME_GRANULATION_LIST[1].name;
      },
      showProgressInfo() {
        if (this.isLoading) {
          return false;
        }

        return !(
          (this.progress === 0 && this.total === 0) ||
          (this.progress === null && this.total === null)
        );
      }
    },
    methods: {
      onKeyDown(event) {
        if (isKey(KEY_M, event)) {
          this.$emit('timeGranulation:select', TIME_GRANULATION_LIST[0].value);
        }
        if (isKey(KEY_Y, event)) {
          this.$emit('timeGranulation:select', TIME_GRANULATION_LIST[1].value);
        }
      },
      onPickerSelectOpen() {
        this.isPickerSelectOpen = true;
      },
      onPickerSelectClose() {
        this.isPickerSelectOpen = false;
      },
      onPickerItemSelect({ value }) {
        this.isPickerSelectOpen = false;
        this.$emit('timeGranulation:select', value);
      },
      onDateSubmitted({ year, month }) {
        this.isPickerOpen = false;

        this.$emit('date:change', {
          year,
          month
        });
      },
      toggleDatePicker() {
        this.isPickerOpen = !this.isPickerOpen;
      }
    },
    created() {
      document.addEventListener('keydown', this.onKeyDown);
    },

    destroyed() {
      document.removeEventListener('keydown', this.onKeyDown);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;

    &.bottom-border {
      border-bottom: 1px solid $color-border-main-light;
    }
  }

  .date-slider {
    min-width: 200px;
  }

  .date-picker {
    min-width: 300px;
    padding: 8px;
    color: $color-text-main;
  }

  .date-picker,
  .dropdown-picker {
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  .progress-info {
    min-width: 200px;
  }

  .time-granulation-dropdown {
    min-width: 95px;

    &-title {
      font-weight: bold;
    }
  }

  .time-granulation-list {
    width: 128px;
  }
</style>
