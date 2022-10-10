import RateShopperPriceVsValue from '@/components/overview/graphs/RateShopperPriceVsValue.vue';
import { number, object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Overview/Graphs/RateShopperPriceVsValue',
  decorators: [withKnobs]
};

export const Default = () => ({
  template: `
    <RateShopperPriceVsValue
        v-bind="chartData"
    />`,
  components: {
    RateShopperPriceVsValue
  },
  props: {
    xRange: {
      default: object('X range', [5.12, 12.68])
    },
    yRange: {
      default: object('Y range', [-49.75, 233.75])
    },
    a: {
      default: number('Slope', 1)
    },
    b: {
      default: number('Intercept', 0)
    },
    currentPrice: {
      default: number('Current price', 6)
    },
    predictedPrice: {
      default: number('Predicted price', 8)
    },
    currentScore: {
      default: number('Current score', 5)
    },
    x: {
      default: object('X', [
        -6,
        -5,
        -4,
        -3,
        -2,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ])
    },
    y: {
      default: object('Y', [
        -1,
        0,
        1,
        -2,
        -6,
        -5,
        2,
        -3,
        7,
        6,
        5,
        3,
        10,
        9,
        -4,
        8,
        4
      ])
    },
    properties: {
      default: object('Properties', [
        'FKK Bunculuka Camping Resort by Valamar',
        'Glamping Tents | Losinj | Camp Čikat',
        'Mobile Homes Relax Park Umag',
        'Padova Premium Camping Resort by Valamar',
        'Camping Adria Mobile Home Park Umag',
        'Ethno Houses Plitvice Lakes',
        'FKK Solaris Camping Resort by Valamar',
        'Mobile Homes Polari',
        'Marina Camping Resort by Valamar',
        'Mobile Homes Banko in Bijela Uvala',
        'Mobile Homes Veštar',
        'Holiday Mobile Homes Park Riviera',
        'Camping Media Mobile Homes in Brioni Sunny Camping',
        'Baška Beach Camping Resort by Valamar',
        'Brioni Sunny Camping by Valamar',
        'Mobile Homes Porto Sole',
        'Family Bungalow Pineta'
      ])
    },
    ourProperties: {
      default: object('Our properties', [
        'Camping Media Mobile Homes in Brioni Sunny Camping',
        'Baška Beach Camping Resort by Valamar',
        'Brioni Sunny Camping by Valamar',
        'Mobile Homes Porto Sole'
      ])
    }
  },
  data() {
    JSON.parse(
      '{"type": "rateshopper_value_price", "x_range": [5.119999999999999, 12.680000000000001], "y_range": [-49.75, 233.75], "x": [9.3, 8.5, 9.4, 8.8, 8.8, 9.3, 8.8, 8.8, 9.1, 8.5, 9.3, 8.8, 8.5, 9.1, 7.2, 8.3, 8.8, 8.2, 9.700000000000001, 9.1, 9.2, 9.5, 8.4, 8.6, 8.7, 9.7, 8.1, 9.1, 8.5, 8.7, 8.0, 8.9, 9.2, 9.2, 9.5, 9.4, 9.2, 9.3, 7.9, 8.8, 9.2, 8.5, 8.9, 9.6, 9.6, 8.4, 9.1, 7.3, 9.2, 8.6, 7.0, 9.2, 8.8, 8.5, 9.1, 9.4, 9.5, 9.1, 6.9, 9.2, 9.6, 8.8, 7.8, 9.1, 9.0, 9.3, 9.1, 8.3, 9.3, 9.3, 8.9, 8.8, 8.0, 9.0, 9.1, 9.1, 7.3, 7.7, 7.3, 5.3, 9.5], "y": [115.0, 90.0, 145.0, 66.0, 68.0, 81.0, 88.0, 120.0, 93.0, 127.0, 162.0, 72.0, 66.0, 94.0, 70.0, 91.0, 80.0, 69.0, 122.0, 87.0, 110.0, 81.0, 72.0, 124.0, 223.0, 97.0, 90.0, 114.0, 75.0, 105.0, 98.0, 75.0, 90.0, 119.0, 139.0, 90.0, 83.0, 112.0, 67.0, 97.0, 145.0, 65.0, 100.0, 92.0, 93.0, 84.0, 171.0, 84.0, 152.0, 94.0, 75.0, 66.0, 63.0, 79.0, 120.0, 126.0, 95.0, 104.0, 97.0, 96.0, 102.0, 85.0, 92.0, 89.0, 67.0, 156.0, 102.0, 66.0, 99.0, 222.0, 69.0, 137.0, 77.0, 129.0, 137.0, 227.0, 87.0, 70.0, 79.0, 80.0, 73.0], "property_names": ["Hotel Esplanade", "Park Plaza Belvedere Medulin", "Amadria Park Hotel Milenij", "Boutique Hotel Melissa", "B&B Villa Vrsar", "Boutique Hotel Oasi", "Hotel Domino", "Hotel Milan", "Boutique Hotel Mali Raj", "Hotel Bonavia Plava Laguna", "Hotel Bevanda - Relais & Chateaux", "Hotel Nostromo", "Hotel Paris", "Hotel Villa Kapetanovic", "Hotel Aurora", "Hotel Amfiteatar", "Velanera Hotel & Restaurant", "Hotel Astoria by OHM Group", "Spirito Santo Palazzo Storico", "Hotel Palace Bellevue", "Boutique Hotel Valsabbion", "Boutique Hotel Adoral", "Hotel Makin", "Hotel Savoy", "Hotel Villa Astra", "Hotel Heritage Forza", "Hotel Jezero", "Girandella Valamar Collection Resort", "Hotel Scaletta", "Hotel Jadran", "Hotel Continental", "Hotel Terra", "Hotel Cittar", "Hotel Lone", "Hotel Adriatic", "The Melegran", "Hotel Kukuriku", "Hotel Maritim", "THE LO\u017dA seaside festival hotel by ZrceEU", "Hotel Villa Valdibora", "Hotel Villa Annette", "Hotel Filipini", "Hotel Modo", "Boutique Hotel Acacia", "Residence Villa Karda", "Hotel Meli\u00e1 Coral for Plava Laguna", "Hotel Casa Garzotto", "Hotel Neboder", "Design Hotel Navis", "Hotel Valamar Diamant", "Hotel Pula", "Boutique Hotel Placa", "Hotel Delfin", "Hotel Porec", "Amadria Park Grand Hotel 4 Opatijska Cvijeta", "Family Hotel Amarin", "Boutique Hotel Bo\u0161kinac", "Villetta Phasiana", "Istarske Toplice Health Spa Resort - Mirna", "Villa Abbazia", "Hotel Peteani", "Hotel Bitoraj Fu\u017eine", "Hotel Fontana", "Hotel Kanajt", "Hotel Televrin", "Wine & Heritage hotel ROXANICH", "Hotel La Grisa", "Hotel Miramare", "Hotel Stara Lika", "Meneghetti Wine Hotel and Winery - Relais & Chateaux", "Planinarski Centar Petehovac", "Villa Ariston", "Hotel Galija", "Heritage Hotel San Rocco", "Hotel Vinotel Gospoja", "Casino Hotel Mulino", "Hotel Ana", "Hotel Risnjak", "Hotel Zephyr - Plovanija", "Hotel Zagreb", "Hotel Villa Vrsar"], "our_properties": ["Hotel Lone", "Hotel Adriatic", "Family Hotel Amarin"], "current_price": 126.0, "current_score": 9.4, "predicted_price": 110.86406319464777, "a": 14.609316547932725, "b": -26.463512355919846, "sub_type": "day"}'
    );
  }
});
