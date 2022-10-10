<template>
  <div
    :class="[
      $style.wrapper,
      {
        [$style.active]: isActive,
        [$style.filled]: !isActive && isFilled
      }
    ]"
  >
    <IconSearch :class="$style.icon" />

    <input
      :class="$style.input"
      :value="value"
      placeholder="Search"
      type="text"
      @blur="isActive = false"
      @focus="isActive = true"
      @keyup.esc.stop="clear"
      @input="onInput"
      @keydown.stop
    />

    <IconClose
      v-visible="isFilled"
      :class="[$style.icon, $style.close]"
      @click="onResetClick"
    />
  </div>
</template>

<script>
  import vVisible from '@/directives/v-visible';
  import IconSearch from '@/assets/images/icons/search.svg';
  import IconClose from '@/assets/images/icons/Navigation/Close/close.svg';

  export default {
    components: {
      IconSearch,
      IconClose
    },

    directives: {
      vVisible
    },

    props: {
      value: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        isActive: false
      };
    },

    computed: {
      isFilled() {
        return Boolean(this.value);
      }
    },

    methods: {
      onInput(event) {
        this.$emit('input', event.target.value);
      },

      onResetClick() {
        this.$emit('reset');
      },

      clear() {
        this.$emit('input', '');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    @include row;
    align-items: center;

    color: $color-text-main-lighter;
    background-color: $color-bg-primary-mid;

    border-radius: $base-border-radius;
    padding: 4px 8px;

    transition: color, background-color 0.1s linear;

    &.active {
      color: $color-text-main;
      background-color: $color-bg-light;
    }

    &.filled {
      color: $color-text-light;
    }

    &:hover {
      @include hard-shadow($color-border-main-dark, 2px);
    }
  }

  .input {
    color: inherit;
    line-height: 20px;
    background-color: transparent;

    border: none;
    box-shadow: none;

    margin-left: 8px;

    transition: color, background-color 0.1s linear;

    min-width: 0;

    &:focus,
    &:active {
      outline: none;
    }
  }

  .icon {
    path {
      fill: currentColor;
    }
  }

  .close {
    cursor: pointer;

    margin-left: auto;
  }
</style>
