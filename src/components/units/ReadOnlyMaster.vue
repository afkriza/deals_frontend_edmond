<template>
  <div :class="$style.wrapper">
    <div :class="$style.card">
      <header :class="$style.header">
        <div :class="$style.name">
          {{ channelName }}
        </div>
      </header>
    </div>
  </div>
</template>

<script>
  import channels from 'enums/channels';

  export default {
    props: {
      channel: {
        type: Object,
        required: true
      }
    },
    computed: {
      channelName() {
        const channel = channels.find(({ id }) => id === this.channel.id);
        return channel ? channel.name : '';
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    font-size: 12px;
    border-radius: $base-border-radius;
    margin: 12px;
    display: flex;
    flex-direction: column;
    background-color: rgba($color-bg-primary, 0.05);
    flex: 1 0 auto;
    border: 1px solid $color-border-main-light;
    padding: 11px 15px 9px;
  }

  .wrapper {
    display: flex;
    width: 160px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .name {
    color: $color-text-primary;
    font-weight: bold;
    text-transform: uppercase;
  }
</style>
