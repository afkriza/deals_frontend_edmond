<template>
  <div :class="$style.dropdownContainer" v-click-outside="close">
    <div
      :class="[$style.trigger, { [$style.enabled]: !disabled }]"
      @click="toggleDropdown"
      v-click-outside="() => closeOnSelect && close()"
    >
      <slot :is-open="isDropdownOpen" name="trigger" />
    </div>
    <transition name="dropdown-fade">
      <div
        v-show="isDropdownOpen"
        :class="[
          $style.content,
          !resetAlignStyle && alignClass,
          customContentClass,
          { [$style.defaultColorStyle]: !resetStyle }
        ]"
        :style="dropdownOffset"
        ref="contentElement"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside';

  export default {
    directives: {
      ClickOutside
    },
    props: {
      auto: Boolean,

      isOpen: Boolean,

      closeOnSelect: Boolean,

      resetStyle: {
        type: Boolean,
        required: false
      },
      resetAlignStyle: {
        type: Boolean,
        required: false
      },
      align: {
        type: String,
        default: 'left'
      },
      customContentClass: {
        type: String,
        default: ''
      },
      offset: {
        type: Object,
        default() {
          return {
            horizontal: 0,
            vertical: 0
          };
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      setMaxDropdownHeight: Boolean
    },
    computed: {
      isDropdownOpen() {
        return this.auto ? this.isOpenLocal : this.isOpen;
      },

      alignClass() {
        return this.align === 'right'
          ? this.$style.isRightAligned
          : this.$style.isLeftAligned;
      },

      dropdownOffset() {
        return {
          transform: `translateX(${this.offset.horizontal ||
            0}px) translateY(${this.offset.vertical || 0}px)`
        };
      },

      triggerClass() {
        const classes = [this.$style.trigger];
        if (!this.disabled) {
          classes.push(this.$style.enabled);
        }
        return classes;
      }
    },
    watch: {
      disabled(val) {
        if (val) {
          this.close();
        }
      },
      isOpen(value) {
        if (value && this.setMaxDropdownHeight) {
          // Using nextTick to make sure DOM is updated first
          this.$nextTick(this.handleContentHeight);
        }
      }
    },
    methods: {
      toggleDropdown() {
        if (this.disabled) {
          return;
        }

        this.isDropdownOpen ? this.close() : this.open();
      },

      close() {
        if (this.isDropdownOpen) {
          this.$emit('dropdown:close');
          this.isOpenLocal = false;
        }
      },

      open() {
        if (!this.isDropdownOpen && !this.disabled) {
          if (this.$refs.contentElement.style.maxHeight) {
            this.resetContentHeight();
          }

          this.$emit('dropdown:open');
          this.isOpenLocal = true;
        }
      },

      handleContentHeight() {
        const contentElement = this.$refs.contentElement;
        if (!contentElement) {
          return;
        }

        const bottomPadding = 24;
        const dropdownTopOffset = this.getDropdownTopOffset(contentElement);
        const dropdownHeight = contentElement.clientHeight;
        const screenHeight = window.innerHeight;

        if (dropdownTopOffset + dropdownHeight + bottomPadding > screenHeight) {
          this.setContentHeight(
            screenHeight - dropdownTopOffset - bottomPadding
          );
        }
      },

      setContentHeight(height) {
        this.$refs.contentElement.style.maxHeight = `${height}px`;
      },

      getDropdownTopOffset(dropdownContainer) {
        let element = dropdownContainer;
        let offset = 0;

        while (element) {
          offset += element.offsetTop;
          element = element.offsetParent;
        }
        return offset;
      },

      resetContentHeight() {
        this.$refs.contentElement.style.maxHeight = '';
      }
    },
    mounted() {
      this.popupItem = this.$el;
    },
    data() {
      return {
        isOpenLocal: false
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .dropdown-container {
    position: relative;
  }

  .trigger.enabled {
    cursor: pointer;
  }

  .trigger {
    height: 100%;
  }

  .content {
    position: absolute;
    z-index: $z-dropdown;
    background-color: inherit;

    overflow-y: auto;

    &.is-right-aligned {
      right: 0;
    }

    &.is-left-aligned {
      left: 0;
    }

    &.default-color-style {
      background-color: $color-bg-light;
      box-shadow: $dropdown-shadow;
      border-radius: $base-border-radius;
    }
  }
</style>
