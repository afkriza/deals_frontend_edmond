<template>
  <div :class="$style.filter">
    <FilterHeader
      v-if="showHeader"
      :title="filter.name"
      :pinned="filter.pinned"
      :is-loading="isLoading"
      @pin:toggle="toggleFilterPin"
    />
    <div :class="$style.content" v-windows-custom-scroll:dark>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import FilterHeader from '@/components/filters/FilterHeader.vue';

  @Component({
    components: { FilterHeader }
  })
  export default class BaseFilter extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly filter;

    @Prop({
      type: Boolean
    })
    readonly showHeader: boolean;

    @Prop({
      type: Function,
      default: () => Promise.resolve()
    })
    readonly togglePin;

    isLoading = false;

    async toggleFilterPin() {
      this.isLoading = true;
      try {
        await this.togglePin(this.filter);
      } finally {
        this.isLoading = false;
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .filter {
    @include column;
    min-height: 0;

    background-color: $color-bg-primary-darker;

    padding-bottom: 8px;
    border-radius: 6px;
  }

  .content {
    overflow-y: auto;
  }
</style>
