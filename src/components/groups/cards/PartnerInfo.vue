<template>
  <div :class="$style.info">
    <div :class="$style.name">{{ name }}</div>
    <div :class="$style.id">{{ id }}</div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    name: 'PartnerInfo'
  })
  export default class PartnerInfo extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly name: string;

    @Prop({
      type: String,
      required: true
    })
    readonly id: string;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .info {
    size: 14px;

    .name {
      color: $color-text-main;
      font-weight: 700;
    }

    .id {
      color: $color-text-main-light;
    }
  }
</style>
