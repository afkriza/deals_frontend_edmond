export default {
  isPasswordSaving(state) {
    return state.password.isSaving;
  },

  isPasswordSaved(state) {
    return state.password.isSaved;
  }
};
