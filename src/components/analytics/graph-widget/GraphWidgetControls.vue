<template>
  <div :class="$style.controls">
    <BasicDropdown
      :class="$style.dropdown"
      :offset="{ vertical: 8 }"
      close-on-select
      auto
      :disabled="xAxisDropdownDisabled"
    >
      <template #trigger="{ isOpen }">
        <AnimatedInput
          :class-override="$style.trigger"
          :value="camelCaseToCapitalizedCase(selectedXAxis)"
          label="X-axis"
          disabled
        >
          <template #default>
            <IconCaretDown
              :class="[
                $style.absolute,
                $style.caret,
                {
                  [$style.rotated]: isOpen,
                  [$style.disabled]: xAxisDropdownDisabled
                }
              ]"
            />
          </template>
        </AnimatedInput>
      </template>
      <DropdownList
        :class="$style.dropdownList"
        :custom-item-class="$style.dropdownListItem"
        :items="xAxisOptions"
        :disabled-items="disabledXAxisOptions"
        @select="onXAxisOptionSelect"
      >
        <template #item="{ item }">
          <span>{{ camelCaseToCapitalizedCase(item) }}</span>
        </template>
      </DropdownList>
    </BasicDropdown>
    <BasicDropdown
      :class="$style.dropdown"
      auto
      :disabled="yAxisDropdownDisabled"
    >
      <template #trigger="{ isOpen }">
        <AnimatedInput
          :class="$style.arrow"
          :class-override="$style.trigger"
          :value="selectedYAxisValue"
          label="Y-axis"
          disabled
        >
          <template #default>
            <IconCaretDown
              :class="[
                $style.absolute,
                $style.caret,
                {
                  [$style.rotated]: isOpen,
                  [$style.disabled]: yAxisDropdownDisabled
                }
              ]"
            />
          </template>
        </AnimatedInput>
      </template>
      <DropdownList
        :class="$style.dropdownList"
        :custom-item-class="$style.dropdownListItem"
        :items="yAxisOptions"
        @select="onYAxisOptionCheck"
      >
        <template #item="{ item }">
          <CheckboxField
            :key="item"
            :class="$style.dropdownItem"
            :checked="selectedYAxis.includes(item)"
            :condensed="true"
            :reverse="true"
          />
          <span>{{ item }}</span>
        </template>
      </DropdownList>
    </BasicDropdown>
    <BasicDropdown
      :class="$style.dropdown"
      :offset="{ vertical: 8 }"
      close-on-select
      auto
    >
      <template #trigger="{ isOpen }">
        <AnimatedInput
          :class="$style.arrow"
          :class-override="$style.trigger"
          :value="camelCaseToCapitalizedCase(selectedBreakdownCategory)"
          label="Breakdown category"
          disabled
        >
          <template #default>
            <IconCaretDown
              :class="[
                $style.absolute,
                $style.caret,
                isOpen ? $style.rotated : null
              ]"
            />
          </template>
        </AnimatedInput>
      </template>
      <DropdownList
        :class="$style.dropdownList"
        :custom-item-class="$style.dropdownListItem"
        :items="breakdownCategories"
        :disabled-items="disabledBreakdownCategories"
        @select="$emit('breakdown-category:select', $event)"
      >
        <template #item="{ item }">
          <span>{{ camelCaseToCapitalizedCase(item) }}</span>
        </template>
      </DropdownList>
    </BasicDropdown>
    <BasicDropdown
      v-if="showBreakdownTimeGranulationDropdown"
      :class="$style.breakdownTimeGranulationDropdown"
      :offset="{ vertical: 8 }"
      close-on-select
      auto
    >
      <template #trigger="{ isOpen }">
        <ButtonFlat :class="[$style.button, { [$style.pressed]: isOpen }]">
          <component :is="selectedBreakdownTimeGranulationIcon" />
          <IconCaretDown
            :class="[$style.caret, isOpen ? $style.rotated : null]"
          />
        </ButtonFlat>
      </template>
      <DropdownList
        :class="$style.dropdownList"
        :items="breakdownTimeGranulations"
        @select="$emit('breakdown-time-granulation:select', $event.id)"
      >
        <template #item="{ item, isHover }">
          <div
            :class="[
              $style.granulationListItem,
              {
                [$style.active]:
                  selectedBreakdownTimeGranulation === item.id || isHover
              }
            ]"
          >
            <component
              :is="
                isHover || selectedBreakdownTimeGranulation === item.id
                  ? item.iconBold
                  : item.icon
              "
            /><span>{{ camelCaseToCapitalizedCase(item.id) }}</span>
          </div>
        </template>
      </DropdownList>
    </BasicDropdown>
  </div>
</template>

<script>
  import { forEach, isEmpty, lowerCase, upperFirst, map, size } from 'lodash';
  import { formatCalculations } from 'utils/widgets/graph';
  import BasicDropdown from 'components/core/BasicDropdown';
  import CheckboxField from 'components/core/Checkbox';
  import DropdownList from '@/components/core/DropdownList';
  import AnimatedInput from '@/components/inputs/AnimatedInput';
  import IconCaretDown from '@/assets/images/icons/caret-down.svg';
  import {
    BREAKDOWN_TIME_GRANULATIONS,
    DAY,
    MONTH,
    WEEK,
    YEAR
  } from '@/constants/widget';

  import IconCalendarDay from '@/assets/images/icons/Analytics/Calendar/day.svg';
  import IconCalendarWeek from '@/assets/images/icons/Analytics/Calendar/week.svg';
  import IconCalendarMonth from '@/assets/images/icons/Analytics/Calendar/month.svg';
  import IconCalendarYear from '@/assets/images/icons/Analytics/Calendar/year.svg';

  import IconBoldCalendarDay from '@/assets/images/icons/Analytics/Calendar/day-2px.svg';
  import IconBoldCalendarWeek from '@/assets/images/icons/Analytics/Calendar/week-2px.svg';
  import IconBoldCalendarMonth from '@/assets/images/icons/Analytics/Calendar/month-2px.svg';
  import IconBoldCalendarYear from '@/assets/images/icons/Analytics/Calendar/year-2px.svg';

  import ButtonFlat from '@/components/buttons/ButtonFlat';

  export default {
    components: {
      ButtonFlat,
      AnimatedInput,
      DropdownList,
      BasicDropdown,
      CheckboxField,
      IconCaretDown
    },

    props: {
      selectedXAxis: {
        type: String,
        default: null
      },

      xAxisOptions: {
        type: Array,
        required: true
      },

      selectedYAxis: {
        type: Array,
        default: () => []
      },

      yAxisOptions: {
        type: Array,
        required: true
      },

      selectedBreakdownCategory: {
        type: String,
        default: null
      },

      breakdownCategories: {
        type: Array,
        required: true
      },

      selectedBreakdownTimeGranulation: {
        type: String,
        required: true,
        validator(value) {
          return BREAKDOWN_TIME_GRANULATIONS.includes(value);
        }
      },

      showBreakdownTimeGranulationDropdown: Boolean
    },

    computed: {
      selectedYAxisValue() {
        return formatCalculations(this.selectedYAxis);
      },

      selectedBreakdownTimeGranulationIcon() {
        return this.calendarIconByTimeGranulation[
          this.selectedBreakdownTimeGranulation
        ];
      },

      selectedBreakdownTimeGranulationIconBold() {
        return this.calendarIconByTimeGranulation[
          this.selectedBreakdownTimeGranulation
        ];
      },

      calendarIconByTimeGranulation() {
        return {
          [DAY]: IconCalendarDay,
          [WEEK]: IconCalendarWeek,
          [MONTH]: IconCalendarMonth,
          [YEAR]: IconCalendarYear
        };
      },

      calendarIconBoldByTimeGranulation() {
        return {
          [DAY]: IconBoldCalendarDay,
          [WEEK]: IconBoldCalendarWeek,
          [MONTH]: IconBoldCalendarMonth,
          [YEAR]: IconBoldCalendarYear
        };
      },

      breakdownTimeGranulations() {
        return map(BREAKDOWN_TIME_GRANULATIONS, timeGranulation => ({
          id: timeGranulation,
          icon: this.calendarIconByTimeGranulation[timeGranulation],
          iconBold: this.calendarIconBoldByTimeGranulation[timeGranulation]
        }));
      },

      xAxisDropdownDisabled() {
        return size(this.xAxisOptions) === 1;
      },

      yAxisDropdownDisabled() {
        return size(this.yAxisOptions) === 1;
      },

      breakdownCategoryDropdownDisabled() {
        return size(this.breakdownCategories) === 1;
      },

      disabledXAxisOptions() {
        return [this.selectedBreakdownCategory];
      },

      disabledBreakdownCategories() {
        return [this.selectedXAxis];
      }
    },

    methods: {
      camelCaseToCapitalizedCase(value) {
        return upperFirst(lowerCase(value));
      },
      onXAxisOptionSelect(xAxisOption) {
        return this.$emit('x-axis:select', xAxisOption);
      },

      onYAxisOptionCheck(yAxisOption) {
        if (!this.selectedYAxis.includes(yAxisOption)) {
          return this.$emit('y-axis:add', yAxisOption);
        }

        if (size(this.selectedYAxis) === 1) {
          return;
        }
        this.$emit('y-axis:remove', yAxisOption);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .controls {
    display: flex;
    align-items: center;
  }

  .info {
    align-self: flex-end;
    cursor: pointer;
  }

  .dropdown {
    width: 120px;
    margin-right: 20px;
  }

  .dropdown-item {
    cursor: pointer;
    padding: 0;

    &.is-active {
      font-weight: bold;
      color: $color-text-main;
    }
  }
  .trigger {
    cursor: pointer;

    font-weight: bold;
  }

  .absolute {
    position: absolute;
  }

  .caret {
    cursor: pointer;
    right: 0;
    transition: transform 0.2s ease-in-out;

    &.rotated {
      transform: rotate(180deg);
    }

    &.disabled {
      cursor: default;

      path {
        fill: $color-gray-80;
      }
    }
  }

  .dropdown-list {
    max-height: 208px;
    overflow: auto;
    padding: 8px 0;
    min-width: 200px;
    color: $color-text-main;
  }

  .granulation-list-item {
    @include row;
    align-items: center;

    > * + * {
      margin-left: 8px;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }

    &.active {
      color: $color-text-primary;
      font-weight: bold;
    }
  }

  .button {
    @include row;
    align-items: center;
    padding: 4px 8px;

    color: $color-text-main;

    &.pressed {
      background-color: #fafafa;
      border-color: #e3e4e5;
    }
  }

  .breakdown-time-granulation-dropdown {
    align-self: flex-end;
  }
</style>
