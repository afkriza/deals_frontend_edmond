<template>
  <div ref="wrapper" :class="$style.wrapper">
    <plotly
      :data="traces"
      :display-mode-bar="false"
      :layout="mergedLayout"
      @hover="onHover"
      @unhover="hideTooltip"
      v-on="$listeners"
    />
    <Portal to="modals">
      <div
        v-show="isTooltipShown"
        ref="tooltip"
        :class="[
          $style.tooltip,
          { [$style.tooltipStyle]: defaultTooltipStyle }
        ]"
        :style="tooltipStyle"
      >
        <slot name="tooltip" />
      </div>
    </Portal>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
  import { Plotly } from 'vue-plotly';

  import { isNumber, merge } from 'lodash';
  import {
    GRID_COLOR,
    TEXT_MAIN,
    TEXT_MAIN_LIGHT,
    TEXT_MAIN_LIGHTER,
    ZEROLINE_COLOR
  } from '@/constants/overview-graph-colors';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';
  import { formatNumber } from '@/utils/format';

  const TOOLTIP_OFFSET_X = 12;

  @Component({
    name: 'OverviewSidebarGraph',
    components: {
      Plotly
    }
  })
  export default class OverviewSidebarGraph extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: DEFAULT_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({
      type: Array,
      required: true
    })
    readonly traces: object[];

    @Prop({
      type: Object,
      default: () => ({})
    })
    readonly layout: object;

    @Prop({
      type: Boolean,
      default: true
    })
    readonly defaultTooltipStyle: boolean;

    @Ref('tooltip')
    readonly tooltipRef: HTMLDivElement;

    @Ref('wrapper')
    readonly wrapperRef: HTMLDivElement;

    tooltipStyle = {
      top: null,
      left: null
    };
    isTooltipShown = false;

    get sharedLayout() {
      return {
        ...(this.width && { width: this.width }),
        ...(this.height && { height: this.height }),
        margin: {
          t: 20,
          r: 10,
          b: 30,
          l: 75
        },
        font: {
          family: 'Lato',
          color: TEXT_MAIN_LIGHTER,
          size: 12
        },
        legend: {
          font: {
            color: TEXT_MAIN,
            weight: 'bold',
            size: 12
          },
          xanchor: 'center',
          x: 0.5,
          y: -0.2,
          orientation: 'h',
          itemsizing: 'constant',
          itemclick: false,
          itemdoubleclick: false
        },
        xaxis: {
          fixedrange: true,
          showgrid: false,
          zeroline: false,
          title: {
            font: {
              color: TEXT_MAIN_LIGHT,
              size: 12
            }
          },
          tickfont: {
            size: 12,
            color: TEXT_MAIN_LIGHTER
          },
          ticklen: 8,
          tickcolor: 'transparent',
          automargin: true
        },
        yaxis: {
          fixedrange: true,
          gridcolor: GRID_COLOR,
          zerolinecolor: ZEROLINE_COLOR,
          title: {
            font: {
              color: TEXT_MAIN_LIGHT,
              size: 12
            },
            standoff: 16
          },
          tickfont: {
            size: 12,
            color: TEXT_MAIN_LIGHTER
          },
          nticks: 6,
          tickcolor: 'transparent',
          ticklen: 16
        },
        hovermode: 'closest',
        hoverlabel: {
          font: {
            family: 'Lato'
          }
        }
      };
    }

    get mergedLayout() {
      return merge(this.sharedLayout, this.layout);
    }

    positionTooltip(e) {
      const { top, left } = this.wrapperRef.getBoundingClientRect();

      if (e.points[0].xaxis.type === 'category') {
        this.tooltipStyle.left =
          +e.points[0].xaxis.d2p(e.points[0].x) +
          e.points[0].xaxis._offset +
          left +
          TOOLTIP_OFFSET_X +
          'px';
      } else {
        this.tooltipStyle.left =
          +e.points[0].xaxis.l2p(e.points[0].x) +
          e.points[0].xaxis._offset +
          left +
          TOOLTIP_OFFSET_X +
          'px';
      }

      if (e.points[0].yaxis.type === 'category') {
        this.tooltipStyle.top =
          +e.points[0].yaxis.d2p(e.points[0].y) +
          top +
          e.points[0].yaxis._offset +
          'px';
      } else {
        this.tooltipStyle.top =
          +e.points[0].yaxis.l2p(e.points[0].y) +
          top +
          e.points[0].yaxis._offset +
          'px';
      }
    }

    showTooltip() {
      this.isTooltipShown = true;
    }

    hideTooltip() {
      this.isTooltipShown = false;
    }

    async onHover(e) {
      if (e.points[0].data.hoverinfo === 'skip') {
        return;
      }
      this.positionTooltip(e);

      this.$emit('hover', e);

      this.showTooltip();

      await this.$nextTick();
      const tooltipRect = this.tooltipRef.getBoundingClientRect();

      if (tooltipRect.x + tooltipRect.width > window.innerWidth) {
        this.tooltipStyle.left = `${
          parseFloat(this.tooltipStyle.left) -
          tooltipRect.width -
          TOOLTIP_OFFSET_X
        }px`; // Simulate a "right: tipX" position
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    position: relative;
  }

  .tooltip {
    pointer-events: none;
    position: absolute;
    z-index: $z-tooltip;
  }

  .tooltip-style {
    border: 1px solid #e3e4e5;
    background-color: $color-bg-light;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    white-space: pre-line;
    line-height: 20px;
    min-width: max-content;
  }
</style>
