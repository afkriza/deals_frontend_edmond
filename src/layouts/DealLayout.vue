<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <Breadcrumbs :items="breadcrumbItems" />
      <PortalTarget :class="$style.portal" name="dealHeader" />
    </header>
    <LoadingView v-if="isLoading" loader-message="Loading deal..." />

    <router-view v-else :deal-details="deal" :fetch-deal-details="loadDeal" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { groupsModule } from '@/store';
  import Breadcrumbs from '@/components/app/Breadcrumbs.vue';
  import LoadingView from '@/components/app/LoadingView.vue';

  @Component({
    components: { LoadingView, Breadcrumbs }
  })
  export default class DealLayout extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly dealId!: string;

    isLoading = false;

    get breadcrumbItems() {
      return groupsModule.breadcrumbsManager.items;
    }

    get deal() {
      return groupsModule.deal;
    }

    async loadDeal() {
      this.isLoading = true;

      try {
        await groupsModule.loadDeal(this.dealId);
      } finally {
        this.isLoading = false;
      }
    }

    created() {
      if (
        !groupsModule.revalidateDeal &&
        this.deal &&
        this.deal.id === this.dealId
      ) {
        return;
      }

      return this.loadDeal();
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    display: grid;
    grid-template-rows: 60px 1fr;
    min-height: 100vh;
  }

  .header {
    @include row;

    position: sticky;
    top: 0;
    z-index: $z-navigation;

    align-items: center;

    padding-left: 14px;
    padding-right: 24px;

    background-color: $color-bg-light;
    border-bottom: 1px solid $color-border-main-light;
  }

  .portal {
    @include row;
    align-items: center;
    flex: 1;
  }
</style>
