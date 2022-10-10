import RateShopperPrice from '@/components/overview/graphs/RateShopperPrice.vue';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/RateShopperPrice',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <RateShopperPrice 
        :compset="compset"
        :current-prices="currentPrices"
        :price-matrix="priceMatrix"
        :properties="properties"
    />`,
  components: {
    RateShopperPrice
  },
  props: {
    currentPrices: {
      default: object('Current prices', [139.0, 139.0, 139.0, 139.0])
    },
    compset: {
      default: object('Compset', [
        'City &<br>stars',
        'Custom<br>compset',
        'Maistra',
        'Region &<br>stars'
      ])
    },
    priceMatrix: {
      default: object('Price matrix', [
        [90.0, 171.0, 62.0, 126.0],
        [122.0, 90.0],
        [40.0, 119.0, 126.0],
        [
          90.0,
          120.0,
          93.0,
          127.0,
          86.0,
          110.0,
          124.0,
          90.0,
          112.0,
          56.0,
          93.0,
          171.0,
          62.0,
          120.0,
          126.0,
          96.0,
          102.0,
          89.0,
          66.0,
          99.0,
          62.0,
          55.0,
          137.0,
          60.0
        ]
      ])
    },
    properties: {
      default: object('Property matrix', [
        [
          'The Melegran',
          'Hotel Casa Garzotto',
          'Hotel Delfin',
          'Family Hotel Amarin'
        ],
        ['Spirito Santo Palazzo Storico', 'The Melegran'],
        ['Hotel Adriatic', 'Hotel Lone', 'Family Hotel Amarin'],
        [
          'Park Plaza Belvedere Medulin',
          'Hotel Milan',
          'Boutique Hotel Mali Raj',
          'Hotel Bonavia Plava Laguna',
          'Hotel Palace Bellevue…rin',
          'Villa Abbazia',
          'Hotel Peteani',
          'Hotel Kanajt',
          'Hotel Miramare',
          'Hotel Stara Lika',
          'La Loggia Diffused Hotel',
          'B&B Villa Maris Punat',
          'Hotel Vinotel Gospoja',
          'Hotel Villa Sandi'
        ]
      ])
    }
  }
});
