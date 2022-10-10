import PriceAnalysis from '../PriceAnalysis';

export default {
  title: 'PriceAnalysis'
};

const template = `
  <div style="width: 500px; height: 220px;">
    <PriceAnalysis :prices="prices" :booking="booking" :q1-price="q1Price" :q3-price="q3Price" :median-price="medianPrice" />
</div>
`;

export const Default = () => ({
  template,
  components: { PriceAnalysis },
  props: {
    prices: {
      default: () => [50.5, 90, 122.91, 160, 220, 250, 299]
    },
    booking: {
      default: () => [0, 1.5, 4, 8, 5, 3, 0]
    },
    q1Price: {
      default: 122.91
    },
    q3Price: {
      default: 220
    },
    medianPrice: {
      default: 160
    }
  }
});
