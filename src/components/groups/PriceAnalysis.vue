<template>
  <div>
    <ApexChart :options="options" :series="series" type="area" :height="180" />
    <slot />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import ApexChart from 'vue-apexcharts';
  import { max } from 'lodash';
  import { formatPriceNumber } from '@/utils/format';
  import { currenciesFormat } from '@/enums/currencies';

  @Component({
    name: 'PriceAnalysis',
    components: {
      ApexChart
    }
  })
  export default class PriceAnalysis extends Vue {
    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly prices: number[];

    @Prop({
      type: Array,
      default: () => [],
      required: true
    })
    readonly bookings: number[];

    @Prop({
      type: Number,
      default: 0,
      required: true
    })
    readonly q1Price: number;

    @Prop({
      type: Number,
      default: 0,
      required: true
    })
    readonly q3Price: number;

    @Prop({
      type: Number,
      default: 0,
      required: true
    })
    readonly medianPrice: number;

    get q1PriceIndex() {
      return this.prices.indexOf(this.q1Price);
    }

    get q3PriceIndex() {
      return this.prices.indexOf(this.q3Price);
    }

    get medianPriceIndex() {
      return this.prices.indexOf(this.medianPrice);
    }

    get maxYAxisValue() {
      return max(this.bookings);
    }

    get series() {
      return [
        {
          data: this.bookings.map((value, index) => {
            if (index > this.q1PriceIndex && index < this.q3PriceIndex) {
              return null;
            }

            return value;
          })
        },
        {
          data: this.bookings.map((value, index) => {
            if (index < this.q1PriceIndex || index > this.q3PriceIndex) {
              return null;
            }

            return value;
          })
        }
      ];
    }

    get options() {
      return {
        chart: {
          toolbar: { show: false },
          zoom: { enabled: false },
          sparkline: {
            enabled: true
          }
        },
        colors: ['#FAA169', '#FA775C'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 0
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 0.025,
            opacityFrom: 1,
            opacityTo: 0.4,
            stops: [0, 100]
          }
        },
        xaxis: {
          type: 'numeric',
          categories: this.prices,
          show: false,
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { show: false }
        },
        legend: { show: false },
        yaxis: {
          show: false,
          axisBorder: { show: false },
          max: this.maxYAxisValue + 1.25 * this.maxYAxisValue // this offset should be dependant off graph height, TODO
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }
        },
        tooltip: { enabled: false }
      };
    }

    formatPrice(price) {
      return formatPriceNumber(price, currenciesFormat.GERMANY.format);
    }
  }
</script>
