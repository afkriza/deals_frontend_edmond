<template>
  <header :class="[$style.header, $style[displayDensity]]">
    <div>
      <basic-tooltip
        :disabled="!isNameOverflowing"
        theme="light"
        :offset="{ vertical: 40, horizontal: 60 }"
      >
        <span
          slot="trigger"
          ref="widgetNameElement"
          :class="$style.widgetName"
          >{{ widget.name }}</span
        >
        <div :class="$style.tooltip">{{ widget.name }}</div>
      </basic-tooltip>
    </div>

    <div :class="$style.rightContent">
      <portal-target :name="`widgetHeader-${widget.id}`" />
      <basic-dropdown
        v-if="!readonly && !isActive"
        :isOpen="isDropdownOpen"
        ref="dropdown"
        :offset="offset_"
        @dropdown:open="onDropdownOpen"
        @dropdown:close="onDropdownClose"
      >
        <span :class="$style.dashboardMenu" slot="trigger">
          <!-- @svg("more") -->
        </span>
        <div :class="$style.dropdownOptions">
          <div :class="$style.dropdownItem" @click="onEditWidgetClick">
            Edit
          </div>
          <div :class="$style.dropdownItem" @click="onDuplicateWidgetClick">
            Duplicate
          </div>
          <div
            v-if="hasCopyButton"
            :class="$style.dropdownItem"
            @click="onCopyWidgetClick"
          >
            Copy to...
          </div>
          <div :class="$style.dropdownItem" @click="onConvertWidgetClick">
            Convert to...
          </div>
          <div :class="$style.dropdownItem" @click="onExportToExcelClick">
            Export data to Excel
          </div>
          <div :class="$style.dropdownItem" @click="onDeleteWidgetClick">
            Delete
          </div>
        </div>
      </basic-dropdown>
    </div>
  </header>
</template>

<script>
  import BasicDropdown from 'components/core/BasicDropdown';
  import BasicTooltip from 'components/core/BasicTooltip';

  export default {
    components: {
      BasicDropdown,
      BasicTooltip
    },

    props: {
      widget: {
        type: Object,
        required: true
      },

      displayDensity: {
        type: String,
        required: true
      },

      hasCopyButton: {
        type: Boolean,
        default: false
      },

      isDropdownOpen: {
        type: Boolean,
        default: false
      },

      isActive: {
        type: Boolean,
        default: false
      },

      readonly: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      offset_() {
        return this.showBelow
          ? { horizontal: -150, vertical: 0 }
          : { horizontal: -150, vertical: -230 };
      }
    },

    methods: {
      calculateIfNameIsOverflowing() {
        return (
          this.$refs.widgetNameElement &&
          this.$refs.widgetNameElement.offsetWidth <
            this.$refs.widgetNameElement.scrollWidth
        );
      },

      dropdownDistanceBottomWindow() {
        return (
          window.innerHeight -
          this.$refs.dropdown.$el.getBoundingClientRect().top +
          this.$refs.dropdown.$el.getBoundingClientRect().height
        );
      },

      onDropdownOpen() {
        this.showBelow = this.dropdownDistanceBottomWindow() > 300;
        this.$emit('dropdown:open');
      },

      onDropdownClose() {
        this.$emit('dropdown:close');
      },

      onEditWidgetClick() {
        this.$emit('widget:edit');
      },

      onConvertWidgetClick() {
        this.$emit('widget:convert');
      },

      onCopyWidgetClick() {
        this.$emit('widget:copy');
      },

      onDuplicateWidgetClick() {
        this.$emit('widget:duplicate');
      },

      onDeleteWidgetClick() {
        this.$emit('widget:delete');
      },

      onExportToExcelClick() {
        this.$emit('widget:export');
      }
    },

    created() {
      this.isNameOverflowing = this.calculateIfNameIsOverflowing();
    },

    updated() {
      this.isNameOverflowing = this.calculateIfNameIsOverflowing();
    },

    data() {
      return {
        isNameOverflowing: false,
        showBelow: true
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    padding: 30px 30px 12px;
    position: relative;
    z-index: $z-widget-header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;

    &.compact {
      padding-bottom: 9px;
    }

    &.comfortable {
      padding-bottom: 32px;
    }
  }

  .widget-name {
    @include text-ellipsis;

    font-size: 20px;
    font-weight: bold;

    display: block;

    .compact & {
      font-size: 16px;
    }
  }

  .dropdown-options {
    font-size: 16px;

    min-width: 185px;
    padding: 7px 0;

    color: $color-text-main;
    white-space: nowrap;
  }

  .dashboard-menu {
    display: flex;
  }

  .tooltip {
    font-size: 14px;
    max-width: 80%;
  }

  .right-content {
    display: flex;
    align-items: center;
  }

  .dropdown-item {
    padding: 7px 15px 7px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }
</style>
