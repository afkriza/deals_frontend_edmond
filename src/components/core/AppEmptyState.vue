<template>
  <EmptyState :dark="dark">
    <template #image>
      <component :is="emptyStateIcon" />
    </template>
    <template #title>
      {{ title }}
    </template>
    <template v-if="description" #text>
      {{ description }}
    </template>
  </EmptyState>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import EmptyState from '@/components/app/EmptyState.vue';

  @Component({
    name: 'AppEmptyState',
    components: { EmptyState }
  })
  export default class AppEmptyState extends Vue {
    @Prop({
      type: [String, Object],
      required: true
    })
    readonly emptyStateIcon: string | object;

    @Prop({
      type: String,
      default: ''
    })
    readonly title: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly description: string;

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;
  }
</script>
