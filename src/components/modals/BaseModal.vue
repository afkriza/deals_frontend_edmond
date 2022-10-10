<template>
  <portal to="modals">
    <transition name="fade-shrink-in" appear>
      <div :class="$style.backdrop" @mousedown="closeOnBackdropClick">
        <div
          :class="[
            $style.modal,
            $style[size],
            { [$style.fullscreen]: fullscreen }
          ]"
          :style="style"
          @mousedown.stop
        >
          <ButtonGhost
            v-if="showCloseIcon"
            :class="$style.close"
            oval
            @click="close"
          >
            <template #icon>
              <IconClose />
            </template>
          </ButtonGhost>
          <slot />
        </div>
      </div>
    </transition>
  </portal>
</template>

<script>
  import IconClose from '@/assets/images/icons/close-2px.svg';
  import { modalSizesEnum } from 'enums/modal-sizes';
  import { isKey } from '@/utils/keyboard-events';
  import { ESCAPE } from '@/constants/keyboard';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  export default {
    components: {
      IconClose,
      ButtonGhost
    },
    props: {
      size: {
        type: String,
        default: modalSizesEnum.DEFAULT
      },
      width: String,
      height: String,
      disableBackdropClosing: Boolean,
      showCloseIcon: Boolean,
      fullscreen: Boolean
    },
    computed: {
      style() {
        return {
          width: this.width,
          height: this.height
        };
      }
    },
    created() {
      document.body.classList.add(this.$style.noScroll);
      document.addEventListener('keyup', this.closeOnEscape);
    },
    destroyed() {
      document.body.classList.remove(this.$style.noScroll);
      document.removeEventListener('keyup', this.closeOnEscape);
    },
    methods: {
      closeOnEscape(e) {
        if (e && isKey(ESCAPE, e)) {
          this.$emit('close');
          return;
        }
      },
      closeOnBackdropClick() {
        if (!this.disableBackdropClosing) {
          this.$emit('close');
        }
      },
      close() {
        this.$emit('close');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .backdrop {
    @include stretch($position: fixed);
    @include flex-center;

    z-index: $z-modal;

    background-color: $color-bg-backdrop;
  }

  .modal {
    @include column;
    position: relative;

    &:not(.fullscreen) {
      max-height: calc(100vh - 100px);
    }

    background-color: $color-bg-light;
    box-shadow: $modal-shadow;

    border-radius: $base-border-radius;

    &.default {
      width: 760px;
    }

    &.small {
      width: 545px;
    }
  }

  .no-scroll {
    overflow-y: hidden;
  }

  .close {
    color: $color-text-main;
    position: absolute;
    top: 24px;
    right: 24px;

    cursor: pointer;

    &:hover,
    &:active {
      color: $color-text-main;
      background-color: $color-bg-main-dimmed;
      border: 1px solid $color-border-main-light;
    }
  }
</style>

<style>
  .fade-shrink-in-enter-active,
  .fade-shrink-in-leave-active {
    transition: all 0.3s ease;
  }

  .fade-shrink-in-enter,
  .fade-shrink-in-leave-to {
    opacity: 0;
    transform: scale(1.1);
  }
</style>
