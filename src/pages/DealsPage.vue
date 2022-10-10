<template>
  <div :class="$style.page">
    <AppHeader :class="$style.header">
      <FilterTabs
        :tabs="dealsTabs"
        :active-tab-i-d="activeTabId"
        @tab:change="activeTabChange"
      />
      <Filters
        v-if="isDealsTabActive"
        :class="$style.filters"
        :fetch-options="fetchPartnersOptions"
        :filters="dealsFilters"
        :toggle-filter-pin="toggleDealsFilterPin"
        :max-number-of-pinned-filters="3"
        @filter:update="updateDealsFilter"
        @expanded-filters:open="onExpandedFiltersOpen"
        @expanded-filters:close="onExpandedFiltersClose"
      />
      <PinnedFilter
        v-if="!isDealsTabActive"
        :class="$style.filter"
        :filter="countryFilter"
        @filter:update="onFilterCountryUpdate"
      />
      <SearchField
        :class="$style.search"
        :value="activeTab.searchQuery"
        @input="debouncedSearchInput"
        @reset="resetSearchQuery"
      />
      <ButtonOutline
        v-if="hasAccess(Roles.SALES, Roles.ADMIN)"
        :class="[$style.button, { [$style.newDealButton]: isDealsTabActive }]"
        @click="isDealsTabActive ? onNewInquiryClick() : openNewPartnerModal()"
        >{{ isDealsTabActive ? 'New deal' : 'New partner' }}
      </ButtonOutline>
    </AppHeader>
    <LazyLoader
      :class="$style.lazyLoader"
      :is-loading="showLoader || showLazyLoader"
      :loader-message="loaderMessage"
      :transparent="showLazyLoader"
    >
      <main :class="$style.main">
        <template v-if="activeTab.isEmpty()">
          <AppEmptyState
            :class="$style.emptyState"
            :empty-state-icon="iconEmptyState"
            :title="
              activeTab.searchQuery ? 'No search results' : `No ${activeTabId}`
            "
          />
        </template>
        <template v-else>
          <template v-if="isDealsTabActive">
            <AllDealsGrid
              :deals="deals"
              @deal:click="onDealClick"
              @deal:delete="openDeleteDealModal"
              @deal:cancel="openCancelDealModal"
              @deals:fetch-next-page="fetchNextDealsPage"
            />
          </template>
          <template v-else>
            <AllPartnersGrid
              :partners="partners"
              @delete:partner="openDeletePartnerModal"
              @edit:partner="openEditPartnerModal"
              @partners:fetch-next-page="fetchNextPartnersPage"
            />
          </template>
        </template>
      </main>
    </LazyLoader>
    <DeletePartnerModal
      v-if="isDeletePartnerModalOpen"
      :partner="partner"
      :is-loading="isPartnerActionLoading"
      @submit="onPartnerDelete"
      @close="onDeletePartnerModalClose"
    />
    <PartnerModal
      v-if="isEditPartnerModalOpen || isNewPartnerModalOpen"
      :existing-partner="isEditPartnerModalOpen ? partner : null"
      :is-loading="isPartnerActionLoading"
      :errors="tabs.partners.errors"
      @submit="
        isEditPartnerModalOpen ? onPartnerEdit($event) : onPartnerCreate($event)
      "
      @close="
        isEditPartnerModalOpen
          ? onEditPartnerModalClose()
          : onNewPartnerModalClose()
      "
    />
    <ActionModal
      v-if="isCancelDealModalOpen"
      size="small"
      title="Cancel deal?"
      cancel-button-text="No, keep it open"
      submit-button-text="Yes, cancel deal"
      is-destructive
      :is-loading="isCancelDealModalLoading"
      @submit="cancelDeal"
      @close="closeCancelDealModal"
    >
      Are you sure you want to cancel deal
      <b>{{ activeDealName }} ({{ activeDealPartnerName }})?</b>
    </ActionModal>
    <ActionModal
      v-if="isDeleteDealModalOpen"
      size="small"
      title="Delete deal?"
      cancel-button-text="Cancel"
      submit-button-text="Delete deal"
      is-destructive
      :is-loading="isDeleteDealModalLoading"
      @submit="deleteDeal"
      @close="closeDeleteDealModal"
    >
      Are you sure you want to delete deal
      <b>{{ activeDealName }} ({{ activeDealPartnerName }})?</b>
      <br />
      The deal will be deleted immediately. You can’t undo this action.
    </ActionModal>
  </div>
</template>

<script>
  import { pages } from 'enums/pages';
  import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
  import {
    debounce,
    size,
    values,
    get,
    cloneDeep,
    isEqual,
    isEqualWith,
    map,
    partialRight,
    omit
  } from 'lodash';

  import AppHeader from 'components/app/AppHeader';
  import ButtonOutline from 'components/buttons/ButtonOutline';
  import AllDealsGrid from 'components/groups/AllDealsGrid';
  import AllPartnersGrid from 'components/groups/AllPartnersGrid';
  import FilterTabs from 'components/app/FilterTabs';
  import { dealsTabsEnum } from 'enums/deals-tabs';
  import LazyLoader from '@/components/app/LazyLoader.vue';
  import PartnerModal from '@/components/modals/PartnerModal';
  import DeletePartnerModal from '@/components/modals/DeletePartnerModal';
  import SearchField from 'components/app/SearchField';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import IconEmptyState from '@/assets/images/icons/empty-state-deals.svg';

  import * as mutationTypes from 'store/mutation-types';
  import { Roles } from '@/enums/member-roles';
  import { groupsModule } from '@/store';
  import { resolveLatest } from '@/utils/function';
  import ActionModal from '@/components/modals/ActionModal';
  import { navigate } from '@/utils/navigation';
  import PinnedFilter from '@/components/filters/PinnedFilter';
  import { countryOptions } from '@/constants/countries';
  import { MultiSelectFilter } from '@/components/filters/models/MultiSelectFilter.model';
  import Filters from '@/components/filters/Filters';
  import { toastFactory } from 'utils/toast';
  import { toastTypesEnum } from 'enums/toast-types';

  export default {
    name: 'DealsPage',
    components: {
      ActionModal,
      AllDealsGrid,
      ButtonOutline,
      AppHeader,
      FilterTabs,
      AllPartnersGrid,
      LazyLoader,
      PartnerModal,
      DeletePartnerModal,
      SearchField,
      AppEmptyState,
      PinnedFilter,
      Filters
    },
    props: {
      newDealId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        activeDealId: null,
        isCancelDealModalOpen: false,
        isCancelDealModalLoading: false,
        isDeleteDealModalOpen: false,
        isDeleteDealModalLoading: false,
        isDeletePartnerModalOpen: false,
        isEditPartnerModalOpen: false,
        isNewPartnerModalOpen: false,
        isPartnerActionLoading: false,
        partner: null,
        activeTabId: dealsTabsEnum.DEALS.id,
        Roles,
        tabs: {
          deals: {
            isLoading: false,
            isEmpty: () => !size(this.deals),
            isError: false,
            isLoaded: () => groupsModule.areDealsLoaded,
            load: groupsModule.loadDeals,
            search: resolveLatest(groupsModule.fetchDeals),
            get searchQuery() {
              return groupsModule.dealsSearchQuery;
            },
            set searchQuery(value) {
              groupsModule.SET_DEALS_SEARCH_QUERY(value);
            }
          },
          partners: {
            isLoading: false,
            isEmpty: () => !size(this.partners),
            isError: false,
            errors: {},
            isLoaded: () => Boolean(groupsModule.filteredPartners),
            load: groupsModule.loadPartners,
            search: resolveLatest(groupsModule.fetchFilteredPartners),
            get searchQuery() {
              return groupsModule.partnersSearchQuery;
            },
            set searchQuery(value) {
              groupsModule.SET_PARTNERS_SEARCH_QUERY(value);
            }
          }
        },
        areExpandedFiltersOpen: false,
        filtersSnapshot: null
      };
    },
    computed: {
      activeTab() {
        return this.tabs[this.activeTabId];
      },

      deals() {
        return groupsModule.deals;
      },

      activeDeal() {
        return groupsModule.dealsByIds[this.activeDealId];
      },

      activeDealName() {
        return get(this.activeDeal, ['inquiry', 'name'], '');
      },

      activeDealPartnerName() {
        return get(this.activeDeal, ['partner', 'name'], '');
      },

      partners() {
        return groupsModule.filteredPartners;
      },

      isDealsTabActive() {
        return this.activeTabId === dealsTabsEnum.DEALS.id;
      },

      dealsTabs() {
        return values(dealsTabsEnum);
      },

      iconEmptyState() {
        return IconEmptyState;
      },

      countryFilter() {
        return this.partnersFiltersById.country;
      },

      loaderMessage() {
        return this.isDealsTabActive
          ? 'Loading deals...'
          : 'Loading partners...';
      },

      showLazyLoader() {
        return this.isDealsTabActive
          ? groupsModule.areDealsLazyLoading
          : groupsModule.arePartnersLazyLoading;
      },

      showLoader() {
        return this.isDealsTabActive
          ? this.tabs.deals.isLoading
          : this.tabs.partners.isLoading;
      },

      areDealsFiltersLoaded() {
        return Boolean(size(this.dealsFilters));
      },

      arePartnersFiltersLoaded() {
        return Boolean(size(this.partnersFilters));
      },

      ...mapState('groupsFilters/partnersFilters', {
        partnersFiltersById: 'filtersById'
      }),

      ...mapGetters('groupsFilters/dealsFilters', {
        dealsFilters: 'filters'
      }),

      ...mapGetters(['fullscreen', 'noPadding', 'currentUser', 'hasAccess'])
    },
    watch: {
      activeTabId: {
        immediate: true,
        async handler() {
          if (!this.arePartnersFiltersLoaded) {
            this.ADD_PARTNER_FILTER(
              new MultiSelectFilter({
                id: 'country',
                type: 'multiselect',
                name: 'Country',
                pinned: true,
                options: countryOptions,
                value: []
              })
            );
          }

          if (!this.areDealsFiltersLoaded) {
            await this.initializeDealsFilters();
          }

          if (!this.activeTab.isLoaded() && !this.activeTab.isLoading) {
            const activeTab = this.activeTab;

            activeTab.isLoading = true;
            await activeTab.load();
            activeTab.isLoading = false;
          } else if (
            !this.isDealsTabActive &&
            groupsModule.invalidatePartners
          ) {
            this.refetchPartners();
          } else if (this.isDealsTabActive && groupsModule.invalidateDeals) {
            this.refetchDeals();
          }
        }
      }
    },
    methods: {
      ...mapMutations([
        mutationTypes.END_FULLSCREEN,
        mutationTypes.END_NO_PADDING
      ]),

      ...mapMutations('groupsFilters/partnersFilters', {
        ADD_PARTNER_FILTER: 'ADD_FILTER',
        UPDATE_PARTNER_FILTER: 'UPDATE_FILTER',
        PARTNER_FILTERS_ARE_LOADED: 'PARTNER_FILTERS_ARE_LOADED'
      }),

      ...mapMutations('groupsFilters/dealsFilters', {
        UPDATE_DEAL_FILTER: 'UPDATE_FILTER'
      }),

      ...mapActions('groupsFilters/dealsFilters', {
        fetchPartnersOptions: 'fetchOptions',
        initializeDealsFilters: 'initializeFilters',
        toggleDealsFilterPin: 'togglePin'
      }),

      ...mapActions(['updateToast']),

      onExpandedFiltersOpen() {
        this.areExpandedFiltersOpen = true;

        this.filtersSnapshot = cloneDeep(this.dealsFilters);
      },

      onExpandedFiltersClose() {
        this.areExpandedFiltersOpen = false;

        if (
          !isEqualWith(
            this.dealsFilters,
            this.filtersSnapshot,
            (filters, filtersSnapshot) =>
              isEqual(
                map(filters, partialRight(omit, ['pinned'])),
                map(filtersSnapshot, partialRight(omit, ['pinned']))
              )
          )
        ) {
          this.applyDealsFilters();
        }
      },

      fetchNextPartnersPage() {
        if (
          groupsModule.hasPartnersToLoad &&
          !groupsModule.arePartnersLazyLoading
        ) {
          groupsModule.fetchNextPartnersPage();
        }
      },

      fetchNextDealsPage() {
        if (groupsModule.hasDealsToLoad && !groupsModule.areDealsLazyLoading) {
          groupsModule.fetchNextDealsPage();
        }
      },

      async applyDealsFilters() {
        groupsModule.RESET_DEALS_PAGE_NUMBER();

        try {
          this.tabs.deals.isLoading = true;
          const data = await this.tabs.deals.search();
          groupsModule.SET_DEALS(data);
          this.tabs.deals.isLoading = false;
        } catch (e) {
          if (e !== 'stale') {
            this.tabs.deals.isLoading = false;
          }
        }
      },

      updateDealsFilter(filter) {
        this.UPDATE_DEAL_FILTER(filter);

        if (!this.areExpandedFiltersOpen) {
          this.applyDealsFilters();
        }
      },

      async onFilterCountryUpdate(filter) {
        this.UPDATE_PARTNER_FILTER(filter);

        this.refetchPartners();
      },

      onNewInquiryClick() {
        this.$router.push(pages.NEW_INQUIRY);
      },

      findDealById(id) {
        return this.deals.find(deal => deal.id === id);
      },

      // TODO check statuses
      isDealAvailable(status) {
        return (
          status !== 'Accepted' &&
          status !== 'Declined' &&
          status !== 'Canceled'
        );
      },

      async onDealClick(deal) {
        await navigate(this.$router, {
          name: pages.DEAL,
          params: {
            dealId: deal.id
          }
        });

        groupsModule.UPDATE_DEAL_ATTR_VALUE({
          dealId: deal.id,
          attr: 'numberOfChanges',
          value: 0
        });
      },

      async activeTabChange(id) {
        this.activeTabId = id;
      },

      openCancelDealModal(dealId) {
        this.activeDealId = dealId;

        this.isCancelDealModalOpen = true;
      },

      closeCancelDealModal() {
        this.isCancelDealModalOpen = false;
      },

      openDeleteDealModal(dealId) {
        this.activeDealId = dealId;

        this.isDeleteDealModalOpen = true;
      },

      closeDeleteDealModal() {
        this.isDeleteDealModalOpen = false;
      },

      openDeletePartnerModal(partner) {
        this.partner = partner;
        this.isDeletePartnerModalOpen = true;
      },

      onDeletePartnerModalClose() {
        this.isDeletePartnerModalOpen = false;
      },

      openEditPartnerModal(partner) {
        this.partner = partner;
        this.isEditPartnerModalOpen = true;
      },

      onEditPartnerModalClose() {
        this.isEditPartnerModalOpen = false;
      },

      openNewPartnerModal() {
        this.isNewPartnerModalOpen = true;
      },

      onNewPartnerModalClose() {
        this.isNewPartnerModalOpen = false;
      },

      async onPartnerDelete(partner) {
        this.isPartnerActionLoading = true;
        try {
          await groupsModule.deletePartner(partner.id);

          this.isDeletePartnerModalOpen = false;
        } catch (e) {
          // TODO: handle error
        } finally {
          this.isPartnerActionLoading = false;
        }
      },

      async onPartnerEdit(partner) {
        this.isPartnerActionLoading = true;
        this.tabs.partners.errors = {};

        try {
          await groupsModule.editPartner(partner);
          this.refetchPartners();

          this.isEditPartnerModalOpen = false;
        } catch (e) {
          this.tabs.partners.errors = { name: partner.name };
        } finally {
          this.isPartnerActionLoading = false;
        }
      },

      async onPartnerCreate(partner) {
        this.isPartnerActionLoading = true;
        this.tabs.partners.errors = {};

        try {
          await groupsModule.createPartner(partner);
          this.refetchPartners();

          this.updateToast(
            toastFactory('Partner created', toastTypesEnum.SUCCESS)
          );

          this.isNewPartnerModalOpen = false;
        } catch (e) {
          this.tabs.partners.errors = { name: partner.name };
        } finally {
          this.isPartnerActionLoading = false;
        }
      },

      debouncedSearchInput: debounce(function (searchQuery) {
        this.searchInput(searchQuery);
      }, 300),

      async searchInput(searchQuery) {
        this.activeTab.searchQuery = searchQuery;

        const activeTab = this.activeTab;

        if (this.isDealsTabActive) {
          groupsModule.RESET_DEALS_PAGE_NUMBER();
        }

        try {
          activeTab.isLoading = true;
          const data = await activeTab.search();
          this.isDealsTabActive
            ? groupsModule.SET_DEALS(data)
            : groupsModule.SET_FILTERED_PARTNERS(data);
          activeTab.isLoading = false;
        } catch (e) {}
      },

      async resetSearchQuery() {
        this.searchInput('');
      },

      async deleteDeal() {
        this.isDeleteDealModalLoading = true;

        try {
          await groupsModule.deleteDeal(this.activeDealId);

          this.closeDeleteDealModal();
        } catch (e) {
          console.error(e);
        } finally {
          this.isDeleteDealModalLoading = false;
        }
      },

      async cancelDeal() {
        this.isCancelDealModalLoading = true;

        try {
          await groupsModule.cancelDeal(this.activeDealId);

          this.closeCancelDealModal();
        } catch (e) {
          console.error(e);
        } finally {
          this.isCancelDealModalLoading = false;
        }
      },

      async refetchPartners() {
        this.tabs.partners.isLoading = true;
        const data = await this.tabs.partners.search();
        groupsModule.SET_FILTERED_PARTNERS(data);
        groupsModule.SET_INVALIDATE_PARTNERS(false);
        this.tabs.partners.isLoading = false;
      },

      async refetchDeals() {
        this.tabs.deals.isLoading = true;
        await this.tabs.deals.load();
        groupsModule.SET_INVALIDATE_DEALS(false);
        this.tabs.deals.isLoading = false;
      }
    },

    created() {
      if (this.fullscreen || this.noPadding) {
        this[mutationTypes.END_FULLSCREEN]();
        this[mutationTypes.END_NO_PADDING]();
      }

      groupsModule.UPDATE_BREADCRUMBS([
        {
          path: '/deals',
          label: 'Deals'
        }
      ]);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;
    height: 100vh;
  }

  .header {
    @include filters;
    padding: 6px 40px 6px 0;
  }

  .filters {
    position: static;
  }

  .search {
    margin-left: auto;
    margin-right: 16px;

    width: 184px;
  }

  .button {
    height: 34px;
    width: 120px;

    &.new-deal-button {
      margin-right: 40px;
    }
  }

  .main {
    @include column;
    flex: 1;
    min-height: 0;
    background-color: $color-bg-main-dimmed;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr repeat(2, 4fr) repeat(5, 3fr);
    grid-template-rows: 40px 1fr;

    &-header-item {
      border-bottom: 1px solid $color-border-main-light;
      background-color: $color-bg-light;
      color: $color-text-main-lighter;
      padding: 12px 40px;

      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      line-height: 16px;
      text-transform: uppercase;
    }
  }

  .filter {
    margin-left: 8px;
  }

  .lazy-loader {
    @include column;

    flex: 1;
    min-height: 0;
  }
</style>
