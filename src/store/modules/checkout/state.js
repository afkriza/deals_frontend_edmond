const state = {
  rates: [],
  inventory: [],
  activeTabID: '',
  localDatabaseLoaded: false,
  isDataSaving: false,
  isDataSaved: false,
  error: '',
  unitTypes: {
    isLoaded: false,
    isLoading: false,
    data: {}
  }
};

export default state;
