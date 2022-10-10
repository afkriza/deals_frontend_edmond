const state = {
  session: {
    isLoaded: false,
    isLoading: false,
    user: null
  },
  forms: {
    user: {
      isLoading: false
    },
    passwordResetRequest: {
      isLoading: false
    },
    passwordPageResetRequest: {
      isLoading: false
    }
  },
  fullscreen: false,
  noPadding: false,
  toasts: [],
  areFiltersLoading: false
};

export default state;
