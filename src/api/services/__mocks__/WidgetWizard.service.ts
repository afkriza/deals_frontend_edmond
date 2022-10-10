export const fetchCategories = () =>
  Promise.resolve({
    data: [
      {
        id: 11
      },
      {
        id: 12
      }
    ]
  });

export const fetchWidgetName = () => ({
  data: {
    id: null,
    type: 'widget_name',
    attributes: {
      name: 'Widget (1)'
    }
  }
});
