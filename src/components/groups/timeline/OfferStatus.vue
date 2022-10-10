<template>
  <VPopover
    :disabled="disabled"
    :class="$style.relative"
    :popover-class="$style.popover"
    :container="false"
    :open.sync="isDropdownOpen"
  >
    <div
      :class="[$style.status, $style[status], { [$style.disabled]: disabled }]"
    >
      <span>{{ statusLabel }}</span>
      <ArrowDown
        v-show="!disabled"
        :class="$style.arrow"
        :rotated="isDropdownOpen"
      />
    </div>

    <template #popover>
      <DropdownList
        :class="$style.dropdown"
        title="SET STATUS"
        :items="statusOptions || []"
        :custom-item-class="$style.item"
        @select="onItemClick"
      >
        <template #item="{ item }">
          <span>{{ item.label }}</span>
          <IconCheckmark v-show="isActive(item)" :class="$style.checkmark" />
        </template>
      </DropdownList>
    </template>
  </VPopover>
</template>

<script lang="ts">
  import { Vue, Component, ModelSync, Prop } from 'vue-property-decorator';
  import { VPopover } from 'v-tooltip';
  import { map, keys, includes } from 'lodash';

  import OfferStatusEnum from '@/enums/OfferStatus.enum';

  import ArrowDown from '@/components/icons/ArrowDown.vue';
  import DropdownList from '@/components/core/DropdownList.vue';
  import IconCheckmark from '@/assets/images/icons/checkmark.svg';

  const OFFER_STATUS = {
    [OfferStatusEnum.New]: {
      label: 'New offer',
      actions: [OfferStatusEnum.Canceled]
    },
    [OfferStatusEnum.SentToPms]: {
      label: 'Sent to PMS',
      actions: [OfferStatusEnum.Accepted, OfferStatusEnum.Canceled]
    },
    [OfferStatusEnum.Accepted]: {
      label: 'Client accepted',
      actions: [OfferStatusEnum.Fixed, OfferStatusEnum.Canceled]
    },
    [OfferStatusEnum.Fixed]: {
      label: 'Fixed',
      actions: [OfferStatusEnum.Canceled]
    },
    [OfferStatusEnum.Canceled]: {
      label: 'Canceled'
    }
  };

  @Component({
    components: { DropdownList, ArrowDown, VPopover, IconCheckmark }
  })
  export default class OfferStatus extends Vue {
    @ModelSync('value', 'change', {
      type: String,
      required: true,
      validator(status: string): boolean {
        return includes(keys(OFFER_STATUS), status);
      }
    })
    status!: string;

    @Prop({
      type: Boolean
    })
    readonly readonly: boolean;

    isDropdownOpen = false;

    get statusOption() {
      return OFFER_STATUS[this.status];
    }

    get statusLabel() {
      return this.statusOption.label;
    }

    get statusOptions() {
      const availableStatusActions = this.statusOption.actions;

      if (!availableStatusActions) {
        return null;
      }

      return map(availableStatusActions, status => ({
        status,
        label: OFFER_STATUS[status].label
      }));
    }

    get disabled() {
      return this.readonly || !this.statusOptions;
    }

    isActive(option) {
      return option.status === this.status;
    }

    onItemClick(option) {
      this.status = option.status;

      this.isDropdownOpen = false;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .relative {
    position: relative;
  }

  .popover {
    min-width: 100%;

    background-color: $color-bg-light;
    border: 1px solid $color-border-main-light;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    &[x-placement^='bottom'] {
      margin-top: 8px;
    }
  }

  .dropdown {
    padding: 8px 0;
  }

  .item {
    @include row;
    align-items: center;
    justify-content: space-between;
  }

  .checkmark {
    color: $color-text-primary;
  }

  @mixin indicator($color) {
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: $color;

      margin-right: 8px;
    }
  }

  .status {
    @include row;
    align-items: center;

    width: 168px;

    padding: 5px 4px 5px 10px;
    font-weight: bold;

    border-radius: 4px;

    border: 1px solid transparent;

    &.new {
      @include indicator($color-bg-primary);

      background-color: $color-bg-primary-dimmed;
    }

    &.sent-to-pms {
      @include indicator($color-bg-secondary);

      background-color: #ffeee5;
    }

    &.accepted {
      @include indicator($color-bg-success);

      background-color: $color-bg-success-dimmed;
    }

    &.fixed {
      color: $color-text-light;
      background-color: $color-bg-success;

      .arrow {
        color: currentColor;
      }
    }

    &.canceled {
      color: $color-text-warning;
      background-color: $color-bg-warning-light;

      border-color: $color-border-warning-light;
    }

    &:not(.disabled) {
      cursor: pointer;

      &:hover {
        @include hard-shadow($color-bg-primary-light, 3px);
      }
    }
  }

  .arrow {
    margin-left: auto;

    color: $color-text-main;
  }
</style>
