<template>
  <div :class="$style.container">
    <div :class="[$style.header, showDepartment && $style.showDepartment]">
      <span>No.</span>
      <span>Deal</span>
      <span>Partner</span>
      <span v-if="showDepartment">Department</span>
      <span :class="$style.groups">Groups</span>
      <span>Budget</span>
      <span>Status</span>
    </div>
    <div :class="$style.content">
      <template v-for="deal in deals">
        <div
          :key="deal.id"
          :class="$style.rowWrapper"
          @click="onRowClick(deal)"
        >
          <DealRow
            :deal="deal"
            :class="[$style.row, showDepartment && $style.showDepartment]"
            v-on="$listeners"
          />
        </div>
      </template>
      <IntersectionEmitter
        :key="deals.length"
        :options="{ rootMargin: '100px' }"
        @intersect="fetchNextPage"
      />
    </div>
  </div>
</template>

<script>
  import DealRow from './DealRow';
  import IntersectionEmitter from 'components/core/IntersectionEmitter';
  import { mapGetters } from 'vuex';
  import { size } from 'lodash';

  export default {
    name: 'AllDealsGrid',
    components: {
      DealRow,
      IntersectionEmitter
    },
    props: {
      deals: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      ...mapGetters(['currentUser']),

      showDepartment() {
        return size(this.currentUser.salesDepartments) !== 1;
      }
    },

    methods: {
      onRowClick(deal) {
        this.$emit('deal:click', deal);
      },

      fetchNextPage() {
        this.$emit('deals:fetch-next-page');
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
    grid-template-columns: 1fr 3fr 3fr 1fr 2fr 2fr 1fr 2fr 1fr 0.5fr;
    grid-template-areas: 'no deal partner groups budget status priority empty updates actions';
    grid-column-gap: 20px;

    &.show-department {
      grid-template-columns: 1fr 3fr 3fr 2fr 1fr 2fr 1fr 1fr 1fr 1fr 0.5fr;
      grid-template-areas: 'no deal partner department groups budget status priority empty updates actions';
    }
  }

  .header {
    grid-template-rows: 16px;

    border-bottom: 1px solid $color-border-main-light;
    background-color: $color-bg-light;
    color: $color-text-main-lighter;
    padding: 11px 40px 12px;
    position: sticky;
    top: 0;
    z-index: $z-floating-content;

    > span {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
      text-transform: uppercase;

      &.groups {
        grid-area: groups;
      }
    }
  }

  .row-wrapper {
    display: flex;
    align-items: center;
    min-height: 64px;

    &:nth-child(2n + 1) {
      background-color: $color-bg-light;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;
      cursor: pointer;
    }
  }

  .row {
    grid-template-rows: auto;
    padding: 12px 40px;
    min-height: 64px;
    flex: 1;
    align-items: center;
  }
</style>
