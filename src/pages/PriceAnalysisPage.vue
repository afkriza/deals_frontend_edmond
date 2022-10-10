<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.content">
        <div :class="$style.row">
          <h1 :class="$style.title">Price analysis</h1>
          <div :class="$style.inputs">
            <InputSelect
              v-model="selectedProperty"
              :options="properties"
              label="Property"
              placeholder="Type to search"
              searchable
              search-by="name"
              dark
            />
            <InputDateRange
              v-bind.sync="selectedDateRange"
              label-from="Date range"
              dark
              calendar
            />
            <InputSelect
              v-model="selectedPartner"
              :options="partners"
              label="Partner"
              placeholder="Type to search"
              search-by="name"
              searchable
              dark
              @search="fetchPartnersDebounced"
            />
          </div>
        </div>
        <div :class="$style.tableHeader">
          <template v-for="tableHeaderItem in tableHeaderItems">
            <TableHeaderSortButton
              :key="tableHeaderItem.id"
              :text="tableHeaderItem.name"
              :description="determineTooltipText(tableHeaderItem)"
              :readonly="isLoading || isError || isEmpty"
              :arrow="activeSort.attribute === tableHeaderItem.id"
              :asc="activeSort.direction === 'asc'"
              @click="toggleSort(tableHeaderItem.id)"
            />
          </template>
        </div>
      </div>
    </header>
    <template v-if="isLoading">
      <AppLoader :class="$style.loader" loading-text="Loading prices..." dark />
    </template>
    <template v-else>
      <template v-if="isError">
        <AppEmptyState
          :class="$style.errorState"
          title="Something went wrong"
          description="We couln’t load the price analysis."
          :empty-state-icon="ErrorStateIllustration"
          dark
        />
      </template>
      <template v-else-if="items.length === 0">
        <AppEmptyState
          :class="$style.emptyState"
          title="No prices found"
          description="There are no results based on your filtering criteria. Try using
              different filters."
          :empty-state-icon="EmptyStateIllustration"
          dark
        />
      </template>
      <template v-else>
        <div v-windows-custom-scroll:dark :class="$style.scroll">
          <div :class="$style.content">
            <template v-for="item in currentPageItems">
              <div :key="item.id" :class="$style.item">
                <TextEllipsis :text="item.property" />
                <TextEllipsis :text="item.partner" />
                <TextEllipsis :text="item.group" />
                <span>{{ item.use }}</span>
                <span>{{ item.price }}</span>
              </div>
            </template>
          </div>
        </div>
        <footer :class="$style.footer">
          <div :class="[$style.content, $style.row, $style.center]">
            <span :class="$style.resultsPerPageText"
              >{{ numberOfResultsFormatted }} results</span
            >
            <InputSelect
              v-model="resultsPerPage"
              :class="$style.resultsPerPageInput"
              :options="resultsPerPageOptions"
              dark
            />
            <div
              :class="[$style.row, $style.center, $style.paginationControls]"
            >
              <ButtonFlat
                :class="$style.iconButton"
                @click="onPreviousPageClick"
              >
                <ChevronLeft :class="$style.icon" />
              </ButtonFlat>
              <InputNumber
                :class="$style.pageNumberInput"
                :value="pageNumber"
                :default-value="1"
                dark
                hide-controls
                @change="pageNumber = $event"
              />
              <span>/ {{ numberOfPages }}</span>
              <ButtonFlat :class="$style.iconButton" @click="onNextPageClick">
                <ChevronRight :class="$style.icon" />
              </ButtonFlat>
            </div>
          </div>
        </footer>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import {
    ceil,
    map,
    keyBy,
    reverse,
    size,
    slice,
    sortBy,
    uniqueId,
    debounce
  } from 'lodash';

  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import { formatNumber } from '@/utils/format';
  import IconButton from '@/components/buttons/IconButton.vue';
  import ChevronLeft from '@/assets/images/icons/Navigation/Chevron/chevron-left.svg';
  import ChevronRight from '@/assets/images/icons/Navigation/Chevron/chevron-right.svg';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import InputText from '@/components/inputs/new/InputText.vue';
  import ButtonFlat from '@/components/buttons/ButtonFlat.vue';
  import ArrowIcon from '@/assets/images/icons/Navigation/Arrow/ic-16-arrow.svg';
  import AppLoader from '@/components/app/AppLoader.vue';
  import EmptyState from '@/components/app/EmptyState.vue';
  import EmptyStateIllustration from '@/assets/images/icons/Empty state/general-dark.svg';
  import ErrorStateIllustration from '@/assets/images/icons/Error state/general-dark.svg';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import TableHeaderSortButton from '@/components/groups/price-analysis/TableHeaderSortButton.vue';

  import { groupsModule } from '@/store';
  import TextEllipsis from '@/components/core/TextEllipsis.vue';

  import { resolveLatest } from '@/utils/function';
  import InputDate from '@/components/inputs/new/InputDate.vue';
  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import { parseISO } from 'date-fns';

  import { formatISODate } from '@/utils/date';

  @Component({
    components: {
      InputDateRange,
      InputDate,
      TextEllipsis,
      TableHeaderSortButton,
      AppEmptyState,
      EmptyState,
      AppLoader,
      ButtonFlat,
      InputText,
      InputNumber,
      IconButton,
      InputSelect,
      ChevronLeft,
      ChevronRight,
      ArrowIcon,
      EmptyStateIllustration,
      ErrorStateIllustration
    }
  })
  export default class PriceAnalysisPage extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly propertyId: string;

    @Prop({
      type: String,
      required: true
    })
    readonly partnerId: string;

    @Prop({
      type: String,
      required: true
    })
    readonly beginDate!: string;

    @Prop({
      type: String,
      required: true
    })
    readonly endDate!: string;

    isLoading = true;
    isError = false;

    selectedProperty = null;
    selectedDateRange = {
      dateFrom: parseISO(this.beginDate),
      dateTo: parseISO(this.endDate)
    };
    selectedPartner = null;

    items = [];

    resultsPerPage = {
      id: 1,
      label: '25 / page',
      value: 25
    };

    activeSort = {
      attribute: 'property',
      direction: 'asc'
    };

    pgNum = 1;

    partners = [];

    get pageNumber() {
      return this.pgNum;
    }

    set pageNumber(number) {
      if (number < 1) {
        this.pgNum = 1;
      } else if (number > this.numberOfPages) {
        this.pgNum = this.numberOfPages;
      } else {
        this.pgNum = number;
      }
    }

    get defaultPartners() {
      return groupsModule.partners;
    }

    get properties() {
      return groupsModule.properties;
    }

    get dateRanges() {
      return [
        {
          id: '1',
          label: '03.01 - 06.01.2020'
        }
      ];
    }

    get resultsPerPageOptions() {
      return [
        {
          id: 1,
          label: '25 / page',
          value: 25
        },
        {
          id: 2,
          label: '50 / page',
          value: 50
        },
        {
          id: 3,
          label: '75 / page',
          value: 75
        }
      ];
    }

    get isEmpty() {
      return size(this.items) === 0;
    }

    get tableHeaderItems() {
      return [
        {
          id: 'property',
          name: 'Property',
          ascText: 'Sort by Z-A',
          descText: 'Sort by A-Z'
        },
        {
          id: 'partner',
          name: 'Partner',
          ascText: 'Sort by Z-A',
          descText: 'Sort by A-Z'
        },
        {
          id: 'group',
          name: 'Group',
          ascText: 'Sort by Z-A',
          descText: 'Sort by A-Z'
        },
        {
          id: 'use',
          name: 'Use',
          ascText: 'Sort by Z-A',
          descText: 'Sort by A-Z'
        },
        {
          id: 'price',
          name: 'Price',
          ascText: 'Sort by High to Low',
          descText: 'Sort by Low to High'
        }
      ];
    }

    get ErrorStateIllustration() {
      return ErrorStateIllustration;
    }

    get EmptyStateIllustration() {
      return EmptyStateIllustration;
    }

    get numberOfResults() {
      return size(this.items);
    }

    get numberOfResultsPerPage() {
      return this.resultsPerPage.value;
    }

    get numberOfResultsFormatted() {
      return formatNumber(this.numberOfResults);
    }

    get numberOfPages() {
      return ceil(this.numberOfResults / this.numberOfResultsPerPage);
    }

    get itemsSorted() {
      const ascSort = sortBy(this.items, this.activeSort.attribute);

      return this.activeSort.direction === 'asc' ? ascSort : reverse(ascSort);
    }

    get currentPageItems() {
      const start = (this.pageNumber - 1) * this.numberOfResultsPerPage;
      const end = start + this.numberOfResultsPerPage;

      return slice(this.itemsSorted, start, end);
    }

    get propertiesById() {
      return keyBy(this.properties, 'id');
    }

    get partnersById() {
      return keyBy(this.partners, 'id');
    }

    fetchPartnersLatest = resolveLatest(groupsModule.fetchPartners);

    async fetchPartners(pattern: string) {
      if (!pattern) {
        this.partners = this.defaultPartners;
        return;
      }

      try {
        this.partners = await this.fetchPartnersLatest(pattern);
      } catch (stale) {
        // stale
      }
    }

    fetchPartnersDebounced = null;

    toggleSort(attribute) {
      if (this.activeSort.attribute === attribute) {
        const { direction } = this.activeSort;

        this.activeSort.direction = direction === 'asc' ? 'desc' : 'asc';

        return;
      }

      this.activeSort = {
        attribute,
        direction: 'asc'
      };
    }

    determineTooltipText(tableHeaderItem) {
      if (this.activeSort.attribute === tableHeaderItem.id) {
        return this.activeSort.direction === 'asc'
          ? tableHeaderItem.ascText
          : tableHeaderItem.descText;
      }

      return tableHeaderItem.descText;
    }

    onNextPageClick() {
      if (this.pageNumber === this.numberOfPages) {
        return;
      }

      this.pageNumber++;
    }

    onPreviousPageClick() {
      if (this.pageNumber === 1) {
        return;
      }

      this.pageNumber--;
    }

    @Watch('numberOfResultsPerPage')
    onResultsPerPageChange() {
      // Re-trigger pageNumber setter to prevent overflow
      this.pageNumber = this.pgNum;
    }

    get filters() {
      return {
        partnerId: this.selectedPartner?.id || this.partnerId,
        propertyId: this.selectedProperty?.id || this.propertyId,
        beginDate: this.selectedDateRange.dateFrom,
        endDate: this.selectedDateRange.dateTo
      };
    }

    @Watch('filters', { deep: true })
    async fetchPriceAnalysis() {
      this.isLoading = true;
      this.isError = false;

      try {
        const priceAnalysisData = await groupsModule.fetchPriceAnalysis(
          this.filters
        );

        this.items = map(priceAnalysisData, row => ({
          id: uniqueId(),
          property: row.propertyName,
          partner: row.partnerName,
          group: row.groupName,
          use: row.singleUse ? 'Single' : 'Double',
          price: row.servicePrice
        }));
      } catch (e) {
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    }

    @Watch('filters')
    addHashToLocation() {
      const filters = {
        ...this.filters,
        beginDate: formatISODate(this.filters.beginDate),
        endDate: formatISODate(this.filters.endDate)
      };

      history.replaceState(
        {},
        null,
        this.$route.path + '?' + new URLSearchParams(filters).toString()
      );
    }

    async created() {
      this.fetchPartnersDebounced = debounce(this.fetchPartners, 200);

      const promises = [];

      if (!groupsModule.isConfigurationLoaded) {
        promises.push(groupsModule.fetchConfiguration());
      }

      if (!groupsModule.partners) {
        promises.push(groupsModule.loadPartners());
      }

      await Promise.all(promises);

      this.partners = this.defaultPartners;

      this.selectedProperty = this.properties[0];
      this.selectedPartner = this.partners[0];
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;

    min-width: 900px;
    height: 100vh;

    background-color: $color-bg-primary-darker;
  }

  .error-state,
  .empty-state,
  .loader {
    max-width: 332px;
    margin: 130px auto 0;
    height: auto;
  }

  .loader {
    margin-top: 240px;
  }

  .content {
    margin: 0 auto;

    max-width: 1200px;
    width: 100%;
  }

  .row {
    @include row;
  }

  .center {
    align-items: center;
  }

  .column {
    @include column;
  }

  .header {
    position: sticky;
    top: 0;

    padding-bottom: 2px;

    border-bottom: 1px solid $color-border-primary-mid;
  }

  .header .content .row {
    padding: 0 12px;
  }

  .scroll {
    overflow-y: auto;
  }

  .inputs {
    display: grid;
    grid-template-columns: repeat(3, 256px);
    grid-column-gap: 16px;

    align-items: end;

    margin-left: auto;
  }

  .title {
    color: $color-text-light;

    margin-top: 30px;
    margin-bottom: 0;

    line-height: 32px;
  }

  .table-header {
    display: grid;
    grid-template-columns: 4fr 4fr 4fr 2fr 2fr;
    grid-column-gap: 8px;

    margin-top: 34px;

    padding: 0 12px;
  }

  .item {
    display: grid;
    grid-template-columns: 4fr 4fr 4fr 2fr 2fr;
    grid-column-gap: 8px;

    color: $color-text-light;
    border-radius: 4px;

    padding: 7px 12px;

    &:nth-child(2n + 1) {
      background-color: #353d45;
    }

    &:first-child {
      margin-top: 12px;
    }
  }

  .footer {
    margin-top: auto;
    position: sticky;
    bottom: 0;

    padding: 8px 12px;

    border-top: 1px solid $color-border-primary-mid;
  }

  .results-per-page-text {
    margin-right: 16px;
    color: $color-text-main-mild-light;
  }
  .results-per-page-input {
    width: 120px;
  }

  .icon-button {
    @include flex-center;

    color: $color-text-main-lighter;
    border-radius: 50%;

    &:hover {
      color: $color-text-main-lighter;
    }

    &:first-child {
      margin-right: 20px;
    }

    &:last-child {
      margin-left: 20px;
    }
  }

  .pagination-controls {
    margin-left: auto;
    color: $color-text-light;
  }

  .page-number-input {
    width: 64px;
    margin-right: 11px;
  }
</style>
