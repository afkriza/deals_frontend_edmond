<template>
  <button
    v-tooltip="{
      content: !readonly && description
    }"
    :class="[$style.btn, { [$style.readonly]: readonly }]"
    v-on="$listeners"
  >
    {{ text }}
    <ArrowIcon
      v-show="!readonly && arrow"
      :class="[$style.arrow, { [$style.asc]: asc }]"
    />
  </button>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { VTooltip } from 'v-tooltip';
  import ArrowIcon from '@/assets/images/icons/Navigation/Arrow/ic-16-arrow.svg';

  @Component({
    components: { ArrowIcon },
    directives: {
      tooltip: VTooltip
    }
  })
  export default class TableHeaderSortButton extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly text: string;

    @Prop({
      type: String,
      required: true
    })
    readonly description: string;

    @Prop({
      type: Boolean
    })
    readonly readonly: boolean;

    @Prop({
      type: Boolean
    })
    readonly arrow: boolean;

    @Prop({
      type: Boolean
    })
    readonly asc: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .btn {
    @include button;
    @include flex-center;

    justify-self: start;

    text-transform: uppercase;
    color: $color-text-light;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    line-height: 16px;

    margin-left: -12px;

    &.readonly {
      pointer-events: none;
      cursor: default;
    }

    &:hover {
      background-color: #32465d;
    }
  }

  .arrow {
    margin-left: 6px;

    &.asc {
      transform: rotate(180deg);
    }
  }
</style>
