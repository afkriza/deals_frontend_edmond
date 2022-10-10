<template>
  <div :class="$style.card">
    <div :class="$style.header">
      <TextEllipsis :class="$style.heading" :text="widgetName" />
      <div :class="$style.controls">
        <slot name="controls" />
        <VPopover
          placement="right-start"
          :popover-class="$style.popoverWrapper"
          :popover-inner-class="$style.popover"
          :offset="'24, 0'"
          :popper-options="options"
        >
          <template>
            <IconEllipsis :class="$style.icon" />
          </template>
          <template #popover>
            <DropdownList
              v-close-popover
              :class="$style.dropdownList"
              :custom-item-class="$style.dropdownListItem"
              :items="widgetActions"
              @select="onDropdownActionClick"
            >
              <template #item="{ item }">
                <span>{{ item.name }}</span>
              </template>
            </DropdownList>
          </template>
        </VPopover>
      </div>
    </div>
    <div
      :class="[
        $style.content,
        !isContentShown ? $style.center : null,
        isTable && $style.isTable
      ]"
    >
      <slot v-if="isContentShown" />
      <template v-else>
        <AppLoader v-if="isLoading" loading-text="Loading widget..." />
        <AppEmptyState
          v-else-if="isEmpty"
          :class="$style.emptyState"
          :empty-state-icon="iconEmptyStateWidget"
          description="Try using fewer filters or expanding your criteria (longer time range, more hotels…)."
          title="No results match the filter criteria"
        />
        <AppEmptyState
          v-else
          :class="$style.emptyState"
          :empty-state-icon="iconErrorStateWidget"
          description="Please try again."
          title="Something went wrong"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { VPopover, VClosePopover } from 'v-tooltip';

  import IconEllipsis from '@/assets/images/icons/ellipsis.svg';
  import IconEmptyStateWidget from '@/assets/images/icons/emptystate-widget.svg';
  import IconErrorStateWidget from '@/assets/images/icons/error-state-widget.svg';
  import AppLoader from '@/components/app/AppLoader.vue';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import DropdownList from '@/components/core/DropdownList.vue';
  import BasicDropdown from '@/components/core/BasicDropdown.vue';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  @Component({
    name: 'WidgetCard',
    components: {
      TextEllipsis,
      VPopover,
      BasicDropdown,
      DropdownList,
      AppEmptyState,
      AppLoader,
      IconEllipsis,
      IconEmptyStateWidget,
      IconErrorStateWidget
    },
    directives: {
      closePopover: VClosePopover
    }
  })
  export default class WidgetCard extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly widgetName: string;

    @Prop({
      type: Boolean
    })
    readonly owner: boolean;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Prop({
      type: Boolean
    })
    readonly isEmpty: boolean;

    @Prop({
      type: Boolean
    })
    readonly isError: boolean;

    @Prop({
      type: Boolean,
      required: true
    })
    readonly isTable: boolean;

    options = {
      modifiers: {
        preventOverflow: {
          enabled: false
        }
      }
    };

    get iconEmptyStateWidget() {
      return IconEmptyStateWidget;
    }

    get iconErrorStateWidget() {
      return IconErrorStateWidget;
    }

    get isContentShown() {
      return !this.isLoading && !this.isEmpty && !this.isError;
    }

    get widgetActions() {
      let availableActions = [
        this.widgetActionFactory('Copy to...', 'widget:copy-to'),
        this.widgetActionFactory('Export to Excel', 'widget:export-to-excel')
      ];

      if (this.owner) {
        availableActions = availableActions.concat([
          this.widgetActionFactory('Edit', 'widget:edit'),
          this.widgetActionFactory('Duplicate', 'widget:duplicate'),
          this.widgetActionFactory('Convert to...', 'widget:convert-to'),
          this.widgetActionFactory('Delete', 'widget:delete')
        ]);
      }

      return availableActions;
    }

    widgetActionFactory(name: string, eventName: string) {
      return {
        name,
        action: () => this.$emit(eventName)
      };
    }

    onDropdownActionClick({ action }) {
      action();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    @include column;

    background-color: $color-bg-light;
    border-radius: 4px;
  }

  .header {
    @include row;

    align-items: center;
    justify-content: space-between;
    padding: 24px;
  }

  .popover-wrapper {
    z-index: $z-dropdown;
  }

  .popover {
    background: $color-bg-light;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .controls {
    @include row;
    align-items: center;
  }

  .heading {
    cursor: default;

    font-weight: bold;

    font-size: 20px;
    margin-right: 12px;

    min-width: 60px;
  }

  .dropdown-list {
    width: 184px;
    padding: 8px 0;

    &-item {
      padding: 14px 16px;
    }
  }

  .icon {
    cursor: pointer;
  }

  .content {
    @include column;

    flex: 1;

    &.is-table {
      overflow: auto;
    }

    &.center {
      align-items: center;
      justify-content: center;
    }
  }

  .empty-state {
    max-width: 330px;
  }
</style>
