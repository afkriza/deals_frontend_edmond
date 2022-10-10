<template>
  <BaseCard :class="$style.card">
    <template v-if="isPartnerSelected">
      <div :class="$style.partnerInfo">
        <span>{{ partnerTitle }}</span>
        <span>{{ partnerDescription }}</span>
      </div>
      <ButtonGhost type="button" text="CHANGE PARTNER" @click="changePartner" />
    </template>
    <template v-else>
      <InputSearch
        ref="search"
        v-bind="$attrs"
        v-model="_partner"
        :class="$style.input"
        :options="partners"
        search-by="name"
        placeholder="e.g. “ACME Inc.”"
        :error="error"
        :message="errorMessage"
        @search="onSearchInput"
        @focus="$emit('validation:reset')"
      >
        <template #dropdown="{ options, onOptionSelect }">
          <PartnerList
            :class="$style.partnerList"
            :partners="options"
            @select="onOptionSelect"
          />
        </template>
      </InputSearch>
      <span :class="$style.or">or</span>
      <ButtonGhost
        type="button"
        text="ADD NEW PARTNER"
        @click="$emit('partner:add')"
      />
    </template>
  </BaseCard>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Ref, Emit } from 'vue-property-decorator';
  import BaseCard from '@/components/groups/new-inquiry/BaseCard.vue';
  import InputSearch from '@/components/inputs/new/InputSearch.vue';
  import PartnerList from '@/components/groups/PartnerList.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  @Component({
    components: { ButtonGhost, PartnerList, InputSearch, BaseCard },
    model: {
      prop: 'partner',
      event: 'update'
    }
  })
  export default class CardPartner extends Vue {
    @Prop({
      type: Array,
      default: () => []
    })
    readonly partners;

    @Prop({
      type: Object,
      default: null
    })
    readonly partner;

    @Prop({
      type: Boolean
    })
    readonly error: boolean;

    @Prop({
      type: String
    })
    readonly errorMessage: string;

    @Ref('search')
    readonly inputSearch: InputSearch;

    get _partner() {
      return this.partner;
    }

    set _partner(partner) {
      this.$emit('update', partner);
    }

    get isPartnerSelected() {
      return Boolean(this.partner);
    }

    get partnerTitle() {
      return this.partner?.name;
    }

    get partnerDescription() {
      return this.partner.postcode && this.partner.city && this.partner.country
        ? `${this.partner.address}, ${this.partner.postcode} ${this.partner.city}, ${this.partner.country}`
        : '';
    }

    @Emit('partner:change')
    changePartner() {
      return true;
    }

    @Emit('partner:search')
    onSearchInput(search: string) {
      return search;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    padding: 0 40px;
    align-items: center;
  }

  .input {
    width: 320px;
  }

  .or {
    color: $color-text-main-light;
    line-height: 20px;

    margin-left: 24px;
    margin-right: 12px;
  }

  .partner-info {
    @include column;

    margin-right: auto;

    span:first-child {
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
    }

    span:last-child {
      color: $color-text-main-light;

      line-height: 20px;
    }
  }

  .partner-list {
    overflow-y: auto;
    max-height: 348px;
  }
</style>
