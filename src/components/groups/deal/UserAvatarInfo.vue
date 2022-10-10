<template>
  <div :class="$style.wrapper">
    <UserAvatar v-bind="$props" />
    <div :class="$style.info">
      <b :class="$style.name">{{ fullName }}</b>
      <span :class="$style.timestamp"> {{ timestampFormatted }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import UserAvatar from '@/components/groups/deal/UserAvatar.vue';
  import { format } from 'date-fns';

  @Component({
    components: { UserAvatar }
  })
  export default class AvatarIcon extends UserAvatar {
    @Prop({
      type: String,
      required: true
    })
    readonly fullName: string;

    @Prop({
      type: Date,
      required: true
    })
    readonly timestamp: Date;

    get timestampFormatted() {
      return format(this.timestamp, 'dd MMM yyyy hh:mm');
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include row;
  }

  .info {
    @include column;

    margin-left: 8px;
  }

  .name {
    color: $color-text-light;
  }

  .timestamp {
    color: $color-text-main-lighter;
  }
</style>
