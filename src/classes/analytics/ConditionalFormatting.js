import { conditionalFormattingRulesEnum } from 'enums/conditional-formatting-rules';
import { generateRandomHex } from '@/utils/string';

export default class ConditionalFormatting {
  constructor({ id, backgroundColor, rule, textColor, value, saved }) {
    this.id = id || generateRandomHex();
    this.backgroundColor = backgroundColor || '';
    this.rule = rule || '';
    this.textColor = textColor || '';
    this.value = value || null;
    this.saved = saved || false;
  }

  get isValid() {
    return Boolean(
      this.backgroundColor && this.rule && this.textColor && this.value
    );
  }

  setValue(value) {
    const properties = [
      'backgroundColor',
      'rule',
      'textColor',
      'value',
      'saved'
    ];

    properties.forEach(property => {
      this[property] = value[property];
    });
  }

  isRuleMet(value) {
    switch (this.rule) {
      case conditionalFormattingRulesEnum.GREATER_THAN:
        return value > this.value;
      case conditionalFormattingRulesEnum.LESSER_THAN:
        return value < this.value;
      case conditionalFormattingRulesEnum.EQUAL_TO:
        return value === this.value;
      case conditionalFormattingRulesEnum.NOT_EQUAL_TO:
        return value !== this.value;
      case conditionalFormattingRulesEnum.EQUAL_OR_GREATER_THAN:
        return value >= this.value;
      case conditionalFormattingRulesEnum.EQUAL_OR_LESS_THAN:
        return value <= this.value;
      default:
        return false;
    }
  }

  serialize() {
    return {
      id: this.id,
      backgroundColor: this.backgroundColor,
      rule: this.rule,
      textColor: this.textColor,
      value: this.value
    };
  }

  copy() {
    return new ConditionalFormatting(this);
  }

  static from(conditionalFormatting) {
    return new ConditionalFormatting(conditionalFormatting);
  }

  static adaptKeys(conditionalFormatting) {
    return conditionalFormatting;
  }

  static deserialize(data) {
    const deserialized = ConditionalFormatting.from(data);
    deserialized.saved = true;

    return deserialized;
  }

  static default() {
    return new ConditionalFormatting({
      textColor: '',
      rule: '',
      value: null,
      backgroundColor: '',
      saved: false
    });
  }
}
