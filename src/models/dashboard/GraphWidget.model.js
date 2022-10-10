import { flatMap, uniq } from 'lodash';
import { toCamelCase } from '@/utils/string';

export default class GraphWidget {
  constructor(widget, calculations, meta) {
    this.widget = widget;
    this.calculations = calculations;
    this.meta = meta;
  }

  get isEmpty() {
    return this.meta.emptyResults;
  }
}
