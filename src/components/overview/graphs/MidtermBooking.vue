<template>
  <OverviewSidebarGraph
    ref="graph"
    :height="height"
    :width="width"
    :layout="layout"
    :traces="traces"
    @afterplot="onRelayout"
  >
    <template #tooltip>
      <div :class="$style.tooltip">
        <b>{{ booking }}</b>
      </div>
    </template>
  </OverviewSidebarGraph>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

  import NormalDistribution from '@/utils/NormalDistribution';
  import {
    DARK_BLUE,
    GREENISH,
    MEDIUM_PURPLE,
    SHARP_BLUE,
    YELLOW
  } from '@/constants/overview-graph-colors';
  import OverviewSidebarGraph from '@/components/overview/graphs/OverviewSidebarGraph.vue';
  import { forEach, range } from 'lodash';
  import { DEFAULT_GRAPH_HEIGHT } from '@/constants/overview';

  @Component({
    name: 'MidtermBooking',
    components: {
      OverviewSidebarGraph
    }
  })
  export default class MidtermBooking extends Vue {
    @Prop({
      type: Number
    })
    readonly width: number;

    @Prop({
      type: Number,
      default: DEFAULT_GRAPH_HEIGHT
    })
    readonly height: number;

    @Prop({ type: Number })
    private readonly booking: number;

    @Prop({ type: Number, required: true })
    private readonly mean!: number;

    @Prop({ type: Number, required: true })
    private readonly std!: number;

    @Ref('graph')
    private readonly graphRef: OverviewSidebarGraph;

    private readonly normalDistribution = new NormalDistribution(
      this.mean,
      this.std
    );

    get minX() {
      const minXStd = this.mean - 3 * this.std;
      return minXStd < this.booking ? minXStd : this.booking;
    }

    get maxX() {
      const maxXStd = this.mean + 3 * this.std;
      return maxXStd > this.booking ? maxXStd : this.booking;
    }

    get x() {
      return [
        ...this.sample(this.minX - this.booking * 0.2, this.mean - 1),
        this.mean,
        ...this.sample(this.mean + 1, this.maxX + this.booking * 0.2)
      ];
    }

    get y() {
      return this.x.map((x) => this.normalDistribution.pdf(x));
    }

    get offset() {
      return this.normalDistribution.pdf(this.mean) * 0.025;
    }

    createLegendItem(name: string, color: string) {
      return {
        x: [-9999],
        y: [0],
        type: 'bar',
        visible: 'legendonly',
        name,
        marker: {
          color
        }
      };
    }

    get traces() {
      return [
        {
          x: this.x,
          y: this.y,
          type: 'scatter',
          line: {
            shape: 'spline',
            color: DARK_BLUE
          },
          hoverinfo: 'skip',
          showlegend: false
        },
        {
          x: [this.booking],
          y: [this.normalDistribution.pdf(this.booking)],
          type: 'scatter',
          hoverinfo: 'none',
          mode: 'markers',
          name: 'Your position',
          marker: {
            color: SHARP_BLUE,
            size: 8
          }
        },
        this.createLegendItem('Likely', '#A8EAE1'),
        this.createLegendItem('Unlikely', '#DCAAF5'),
        this.createLegendItem('Highly unlikely', '#FFDAC2')
      ];
    }

    get stdAreaShapes() {
      return Array(6)
        .fill(0)
        .map((_, index) => {
          const x0 = this.mean + (index - 3) * this.std;

          return {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0,
            y0: 0,
            x1: x0 + this.std,
            y1: 1,
            ...this.barStyle(index),
            line: {
              width: 0
            }
          };
        });
    }

    get layout() {
      return {
        xaxis: {
          title: {
            text: 'Booking'
          },
          fixedrange: true,
          tickcolor: 'rgba(0,0,0,0)',
          ticklen: 5,
          zeroline: false
        },
        yaxis: {
          title: {
            text: 'Probability'
          },
          fixedrange: true,
          range: [
            -this.offset,
            this.normalDistribution.pdf(this.mean) + this.offset
          ],
          ticklen: 6
        },
        shapes: this.stdAreaShapes,
        margin: {
          b: 50
        },
        legend: {
          y: -0.35
        }
      };
    }

    sample(startValue, stopValue) {
      return range(Math.floor(startValue), Math.ceil(stopValue) + 1);
    }

    barStyle(index: number) {
      const colors = [
        YELLOW,
        MEDIUM_PURPLE,
        GREENISH,
        GREENISH,
        MEDIUM_PURPLE,
        YELLOW
      ];

      return {
        fillcolor: colors[index],
        opacity: 0.25
      };
    }

    onRelayout() {
      forEach(
        this.graphRef.$el.querySelectorAll('g .traces'),
        (el: HTMLElement) => (el.style.opacity = '1')
      );
    }
  }
</script>

<style lang="scss" module>
  .tooltip {
    padding: 4px 16px;
    color: #5568e0;
  }
</style>
