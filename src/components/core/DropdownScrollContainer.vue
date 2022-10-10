<template>
  <div :class="$style.dropdownContainer" ref="dropdownContainer">
    <div :class="triggerClass" @click="toggleDropdown">
      <slot name="trigger" />
    </div>
    <portal to="dropdowns">
      <transition name="dropdown-fade">
        <div
          v-if="isOpen"
          :class="$style.contentWrapper"
          :style="dropdownContentWrapperStyle"
          ref="contentWrapperElement"
        >
          <div
            :class="[$style.content, alignClass, customContentClass]"
            :style="isParentWidth && dropdownContentStyle"
            ref="contentElement"
          >
            <slot />
          </div>
        </div>
      </transition>
    </portal>
  </div>
</template>

<script>
  import BasicDropdown from 'components/core/BasicDropdown';

  export default {
    extends: BasicDropdown,

    props: {
      isParentWidth: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      dropdownContentWrapperStyle() {
        const { vertical = 0, horizontal = 0 } = this.offset;

        return {
          top: `${this.top + vertical}px`,
          left: `${this.left + horizontal}px`
        };
      },

      dropdownContentStyle() {
        return {
          width: `${this.contentWidth}px`
        };
      }
    },
    watch: {
      isOpen() {
        this.updateScroll();
      }
    },
    methods: {
      updateScroll() {
        if (!this.isOpen) {
          return;
        }
        const parentRect = this.$refs.dropdownContainer.getBoundingClientRect();

        this.top = parentRect.top + parentRect.height;
        this.left = parentRect.left;
      },

      isScrollable(element) {
        const style = window.getComputedStyle(element);

        return (
          element.scrollWidth > element.clientWidth || // element is currently overflown
          element.scrollHeight > element.clientHeight || // element is currently overflown
          style.getPropertyValue('overflow-y') === 'scroll' ||
          style.getPropertyValue('overflow-y') === 'auto' ||
          style.getPropertyValue('overflow-x') === 'scroll' ||
          style.getPropertyValue('overflow-x') === 'auto' ||
          style.getPropertyValue('overflow') === 'scroll' ||
          style.getPropertyValue('overflow') === 'auto'
        );
      }
    },

    updated() {
      this.contentWidth = this.$refs.dropdownContainer.getBoundingClientRect().width;
    },

    data() {
      return {
        top: 0,
        left: 0,
        contentWidth: 0,
        eventElements: []
      };
    },

    async mounted() {
      window.document.addEventListener('click', this.onDocumentClick);

      let el = this.$refs.dropdownContainer;

      // recursively listen to scrolling parents so this component's position can be updated accordingly
      while (el.parentNode) {
        el = el.parentNode;

        if (!(el instanceof Element)) {
          break;
        }

        if (this.isScrollable(el)) {
          el.addEventListener('scroll', this.updateScroll);
          this.eventElements.push(el);
        }
      }
      window.addEventListener('resize', this.updateScroll);

      this.updateScroll();
    },

    beforeDestroy() {
      window.document.removeEventListener('click', this.onDocumentClick);
      window.removeEventListener('resize', this.updateScroll);

      this.eventElements.forEach(el =>
        el.removeEventListener('scroll', this.updateScroll)
      );
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .content-wrapper {
    background: transparent;
    position: absolute;
    z-index: $z-dropdown;
  }

  .dropdown-container {
    position: relative;
  }

  .trigger.enabled {
    cursor: pointer;
  }

  .content {
    background-color: $color-bg-light;
    box-shadow: $dropdown-shadow;
    border-radius: 4px;
    overflow-y: auto;

    &.is-right-aligned {
      right: 0;
    }

    &.is-left-aligned {
      left: 0;
    }
  }
</style>

<style lang="scss">
  .dropdown-fade-enter-active,
  .dropdown-fade-leave-active {
    transition: opacity 0.2s;
  }

  .dropdown-fade-enter,
  .dropdown-fade-leave-to {
    opacity: 0;
  }
</style>
