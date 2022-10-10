<template>
  <OverviewSidebarGraph
    :height="height"
    :layout="layout"
    :traces="traces"
    :width="width"
    :responsive="true"
    @hover="onHover"
  >
    <template #tooltip>
      <div :class="$style.tooltip" :style="{ color: tooltipInfo.color }">
        <b>{{ tooltipInfo.value }}</b>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { size } from 'lodash';

  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { formatNumber } from '@/utils/format';
  import { DEFAULT_LINE_SMOOTHING } from '@/constants/overview';
  import { TEXT_MAIN } from '@/constants/overview-graph-colors';

  @Component({
    name: 'OccupancyGraph',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class OccupancyGraph extends Vue {
    @Prop({
      type: Array,
      default: null
    })
    readonly xAxisLabels: string[] | null;

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookings: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly groups: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly forecasts: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly displacements: number[];

    @Prop({
      type: Number,
      required: true
    })
    readonly capacity: number;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly adr: number[];

    @Prop({
      type: Array,
      default: () => []
    })
    readonly adrWithGroup: number[];

    @Prop({
      type: Number,
      default: 350
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: 400
    })
    readonly height: number;

    @Prop({
      type: Object,
      default: null
    })
    readonly margin: object;

    @Prop({
      type: Boolean
    })
    readonly showLegend: boolean;

    @Prop({
      type: Boolean
    })
    readonly showTooltip: boolean;

    get hasMultipleBars() {
      return Boolean(this.xAxisLabels);
    }

    get traces() {
      const adrTraces = [];

      if (size(this.adr)) {
        adrTraces.push(this.adrTrace);
      }

      if (size(this.adrWithGroup)) {
        adrTraces.push(this.adrWithGroupTrace);
      }

      return [
        ...adrTraces,
        this.traceFactory(this.bookings, 'Booking', '#5568E0'),
        this.traceFactory(this.groups, 'Group', '#B954EB'),
        this.traceFactory(this.forecasts, 'Forecast', '#62D9C9'),
        this.traceFactory(this.displacements, 'Displacement', '#FA775C', {
          base: Array(this.displacements.length).fill(this.capacity)
        })
      ];
    }

    get adrTrace() {
      return this.lineTraceFactory(this.adr, 'adr');
    }

    get adrWithGroupTrace() {
      const lineTrace = this.lineTraceFactory(
        this.adrWithGroup,
        'adr with group'
      );
      lineTrace.line.dash = 'dash';

      return lineTrace;
    }

    lineTraceFactory(y, name) {
      return {
        x: this.xAxisLabels,
        y,
        name,
        type: 'scatter',
        mode: 'lines',
        line: {
          color: '#C8CACC',
          shape: 'spline',
          smoothing: DEFAULT_LINE_SMOOTHING,
          dash: 'solid'
        },
        width: 1,
        hoverinfo: 'none'
      };
    }

    get layout() {
      const layout: any = {
        barmode: 'stack',
        xaxis: {
          showticklabels: this.hasMultipleBars,
          type: 'category',
          color: '#ADAFB2',
          fixedrange: true
        },
        yaxis: {
          color: '#444D56',
          gridcolor: '#444D56',
          zerolinecolor: '#444D56',
          tickcolor: 'rgba(0,0,0,0)',
          ticklen: 20,
          nticks: 1,
          tickwidth: 1,
          tickvals: [0, this.capacity],
          fixedrange: true,
          automargin: true
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        margin: {
          l: 0
        }
      };

      if (this.margin) {
        layout.margin = this.margin;
      }

      if (this.showLegend) {
        layout.showlegend = true;
      }

      return layout;
    }

    traceFactory(
      y: number[],
      name: string,
      color: string,
      options: {
        base?: number[];
        noText?: boolean;
        textColor?: string;
        width?: number[];
      } = {}
    ) {
      const trace = {
        y,
        type: 'bar',
        name: name,
        marker: {
          color
        },
        width: options.width || 0.5,
        hoverinfo: 'none'
      };

      if (this.hasMultipleBars) {
        trace['x'] = this.xAxisLabels;
      }

      if (options.base) {
        trace['base'] = options.base;
      }

      return trace;
    }

    tooltipInfo = {
      value: null,
      color: null
    };

    onHover(e) {
      const [point] = e.points;

      const { y } = point;

      this.tooltipInfo.value = formatNumber(y);
      this.tooltipInfo.color = point.data.marker?.color || TEXT_MAIN;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .tooltip {
    padding: 2px 6px;
    color: $color-text-main;
  }
</style>
