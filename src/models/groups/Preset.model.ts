import { PresetDto } from '@/dtos/preset.dto';

export enum PresetScope {
  FinalOfferIntro = 'final_offer_intro',
  FinalOfferConclusion = 'final_offer_conclusion'
}

export class Preset {
  id: string | null;
  name: string;
  content: string;
  scope: PresetScope;

  constructor({ id, name, content, scope }) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.scope = scope;
  }

  duplicate() {
    return new Preset(this);
  }

  serialize(): PresetDto {
    return {
      ...(this.id && { id: this.id }),
      name: this.name,
      value: this.content,
      presetType: this.scope
    };
  }

  static deserialize({ id, name, value, presetType }: PresetDto) {
    return new Preset({
      id,
      name,
      content: value,
      scope: presetType
    });
  }
}
