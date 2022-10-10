<template>
  <article
    :class="[
      $style.tab,
      {
        'drag-disabled': disabled,
        [$style.isRemovable]: isRemovable
      }
    ]"
  >
    <div v-if="category.hasTimeGranulation" :class="$style.granulation">
      <VPopover
        :open.sync="open"
        :popover-inner-class="$style.popover"
        :container="false"
        placement="bottom-end"
        :offset="20"
      >
        <div :class="$style.trigger">
          <component :is="iconsByGranulation[category.granulation].bold" />
          <ArrowDown :rotated="open" />
        </div>
        <template #popover>
          <DropdownList
            v-close-popover
            :items="granulations"
            :class="$style.dropdown"
            @select="chooseGranulation"
          >
            <template #item="{ item }">
              <div
                :class="[
                  $style.dropdownItem,
                  {
                    [$style.selected]: category.granulation === item.id
                  }
                ]"
              >
                <component
                  :is="
                    category.granulation === item.id
                      ? item.icon.bold
                      : item.icon.standard
                  "
                />
                <span>{{ item.label }}</span>
              </div>
            </template>
          </DropdownList>
        </template>
      </VPopover>
    </div>
    <TextEllipsis :class="$style.categoryName" :text="category.name" />
    <VPopover
      v-if="hasIgnoreFiltersBtn"
      :class="[
        $style.ignoreFilters,
        { [$style.active]: isIgnoreFiltersActive }
      ]"
      trigger="hover"
      :popover-inner-class="$style.tooltip"
      :offset="6"
    >
      <IconIgnoreFilters @click="onIgnoreFiltersClick" />
      <template #popover>
        <div>
          <h4 :class="$style.tooltipTitle">Ignore filters</h4>
          <p :class="$style.tooltipDisclaimer">
            When turned on, the dashboard filter selection will not apply to
            this row/column.
          </p>
        </div>
      </template>
    </VPopover>
    <span
      v-if="hasRemoveBtn"
      :class="$style.removeDraggableBtn"
      @click="remove(category.id)"
    >
      <IconRemove />
    </span>
  </article>
</template>

<script>
  import { capitalize, map } from 'lodash';
  import { VPopover, VClosePopover } from 'v-tooltip';
  import BasicDropdown from 'components/core/BasicDropdown';
  import BasicTooltip from 'components/core/BasicTooltip';

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

  import IconIgnoreFilters from '@/assets/images/icons/ignore-filters.svg';
  import IconRemove from '@/assets/images/icons/remove.svg';

  import TextEllipsis from '@/components/core/TextEllipsis';
  import DropdownList from '@/components/core/DropdownList';
  import ArrowDown from '@/components/icons/ArrowDown';

  export default {
    components: {
      ArrowDown,
      DropdownList,
      TextEllipsis,
      BasicDropdown,
      BasicTooltip,
      VPopover,
      IconIgnoreFilters,
      IconRemove
    },

    directives: {
      closePopover: VClosePopover
    },

    props: {
      category: {
        type: Object,
        default: null
      },

      disabled: {
        type: Boolean,
        default: false
      },

      isRemovable: {
        type: Boolean,
        default: true
      },

      isBlacklistable: {
        type: Boolean,
        default: true
      },

      isIgnoreFiltersActive: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        open: false
      };
    },

    computed: {
      hasRemoveBtn() {
        return Boolean(
          this.$listeners && this.$listeners.remove && this.isRemovable
        );
      },

      hasIgnoreFiltersBtn() {
        return Boolean(
          this.$listeners &&
            this.$listeners['ignoreFilters:toggle'] &&
            this.isBlacklistable
        );
      },

      iconsByGranulation() {
        return {
          [YEAR]: {
            standard: IconCalendarYear,
            bold: IconBoldCalendarYear
          },
          [MONTH]: {
            standard: IconCalendarMonth,
            bold: IconBoldCalendarMonth
          },
          [WEEK]: {
            standard: IconCalendarWeek,
            bold: IconBoldCalendarWeek
          },
          [DAY]: {
            standard: IconCalendarDay,
            bold: IconBoldCalendarDay
          }
        };
      },

      granulations() {
        return map(BREAKDOWN_TIME_GRANULATIONS, granulation => ({
          icon: this.iconsByGranulation[granulation],
          id: granulation,
          label: capitalize(granulation)
        }));
      }
    },

    methods: {
      remove(id) {
        this.$emit('remove', id);
      },

      chooseGranulation({ id }) {
        this.$emit('granulation:change', id);
      },

      onIgnoreFiltersClick() {
        this.$emit('ignoreFilters:toggle', this.category.id);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tab {
    @extend %wizard-tab;
    margin-bottom: 0;

    display: flex;
    max-height: 48px;
    height: 100%;

    padding: 0;

    cursor: grab;

    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-darker;
    }

    &.is-removable {
      &:hover {
        background-color: $color-bg-primary-dark;
      }
    }

    &:hover {
      .remove-draggable-btn {
        display: block;
      }

      .ignore-filters {
        display: flex;
      }
    }
  }

  .ignore-filters {
    display: none;
    align-items: center;
    margin-left: auto;
    margin-right: 10px;
    color: $color-text-main-lighter;

    &.active {
      display: flex;
      color: $color-text-light;
    }
  }

  .trigger {
    display: flex;
    align-items: center;
  }

  .granulation {
    @include flex-center;

    min-width: 64px;
    border-right: 1px solid $color-border-primary-dark;
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 5px 12px 15px;
  }

  .dropdown-content {
    min-width: 225px;

    padding-top: 10px;
    padding-bottom: 10px;
  }

  .granulation-type {
    text-transform: capitalize;
  }

  .granulation-icon {
    margin-right: 5px;
  }

  .granulation-icon,
  .active-granulation-icon {
    max-height: 24px;
  }

  .dropdown {
    color: $color-text-main;
  }

  .dropdown-item {
    display: flex;
    align-items: center;

    font-weight: normal;

    &.selected {
      font-weight: bold;
      color: $color-text-primary;
    }
  }

  .dropdown-item > * + * {
    margin-left: 8px;
  }

  .category-name {
    padding: 14px 0 14px 15px;
  }

  .tooltip {
    background: $color-bg-light;

    padding: 16px;

    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    width: 272px;
  }

  .tooltip-title {
    margin: 0 0 8px;
  }

  .tooltip-disclaimer {
    line-height: 20px;

    margin: 0;
    color: $color-text-main-lighter;
  }

  .remove-draggable-btn {
    display: none;

    position: absolute;
    top: -10px;
    right: -10px;
  }

  .popover {
    background-color: $color-bg-light;
    border-radius: 4px;
    padding: 8px 0;
    box-shadow: 0px 10px 26px rgba(0, 0, 0, 0.15);

    min-width: 224px;
  }

  /* stylelint-enable selector-max-type */
</style>

<style lang="scss">
  @import 'utils';

  // global CSS used so it can be filtered by draggable from parent component
  .drag-disabled {
    background-color: $color-bg-primary-darker;
    color: $color-text-main-light;
    cursor: not-allowed;
  }
</style>
