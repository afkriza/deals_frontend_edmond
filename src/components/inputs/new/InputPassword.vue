<template>
  <InputBase type="password" v-bind="$props" v-on="$listeners" />
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import InputBase from '@/components/inputs/new/InputBase.vue';

  @Component({
    components: { InputBase }
  })
  export default class InputText extends InputBase {}
</script>
