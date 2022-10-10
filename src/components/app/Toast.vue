<template>
  <div :class="[$style.toast, $style[type]]">
    <div :class="$style.icon">
      <Component :is="toastIcon" />
    </div>
    <span :class="$style.text" v-html="message"> </span>
    <div
      v-if="type === toastTypesEnum.LOADING"
      :class="$style.close"
      @click="cancel"
    >
      <ToastCloseIcon />
    </div>
  </div>
</template>

<script>
  import { toastTypesEnum } from 'enums/toast-types';
  import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
  import MinusCircleIcon from '@/assets/images/icons/minus-circle.svg';
  import DeleteIcon from '@/assets/images/icons/delete.svg';
  import ToastLoaderIcon from '@/assets/images/icons/toast-loader.svg';
  import ToastCloseIcon from '@/assets/images/icons/toast-close.svg';
  import { hasProperties } from '@/utils/validation';

  import { mapActions } from 'vuex';

  export default {
    components: {
      CheckCircleIcon,
      MinusCircleIcon,
      DeleteIcon,
      ToastLoaderIcon,
      ToastCloseIcon
    },
    props: {
      toast: {
        type: Object,
        required: true,
        validator(value) {
          return hasProperties(value, 'type', 'message');
        }
      }
    },
    data() {
      return {
        toastTypesEnum: toastTypesEnum
      };
    },

    computed: {
      iconsByToastType() {
        return {
          [toastTypesEnum.SUCCESS]: CheckCircleIcon,
          [toastTypesEnum.WARNING]: MinusCircleIcon,
          [toastTypesEnum.DELETE]: DeleteIcon,
          [toastTypesEnum.LOADING]: ToastLoaderIcon
        };
      },

      toastIcon() {
        return this.iconsByToastType[this.type];
      },

      message() {
        return this.toast.message;
      },

      type() {
        return this.toast.type;
      }
    },

    methods: {
      cancel() {
        this.toast.controller.abort();
        this.removeToast(this.message);
      },
      ...mapActions(['removeToast'])
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  /* stylelint-disable selector-max-type */
  .toast {
    @include horizontal-center;

    position: fixed;
    z-index: $z-tooltip;
    bottom: 25px;

    display: inline-flex;
    align-items: center;
    padding: 15px 20px;
    border: {
      radius: 4px;
      width: 1px;
      style: solid;
    }

    box-shadow: $toast-shadow;

    &.success,
    &.loading {
      color: $color-text-primary;
      background-color: $color-bg-primary-dimmed;
      border-color: rgba($color-border-primary, 0.3);

      .icon > svg path {
        fill: $color-text-primary;
      }
    }

    &.loading {
      .icon {
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    &.warning {
      color: $color-text-warning;
      background-color: $color-bg-warning-light;
      border-color: currentColor;

      .icon > svg path {
        fill: $color-text-warning;
      }
    }

    &.delete {
      color: $color-text-warning;
      background-color: $color-bg-warning-light;
      border-color: currentColor;

      .icon > svg path {
        fill: $color-text-warning;
      }
    }
  }

  .icon {
    display: flex;
    margin-right: 15px;
  }

  .close {
    display: flex;
    margin-left: 15px;

    &:hover {
      box-shadow: 0px 0px 0px 7px #f2f8ff, 0px 0px 0px 8px #d0e1f5;
      border-radius: 100px;
    }
  }

  /* stylelint-enable selector-max-type */
</style>
