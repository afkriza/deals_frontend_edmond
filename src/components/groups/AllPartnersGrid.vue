<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <span
        v-for="(headerItem, index) in headerItems"
        :key="index"
        :class="$style.headerItem"
      >
        {{ headerItem }}
      </span>
    </div>
    <div :class="$style.content">
      <template v-for="partner in partners">
        <PartnerRow
          :key="partner.id"
          :class="$style.row"
          :partner="partner"
          v-on="$listeners"
        />
      </template>
      <IntersectionEmitter
        :key="partners.length"
        :options="{ rootMargin: '100px' }"
        @intersect="fetchNextPage"
      />
    </div>
  </div>
</template>

<script>
  import PartnerRow from './PartnerRow';
  import IntersectionEmitter from 'components/core/IntersectionEmitter';

  export default {
    name: 'AllPartnersGrid',
    components: { PartnerRow, IntersectionEmitter },
    props: {
      partners: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        headerItems: ['partner', 'address', '', 'email', 'phone', '']
      };
    },

    methods: {
      fetchNextPage() {
        this.$emit('partners:fetch-next-page');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include column;
    flex: 1;
    min-height: 0;
    color: $color-text-main;
  }

  .content {
    overflow: auto;
  }

  .header,
  .row {
    display: grid;
    grid-template-columns: repeat(5, 2fr) 80px;
    grid-column-gap: 20px;
  }

  .header {
    display: grid;
    grid-template-rows: 16px;

    border-bottom: 1px solid $color-border-main-light;
    background-color: $color-bg-light;
    color: $color-text-main-lighter;
    padding: 11px 24px 12px 40px;
    position: sticky;
    top: 0;
    z-index: $z-floating-content;
  }

  .header-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    text-transform: uppercase;

    &:nth-child(4) {
      margin-left: 32px;
    }

    &:nth-child(5) {
      margin-left: -20px;
    }
  }

  .row {
    grid-template-rows: auto;
    padding: 16px 24px 16px 40px;
    flex: 1;
    min-height: 88px;

    &:nth-child(2n) {
      background-color: $color-bg-light;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .intersection {
    margin-bottom: $action-footer-height;
  }
</style>
