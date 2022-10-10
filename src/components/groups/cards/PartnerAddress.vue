<template>
  <fragment>
    <div v-if="address || postalCode">
      <div>{{ address }}</div>
      <div>{{ postalCode }} {{ city }}</div>
    </div>
    <div v-else>-</div>
    <div>
      {{ (countries[country] && countries[country].name) || '-' }}
    </div>
  </fragment>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Fragment } from 'vue-fragment';
  import { countries } from '@/constants/countries';

  @Component({
    name: 'PartnerAddress',
    components: { Fragment }
  })
  export default class PartnerAddress extends Vue {
    @Prop({
      type: String
    })
    readonly address: string;

    @Prop({
      type: String
    })
    readonly city: string;

    @Prop({
      type: String
    })
    readonly postalCode: string;

    @Prop({
      type: String,
      validator(value) {
        return Object.keys(countries).includes(value);
      }
    })
    readonly country: string;

    get countries() {
      return countries;
    }
  }
</script>
