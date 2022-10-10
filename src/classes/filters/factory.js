import MeasureFilter from './MeasureFilter';
import PropertyFilter from './PropertyFilter';

const modelsByIds = {
  property: PropertyFilter,
  measure: MeasureFilter
};

export default filter => {
  const Ctor = modelsByIds[filter.id];

  if (!Ctor) {
    throw new Error(`Can't find model for filter with id: ${filter.id}`);
  }

  return new Ctor(filter);
};
