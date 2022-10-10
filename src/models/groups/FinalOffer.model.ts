import { parseISO } from 'date-fns';
import { find, map, uniqueId } from 'lodash';
import { formatISODate } from '@/utils/date';
import { Language } from '@/models/groups/Language.model';
import { Currency } from '@/models/groups/Currency.model';
import { Property } from '@/models/groups/Property.model';
import { FinalOfferGroup } from '@/models/groups/FinalOfferGroup.model';

export class FinalOffer {
  id: string;
  name: string;
  language: Language;
  currency: Currency;
  title: string;
  note: string;
  htmlIntro: string;
  htmlConclusion: string;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  groups: FinalOfferGroup[];
  property: Property;

  constructor({
    id,
    name,
    language,
    currency,
    title,
    note,
    htmlIntro,
    htmlConclusion,
    validUntil,
    createdAt,
    updatedAt,
    property,
    groups
  }) {
    this.id = id || uniqueId();
    this.name = name;
    this.language = language;
    this.currency = currency;
    this.title = title || '';
    this.note = note || '';
    this.htmlIntro = htmlIntro || '';
    this.htmlConclusion = htmlConclusion || '';
    this.validUntil = validUntil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.property = property;
    this.groups = groups;
  }

  addGroup(group) {
    this.groups.push(group);

    return group;
  }

  serialize() {
    return {
      name: this.name,
      title: this.title,
      note: this.note,
      htmlIntro: this.htmlIntro,
      htmlConclusion: this.htmlConclusion,
      language: this.language.id,
      currency: this.currency.id,
      validUntil: formatISODate(this.validUntil),
      propertyId: this.property.id,
      offerGroups: map(this.groups, group => group.serialize())
    };
  }

  static deserialize(finalOfferDto, configuration) {
    return new FinalOffer({
      ...finalOfferDto,
      language:
        find(configuration.languages, ['id', finalOfferDto.language]) ||
        configuration.languages[0],
      currency:
        find(configuration.currencies, ['id', finalOfferDto.currency]) ||
        configuration.currencies[0],
      validUntil: parseISO(finalOfferDto.validUntil),
      createdAt: parseISO(finalOfferDto.createdAt),
      updatedAt: parseISO(finalOfferDto.updatedAt),
      groups: map(finalOfferDto.finalOfferGroups, group =>
        FinalOfferGroup.deserialize(group, configuration)
      )
    });
  }
}
