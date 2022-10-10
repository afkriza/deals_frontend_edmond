<template>
  <component :class="{ [$style.inactive]: inactive }" :is="icon" />
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class TimelineIcon extends Vue {
    @Prop({
      type: Object,
      required: true
    })
    readonly icon;

    @Prop({
      type: Boolean
    })
    readonly inactive: boolean;
  }
</script>

<style lang="scss" module>
  .inactive {
    color: #adadad;
  }
</style>
