import TableWidget, {
  COMFORTABLE,
  COMPACT,
  REGULAR
} from '@/components/dashboard/TableWidget';
import { select, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Dashboard/TableWidget',
  decorators: [withKnobs]
};

const template = `
    <TableWidget
        style="height: 600px; width: 100%;"
        :column-header="columnHeader"
        :row-header="rowHeader"
        :data="data"
        :density="density"
        :separators="separators"
    />
`;

export const Default = () => ({
  template: template,
  components: { TableWidget },
  props: {
    columnHeader: {
      // default: () => null
      default: () => ({
        groupIds: ['main', 'totals'],
        categoriesByGroupId: {
          main: {
            categoryIds: ['date', 'channel', 'property', 'value'],
            categoryValuesByCategoryId: {
              property: ['AC Porto Sole', 'AC Valkanela'],
              date: ['01 / 2020', '02 / 2020', '03 / 2020'],
              channel: ['Alotman', 'Administracija'],
              value: ['RNT BOOK', 'RNT PLN']
            }
          },
          totals: {
            categoryIds: ['total', 'value'],
            categoryValuesByCategoryId: {
              total: ['Total'],
              value: ['RNT BOOK', 'RNT PLN', 'RNT FRC']
            }
          }
        }
      })
    },
    rowHeader: {
      // default: () => null
      default: () => ({
        groupIds: ['01 / 2020', '02 / 2020', '03 / 2020', 'totals'],
        categoriesByGroupId: {
          '01 / 2020': {
            categoryIds: ['date', 'channel', 'property' /*'value'*/],
            categoryValuesByCategoryId: {
              property: ['AC Porto Sole', 'AC Valkanela'],
              date: ['01 / 2020'],
              channel: ['Alotman', 'Administracija'],
              value: ['RNT BOOK', 'RNT PLN', 'RNT CAP']
            }
          },
          '02 / 2020': {
            categoryIds: ['date', 'channel', 'property' /*'value'*/],
            categoryValuesByCategoryId: {
              property: ['AC Porto Sole', 'AC Valkanela'],
              date: ['02 / 2020'],
              channel: ['Alotman', 'Administracija'],
              value: ['RNT BOOK', 'RNT PLN', 'RNT CAP']
            }
          },
          '03 / 2020': {
            categoryIds: ['date', 'channel', 'property', 'value'],
            categoryValuesByCategoryId: {
              property: ['AC Porto Sole', 'AC Valkanela'],
              date: ['03 / 2020'],
              channel: ['Alotman', 'Administracija'],
              value: ['RNT BOOK', 'RNT PLN', 'RNT CAP']
            }
          },
          totals: {
            categoryIds: ['total', 'value'],
            categoryValuesByCategoryId: {
              total: ['Total'],
              value: ['RNT BOOK', 'RNT PLN', 'RNT CAP']
            }
          }
        }
      })
    },
    data: {
      default: () => [
        {
          column: {
            date: '01 / 2020',
            // channel: 'Alotman',
            property: 'AC Porto Sole',
            value: 'RNT BOOK'
          },
          row: {
            property: 'AC Porto Sole',
            channel: 'Alotman',
            date: '01 / 2020'
          },
          value: 123456.45
        },
        {
          column: {
            total: 'Total',
            value: 'RNT BOOK'
          },
          row: {
            property: 'AC Porto Sole',
            channel: 'Alotman',
            date: '01 / 2020'
          },
          value: 123456.45
        },
        {
          column: {
            total: 'Total',
            value: 'RNT BOOK'
          },
          row: {
            total: 'Total',
            value: 'RNT BOOK'
          },
          value: 123456.45
        }
      ]
    },
    density: {
      default: select('Density', [REGULAR, COMFORTABLE, COMPACT], REGULAR)
    },
    separators: {
      default: () => ({
        rows: [{ property: 'AC Valkanela' }],
        columns: [{ value: 'RNT BOOK' }]
      })
    }
  }
});
