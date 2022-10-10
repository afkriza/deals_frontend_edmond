<template>
  <div :class="$style.container">
    <h4 :class="$style.title">Unit price</h4>
    <div :class="$style.content">
      <AnalysisCalculatorGraphCard
        :class="$style.cardGraph"
        :empty="activeTab.emptyState.isShown"
      >
        <template #header>
          <header :class="$style.header">
            <SegmentControl
              v-model="activeTabId"
              :class="$style.tabs"
              :options="tabs"
              dark
            />
          </header>
        </template>
        <template>
          <div :class="$style.graph">
            <KeepAlive>
              <Component
                :is="activeTab.component"
                :class="$style.stretch"
                v-bind="activeTab.props"
              />
            </KeepAlive>
            <VueSlider
              v-model="currentPriceSynced"
              :class="$style.slider"
              :dot-size="16"
              tooltip="always"
              :min="range.from"
              :max="range.to"
              :height="2"
              :marks="{
                [range.from]: `€${formatPriceNumber(range.from)}`,
                [range.to]: `€${formatPriceNumber(range.to)}`
              }"
            >
              <template #tooltip="{ value }">
                <div :class="$style.tooltip">
                  <span>
                    {{ unitType }} <b>€{{ formatPriceNumber(value) }}</b>
                  </span>
                </div>
              </template>
            </VueSlider>
          </div>
        </template>
        <div :class="$style.info">
          <p>
            {{ activeTab.description }}
          </p>
          <ButtonGhost
            v-show="activeTabId === 'history_data'"
            :class="$style.buttonDetails"
            text="Show table view"
            dark
            @click="onShowTableViewClick"
          >
            <template #icon><IconTableDark /></template>
          </ButtonGhost>
        </div>
      </AnalysisCalculatorGraphCard>
      <AnalysisCalculatorTextCard
        :class="$style.cardCancellationProbability"
        title="Cancellation probability"
        :text="formatPriceNumber(cancellationProbability)"
      />
      <AnalysisCalculatorTextCard
        :class="$style.cardWashFactor"
        title="Wash factor"
        :text="formatPriceNumber(washFactor)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator';
  import AnalysisCalculatorGraphCard from '@/components/groups/analysis/AnalysisCalculatorGraphCard.vue';
  import SegmentControl from '@/components/inputs/SegmentControl.vue';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import { keyBy, size } from 'lodash';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconTableDark from '@/assets/images/icons/table-dark.svg';
  import AnalysisCalculatorUnitPriceRecommended from '@/components/groups/analysis/AnalysisCalculatorUnitPriceRecommended.vue';
  import AnalysisCalculatorUnitPriceHistoryData from '@/components/groups/analysis/AnalysisCalculatorUnitPriceHistoryData.vue';
  import VueSlider from 'vue-slider-component';
  import AnalysisCalculatorTextCard from '@/components/groups/analysis/AnalysisCalculatorTextCard.vue';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import IllustrationEmptyState from '@/assets/images/icons/Empty state/general-dark.svg';
  import { formatPriceNumber } from '@/utils/format';
  import { Range } from '@/models/analysis/AnalysisCalculator.model';

  @Component({
    components: {
      AppEmptyState,
      AnalysisCalculatorTextCard,
      ButtonGhost,
      InputCurrency,
      InputSelect,
      SegmentControl,
      AnalysisCalculatorGraphCard,
      IconTableDark,
      VueSlider,
      IllustrationEmptyState
    },
    methods: {
      formatPriceNumber
    }
  })
  export default class AnalysisCalculatorUnitPrice extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly unitType;

    @Prop({
      type: Number,
      default: null
    })
    readonly breakEvenPrice: number;

    @Prop({
      type: Number,
      default: null
    })
    readonly recommendedPrice: number;

    @PropSync('currentPrice', {
      type: Number,
      default: null
    })
    currentPriceSynced: number;

    @Prop({
      type: Number,
      default: null
    })
    readonly cancellationProbability: number;

    @Prop({
      type: Number,
      default: null
    })
    readonly washFactor: number;

    @Prop({
      type: Object
    })
    readonly historyData;

    @Prop({
      type: Object
    })
    readonly range: Range;

    activeTabId = this.tabs[0].id;

    get IllustrationEmptyState() {
      return IllustrationEmptyState;
    }

    get tabs() {
      return [
        {
          id: 'recommended',
          label: 'Recommended',
          component: AnalysisCalculatorUnitPriceRecommended,
          description: `Price recommendations are based on an algorithm that uses data from
            different sources such as past bookings, rates of your own
            properties and others from rate shopper. WIP`,
          props: {
            breakEvenPrice: this.breakEvenPrice,
            recommendedPrice: this.recommendedPrice,
            min: this.range.from,
            max: this.range.to
          },
          emptyState: {
            isShown: false,
            title: 'No recommended price data found',
            description:
              'There are no results based on your filtering criteria. Try using different filters.'
          }
        },
        {
          id: 'history_data',
          label: 'History data',
          component: AnalysisCalculatorUnitPriceHistoryData,
          description:
            'Historical data from past bookings with similar dates, units, properties and partners. WIP',
          props: {
            count: this.historyData.count,
            prices: this.historyData.prices,
            median: this.historyData.median,
            q1: this.historyData.q1,
            q3: this.historyData.q3,
            range: this.range
          },
          emptyState: {
            isShown: !size(this.historyData.count),
            title: 'No history data found',
            description:
              'There are no results based on your filtering criteria. Try using different filters.'
          }
        }
      ];
    }

    get tabsById() {
      return keyBy(this.tabs, 'id');
    }

    get activeTab() {
      return this.tabsById[this.activeTabId];
    }

    @Emit('table-view')
    onShowTableViewClick() {
      return true;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .container {
    @include column;
  }

  .title {
    color: $color-text-main-mild-light;

    text-transform: uppercase;
    font-size: 12px;
    line-height: 16px;
    margin: 10px 0 16px 0;
  }

  .header {
    @include row;

    .tabs {
      flex: 1;

      height: 32px;
    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 64px;
    grid-column-gap: 4px;
    grid-row-gap: 16px;
    grid-template-areas:
      'graph graph'
      'storno wash';
    flex: 1;
  }

  .empty-state {
    grid-area: graph;

    max-width: 332px;
    justify-self: center;
  }

  .card-graph {
    grid-area: graph;
  }

  .graph {
    @include column;
    position: relative;

    flex: 1;

    margin-bottom: 50px;

    .slider {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -8px;
    }
  }

  .stretch {
    flex: 1;
  }

  .info {
    @include row;

    p {
      margin: 0;
    }
  }

  .tooltip {
    padding: 4px 10px;
    border-radius: 4px;
    background-color: $color-bg-light;
    color: $color-text-main;
    white-space: nowrap;

    margin-bottom: 8px;

    span {
      text-transform: capitalize;
    }

    b {
      margin-left: 12px;
    }

    &::before {
      content: '';
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
      border-top: 8px solid white;
      left: 45%;
      bottom: 1px;
    }
  }

  .inputs {
    @include row;
    justify-content: center;

    margin-bottom: 16px;

    .input {
      width: 100px;

      &:not(:first-child):not(:last-child) {
        .input-wrapper {
          border-radius: 0;
        }
      }

      &:first-child {
        .input-wrapper {
          border-radius: 6px 0 0 6px;
        }
      }

      &:last-child {
        .input-wrapper {
          border-radius: 0 6px 6px 0;
        }
      }
    }
  }

  .button-details {
    align-self: flex-end;
  }

  .card-cancellation-probability {
    border-radius: 6px 2px 2px 6px;
  }

  .card-wash-factor {
    border-radius: 2px 6px 6px 2px;
  }
</style>
