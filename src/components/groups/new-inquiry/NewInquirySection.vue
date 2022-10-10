<template>
  <section :class="[$style.section, { [$style.active]: active }]">
    <div :class="$style.header">
      <div :class="$style.row">
        <div :class="$style.frame">
          <slot name="icon" />
        </div>
        <h4 :class="$style.title">{{ title }}</h4>
        <slot name="actions" />
      </div>
      <div v-if="$slots.description" :class="$style.description">
        <slot name="description" />
      </div>
      <slot name="additional" />
    </div>
    <slot />
  </section>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  @Component({
    components: { ButtonGhost }
  })
  export default class NewInquirySection extends Vue {
    @Prop({
      type: String,
      required: true
    })
    private readonly title: string;

    @Prop({
      type: Boolean
    })
    private readonly active: boolean;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .section {
    @include row;

    &.active {
      .header {
        color: $color-text-primary;
      }

      .frame {
        border-color: $color-border-primary-light;
      }
    }

    & > * + * {
      margin-left: 32px;
    }
  }

  .row {
    @include row;

    align-items: center;
  }

  .header {
    @include column;

    width: 256px;
  }

  .title {
    margin: 0 40px 0 16px;
  }

  .frame {
    @include flex-center;

    width: 40px;
    height: 40px;

    border-radius: 50%;

    background: $color-bg-light;
    border: 1px solid $color-border-main-light;
  }

  .description {
    margin-top: 16px;
    color: $color-text-main-light;

    width: 208px;
  }
</style>
