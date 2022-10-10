import Configuration from './WidgetConfiguration.js';

import { widgetTypes } from 'enums/widget-types';
import { toCamelCase, toSnakeCase } from 'utils/string';
import {
  DEFAULT_WIDGET_HEIGHT,
  DEFAULT_WIDGET_WIDTH
} from 'constants/widget-grid';

export default class Widget {
  constructor({
    id,
    name,
    positionX,
    positionY,
    width,
    height,
    category = widgetTypes.TABLE,
    representation,
    configuration = Configuration.from(),
    dashboardId,
    ownerId
  }) {
    this.id = id;
    this.name = name;
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.category = category;
    this.representation = representation;
    this.configuration = configuration;
    this.dashboardId = dashboardId;
    this.ownerId = ownerId;
  }

  static from(widget = {}) {
    return new Widget(widget);
  }

  static adaptKeys({
    id,
    name,
    category,
    representation,
    configuration,
    width,
    height,
    dashboardId
  }) {
    return {
      id,
      dashboardId,
      configuration: Configuration.adaptKeys(configuration),
      name,
      category,
      representation: toSnakeCase(representation),
      width: width || DEFAULT_WIDGET_WIDTH,
      height: height || DEFAULT_WIDGET_HEIGHT
    };
  }

  static deserialize({
    id,
    name,
    positionX,
    positionY,
    width,
    height,
    category,
    representation,
    configuration,
    dashboard,
    user,
    categories
  }) {
    return Widget.from({
      id,
      name,
      positionX,
      positionY,
      width,
      height,
      category,
      representation: toCamelCase(representation),
      configuration: Configuration.deserialize({
        ...configuration,
        categories,
        category
      }),
      dashboardId: dashboard.id,
      ownerId: user.id
    });
  }

  calculateCalculationNameDuplicates(calculation) {
    let numOfDuplicates = 0;
    const automaticName = calculation.automaticName;
    this.configuration.calculations.forEach(calc => {
      if (
        calc.id !== calculation.id &&
        !calc.isNameManual &&
        calc.automaticName === automaticName
      ) {
        numOfDuplicates += 1;
      }
    });
    calculation.name = numOfDuplicates
      ? `${automaticName} (${numOfDuplicates})`
      : automaticName;
  }
}
