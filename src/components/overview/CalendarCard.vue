<template>
  <div :class="[$style.cardComponent, $style[layout]]">
    <div :class="$style.header">
      <span :class="[$style.date, $style[theme]]">{{ date }}</span>
      <span v-if="day" :class="$style.day">{{ day }}</span>
    </div>
    <div :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CalendarCard',
    props: {
      date: {
        type: Number,
        default: 1
      },
      day: {
        type: String
      },
      theme: {
        type: String,
        default: 'normal',
        validator(value) {
          return ['normal', 'active'].includes(value);
        }
      },
      layout: {
        type: String,
        default: 'card',
        validator(value) {
          return ['card', 'small-card', 'row'].includes(value);
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .card-component {
    display: flex;
    flex-wrap: wrap;
  }

  .content {
    background-color: $color-bg-light;
  }

  .row {
    flex-direction: row;
    align-items: center;

    .content {
      flex: 1;
      margin-left: 10px;
    }

    .header {
      width: 15%;
    }
  }

  .card,
  .small-card {
    flex-direction: column;
  }

  .small-card .header {
    padding-bottom: 8px;
  }

  .card .header {
    padding-bottom: 12px;
  }

  .date {
    color: $color-text-main-lighter;
    font-weight: bold;
    font-size: 10px;
    line-height: 14px;
    min-width: 20px;
    min-height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;

    &.active {
      color: $color-text-primary;
      background-color: $color-bg-primary-light;
      border-radius: 50%;
    }
  }

  .day {
    font-weight: bold;
    font-size: 10px;
    line-height: 14px;
    color: $color-text-main-lighter;
    text-transform: uppercase;
  }
</style>
