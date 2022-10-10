<template>
  <div :class="$style.container">
    <template v-for="(item, idx) in items">
      <IconChevronRight
        v-if="idx > 0"
        :key="item.label + item.path"
        :class="$style.chevron"
      />
      <router-link
        :key="item.path"
        :to="item.path"
        :class="$style.link"
        :exact-active-class="$style.exactActive"
      >
        <span v-if="item.prefix" :class="$style.prefix">{{ item.prefix }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  import IconChevronRight from '@/assets/images/icons/Navigation/Chevron/chevron-right.svg';

  export interface BreadcrumbItem {
    path: string;
    label: string;
    prefix?: string;
  }

  @Component({
    components: {
      IconChevronRight
    }
  })
  export default class Breadcrumbs extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly items: BreadcrumbItem[];
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include row;
    min-width: fit-content;

    align-items: center;
  }

  .chevron {
    color: $color-text-main-mild-light;
  }

  .link {
    @include flex-center;
    display: inline-flex;

    padding: 6px 10px;
    border-radius: 4px;

    border: 1px solid transparent;

    white-space: break-spaces;

    font-size: 17px;
    line-height: 22px;

    text-decoration: none;

    color: $color-text-main-light;

    &:hover {
      color: $color-text-main;
      border: 1px solid $color-border-main-light;
    }

    .prefix {
      color: $color-text-main-light;
      font-weight: normal;

      margin-right: 12px;
    }

    &.exact-active {
      color: $color-text-main;
      font-weight: bold;

      pointer-events: none;
    }
  }
</style>
