const totalsFormOptions = {
  SUMMED: {
    title: 'Summed values',
    description:
      'Calculate total by executing this calculation with summed values of variables',
    value: false,
    default: true
  },
  INDIVIDUAL: {
    title: 'Individual values',
    description: 'Calculate total as sum of values from column',
    value: true,
    default: false
  }
};

export default totalsFormOptions;
