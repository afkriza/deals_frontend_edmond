<template>
  <header :class="$style.header">
    <h5>{{ title }}</h5>
    <div :class="$style.actions">
      <template v-if="isLoading">
        <Spinner />
      </template>
      <template v-else>
        <IconPinned
          v-if="pinned"
          :class="$style.pin"
          @click="onFilterPinToggle"
        />
        <IconPin v-else :class="$style.pin" @click="onFilterPinToggle" />
      </template>
    </div>
  </header>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

  import IconPin from '@/assets/images/icons/Misc/filter-pin.svg';
  import IconPinned from '@/assets/images/icons/Misc/filter-pinned.svg';
  import Spinner from '@/components/core/Spinner.vue';

  @Component({
    components: { Spinner, IconPin, IconPinned }
  })
  export default class FilterHeader extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly title: string;

    @Prop({
      type: Boolean,
      required: true
    })
    readonly pinned: boolean;

    @Prop({
      type: Boolean
    })
    readonly isLoading: boolean;

    @Emit('pin:toggle')
    onFilterPinToggle() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .header {
    @include row;
    align-items: center;
    justify-content: space-between;

    height: 40px;
    padding: 10px 15px;

    color: $color-text-light;
    background-color: $color-bg-primary-mid;

    text-transform: uppercase;

    border-radius: 6px 6px 0 0;

    h5 {
      margin: 0;
    }
  }

  .actions {
    @include flex-center;

    button {
      font-size: 12px;
      line-height: 16px;
    }

    > * + * {
      margin-left: 8px;
    }
  }

  .pin {
    color: $color-text-light;
    cursor: pointer;
  }
</style>
