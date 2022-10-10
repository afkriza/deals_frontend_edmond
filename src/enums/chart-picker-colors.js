export const chartColors = [
  {
    background: '#EFD0DE',
    value: '#AD1357'
  },
  {
    background: '#FDDCD2',
    value: '#F4501E'
  },
  {
    background: '#FAF4DA',
    value: '#E4C442'
  },
  {
    background: '#CFE6DA',
    value: '#0D8043'
  },
  {
    background: '#D9DCF1',
    value: '#3F50B5'
  },
  {
    background: '#E9D4EE',
    value: '#8E24AA'
  },
  {
    background: '#F8D2E0',
    value: '#D81B60'
  },
  {
    background: '#FCE2CC',
    value: '#EF6C00'
  },
  {
    background: '#F3F5D7',
    value: '#C1CA33'
  },
  {
    background: '#CCEAE8',
    value: '#009688'
  },
  {
    background: '#E5E7F5',
    value: '#7986CB'
  },
  {
    background: '#E5DDDB',
    value: '#795548'
  },
  {
    background: '#F7CCCC',
    value: '#D50000'
  },
  {
    background: '#FCEACC',
    value: '#F09300'
  },
  {
    background: '#E5F0DA',
    value: '#7CB343'
  },
  {
    background: '#CDEBFA',
    value: '#029BE5'
  },
  {
    background: '#F0ECF8',
    value: '#B39DDB'
  },
  {
    background: '#E0E0E0',
    value: '#616161'
  },
  {
    background: '#FAE5E3',
    value: '#E67C73'
  },
  {
    background: '#FDF3D4',
    value: '#F5BF25'
  },
  {
    background: '#D7F1E5',
    value: '#33B679'
  },
  {
    background: '#DAE7FD',
    value: '#4285F4'
  },
  {
    background: '#ECE1EF',
    value: '#9E69AF'
  },
  {
    background: '#EEEBE9',
    value: '#A79B8D'
  }
];

export const colorByHex = chartColors.reduce((previousValue, currentValue) => {
  previousValue[currentValue.value] = currentValue;

  return previousValue;
}, {});

const colors = chartColors.map(({ value }) => value);

export default colors;
