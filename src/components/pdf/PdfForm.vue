<template>
  <div :class="$style.form">
    <section :class="[$style.row, $style.languageAndCurrency]">
      <InputSelect
        v-model="finalOffer.language"
        label="Language"
        :options="languages"
        search-by="name"
      />
      <InputSelect
        v-model="finalOffer.currency"
        label="Currency"
        :options="currencies"
        search-by="name"
      />
    </section>
    <section :class="[$style.row, $style.partner]">
      <div :class="$style.partnerInfo">
        <b :class="$style.title">Partner</b>
        <h3 :class="$style.name">{{ partner.name }}</h3>
        <p :class="$style.description">
          {{ partner.address }}, {{ partner.postcode }} {{ partner.city }},
          {{ partner.country }}
        </p>
      </div>
      <div v-if="partnerContact" :class="$style.contactInfo">
        <b :class="$style.title">Contact</b>
        <h3 :class="$style.name">
          {{ partnerContact.firstName }} {{ partnerContact.lastName }}
        </h3>
        <div :class="$style.description">
          <p :class="$style.email">{{ partnerContact.email }}</p>
          <p v-if="partnerContact.phoneNumber">
            {{ partnerContact.phoneNumber }}
          </p>
        </div>
      </div>
      <ButtonGhost
        :class="$style.buttonEditPartnerAndContact"
        text="Edit partner and contact"
        @click="onEditPartnerAndContactClick"
      >
        <template #icon>
          <IconEditBold />
        </template>
      </ButtonGhost>
    </section>
    <section :class="$style.row">
      <div :class="[$style.column, $style.grow]">
        <div :class="[$style.row, $style.titleAndValidThrough]">
          <InputText v-model="finalOffer.title" label="Title" />
          <InputDate v-model="finalOffer.validUntil" label="Valid through" />
        </div>
        <TextEditor
          v-model="finalOffer.htmlIntro"
          :class="$style.editor"
          :presets="htmlIntroPresets"
          :create-preset="createHtmlIntroPreset"
          :edit-preset="editPreset"
          :delete-preset="deletePreset"
        />
        <InputSelect
          v-model="finalOffer.property"
          :class="$style.propertyInput"
          label="Property"
          :options="properties"
          search-by="name"
        />
      </div>
    </section>
    <section
      v-for="(group, groupIndex) in finalOffer.groups"
      :key="group.id"
      :class="$style.row"
    >
      <div :class="$style.grow">
        <div :class="$style.sectionHeader">
          <ValidationField
            :v="$v.finalOffer.groups.$each.$iter[groupIndex].dateRange"
          >
            <template #default="{ isError }">
              <InputDateRange
                :class="$style.dateRangeInput"
                :date-from.sync="group.dateRange.from"
                :date-to.sync="group.dateRange.to"
                :error="isError"
                :message-from="isError ? 'Enter start date' : ''"
                :message-to="isError ? 'Enter end date' : ''"
                calendar
                @focus="
                  $v.finalOffer.groups.$each.$iter[
                    groupIndex
                  ].dateRange.$reset()
                "
              />
            </template>
          </ValidationField>
        </div>

        <div :class="$style.unitTypeGrid">
          <span>Unit type</span>
          <span>Quantity</span>
          <span>Service</span>
          <span>Price</span>
          <div></div>
          <div
            v-for="(unit, index) in group.units"
            :key="unit.id || index"
            :class="$style.unitTypeGrid"
          >
            <InputSelect
              v-model="unit.roomType"
              :options="unitTypes"
              search-by="name"
            />
            <InputNumber v-model="unit.quantity" :default-value="0" />
            <InputSelect
              v-model="unit.package"
              :options="services"
              search-by="name"
            />
            <InputCurrency
              v-model="unit.price"
              :currency-symbol="finalOffer.currency.symbol"
              decimal
            />
            <div :class="[$style.row, $style.actions]">
              <ButtonGhost
                type="button"
                tooltip-text="Duplicate"
                oval
                @click="duplicateUnit(group, unit)"
              >
                <template #icon>
                  <IconCopy />
                </template>
              </ButtonGhost>
              <ButtonGhost
                v-show="group.units.length > 1"
                type="button"
                destructive
                tooltip-text="Delete"
                oval
                @click="removeUnit(group, unit)"
              >
                <template #icon>
                  <IconTrash />
                </template>
              </ButtonGhost>
            </div>
          </div>
          <InputSelect
            :class="$style.addUnitTypeInput"
            :options="unitTypes"
            search-by="name"
            placeholder="Add unit type"
            @select="addUnit(group, $event)"
          />
        </div>
      </div>
    </section>
    <InputText v-model="finalOffer.note" label="Note" />
    <TextEditor
      v-model="finalOffer.htmlConclusion"
      :class="$style.editor"
      :presets="htmlConclusionPresets"
      :create-preset="createHtmlConclusionPreset"
      :edit-preset="editPreset"
      :delete-preset="deletePreset"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import { bind, filter, find, first } from 'lodash';
  import { required } from 'vuelidate/lib/validators';

  import InputText from '@/components/inputs/new/InputText.vue';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import InputDate from '@/components/inputs/new/InputDate.vue';
  import TextEditor from '@/components/pdf/TextEditor.vue';
  import InputDateRange from '@/components/inputs/new/InputDateRange.vue';
  import InputCurrency from '@/components/inputs/new/InputCurrency.vue';
  import InputNumber from '@/components/inputs/new/InputNumber.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';
  import IconEditBold from '@/assets/images/icons/edit-2px.svg';

  import ValidationField from '@/components/renderless/ValidationField';
  import { FinalOffer } from '@/models/groups/FinalOffer.model';
  import { FinalOfferGroupUnit } from '@/models/groups/FinalOfferGroupUnit.model';
  import { Partner } from '@/models/groups/Partner.model';
  import { Preset, PresetScope } from '@/models/groups/Preset.model';

  @Component({
    components: {
      ValidationField,
      ButtonGhost,
      InputNumber,
      InputCurrency,
      InputDateRange,
      TextEditor,
      InputDate,
      InputSelect,
      InputText,
      IconCopy,
      IconTrash,
      IconEditBold
    },
    validations: {
      finalOffer: {
        groups: {
          $each: {
            dateRange: {
              from: { required },
              to: { required }
            },
            units: {
              $each: {
                price: {
                  required
                }
              }
            }
          }
        }
      }
    }
  })
  export default class PdfForm extends Vue {
    @Prop({
      type: FinalOffer,
      required: true
    })
    readonly finalOffer;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly properties;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly unitTypes;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly services;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly languages;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly currencies;

    @Prop({
      type: Partner,
      required: true
    })
    readonly partner: Partner;

    @Prop({
      type: Array,
      default: () => []
    })
    readonly presets: Preset[];

    @Prop({
      type: Function,
      default: () => ({})
    })
    readonly createPreset: (preset: Preset) => Promise<Preset>;

    @Prop({
      type: Function,
      default: () => ({})
    })
    readonly editPreset: (preset: Preset) => Promise<Preset>;

    @Prop({
      type: Function,
      default: () => ({})
    })
    readonly deletePreset: (preset: Preset) => Promise<void>;

    get createHtmlIntroPreset() {
      return bind(function (preset: Preset) {
        preset.scope = PresetScope.FinalOfferIntro;

        return this.createPreset(preset);
      }, this);
    }

    get createHtmlConclusionPreset() {
      return bind(function (preset: Preset) {
        preset.scope = PresetScope.FinalOfferConclusion;

        return this.createPreset(preset);
      }, this);
    }

    get htmlIntroPresets() {
      return filter(this.presets, ['scope', PresetScope.FinalOfferIntro]);
    }

    get htmlConclusionPresets() {
      return filter(this.presets, ['scope', PresetScope.FinalOfferConclusion]);
    }

    get partnerContact() {
      return find(this.partner.partnerContacts, 'primary');
    }

    get defaultUnit() {
      return new FinalOfferGroupUnit({
        roomType: first(this.unitTypes),
        quantity: 1,
        package: first(this.services),
        price: 0
      });
    }

    removeUnit(group, unit) {
      group.removeUnit(unit);
    }

    duplicateUnit(group, unit) {
      group.addUnit(unit.duplicate());
    }

    addUnit(group, unitType) {
      const defaultUnit = this.defaultUnit.duplicate();
      defaultUnit.roomType = unitType;

      group.addUnit(defaultUnit);
    }

    @Emit('partner:edit')
    onEditPartnerAndContactClick() {
      return;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .form {
    padding: 12px 40px;

    p {
      margin: 0;
    }
  }

  .row {
    @include row;
  }

  .column {
    @include column;
  }

  section.row {
    padding: 24px 0;

    &:last-of-type {
      margin-bottom: 20px;
    }
  }

  section.row + section.row {
    border-top: 1px solid $color-border-main-light;
  }

  .property-input {
    width: 320px;
  }

  .date-range-input {
    width: 256px;

    margin-bottom: 26px;
  }

  .language-and-currency {
    display: grid;
    grid-template-columns: 240px 120px;
    grid-gap: 8px;
  }

  .partner {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 32px;

    grid-template-areas: 'partner contact edit';
  }

  .partner-info,
  .contact-info {
    min-width: 160px;

    .title,
    .description {
      color: $color-text-main-light;
    }

    .name {
      margin-top: 16px;
      margin-bottom: 8px;
    }
  }

  .button-edit-partner-and-contact {
    align-self: baseline;
    justify-self: end;

    grid-area: edit;
  }

  .title-and-valid-through {
    display: grid;
    grid-template-columns: 320px 160px;
    grid-gap: 16px;
  }

  .editor {
    margin-top: 26px;
    margin-bottom: 28px;
  }

  .grow {
    flex: 1;
  }

  .unit-type-grid {
    display: grid;
    grid-template-columns: minmax(160px, 200px) 120px minmax(120px, 160px) 126px minmax(
        104px,
        1fr
      );
    column-gap: 4px;

    > span {
      color: $color-text-main-light;
      font-size: 12px;
      line-height: 16px;
    }

    & > .unit-type-grid {
      grid-column: 1/6;
      margin: 0 -40px;
      padding: 6px 40px;

      &:hover {
        background-color: $color-bg-primary-dimmed;
      }

      &:hover .actions {
        visibility: visible;
      }
    }
  }

  .actions {
    @include row;

    visibility: hidden;
    margin-left: 12px;

    > * + * {
      margin-left: 8px;
    }
  }
</style>
