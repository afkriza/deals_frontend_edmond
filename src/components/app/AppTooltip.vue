<template>
  <div :class="$style.tooltip">
    <div
      ref="trigger"
      :class="$style.trigger"
      @click="onMouseClick"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <slot name="trigger" />
    </div>
    <base-tooltip
      v-visible="showTooltip"
      :position="position"
      :offset-x="calculateOffsetX"
      :offset-y="offsetY"
    >
      <div ref="content">
        <slot name="content" />
      </div>
    </base-tooltip>
  </div>
</template>

<script>
  import { debounce } from 'lodash';
  import BaseTooltip from 'components/core/BaseTooltip';

  const validPositions = ['left', 'top', 'right', 'bottom'];
  export default {
    name: 'AppTooltip',
    components: { BaseTooltip },
    props: {
      position: {
        type: String,
        default: 'right',
        validator(value) {
          return validPositions.indexOf(value) !== -1;
        }
      },

      offsetX: {
        type: String,
        default: '0px'
      },

      offsetY: {
        type: String,
        default: '0px'
      },

      followMouse: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      calculateOffsetX() {
        if (!this.followMouse || !this.mouseEnterEvt) {
          return this.offsetX;
        }

        return `${this.mouseEnterEvt.clientX -
          this.triggerElRect.x -
          this.contentElRect.width / 2}px`;
      }
    },
    methods: {
      onMouseClick(evt) {
        this.mouseEnterEvt = evt;
        this.updateElRects();
      },

      onMouseEnter(evt) {
        this.mouseEnterEvt = evt;
        this.updateElRects();
        this.showTooltip = true;
      },

      onMouseLeave() {
        this.showTooltip = false;
      },

      updateElRects() {
        this.triggerElRect = this.$refs.trigger.getBoundingClientRect();
        this.contentElRect = this.$refs.content.getBoundingClientRect();
      }
    },

    data() {
      return {
        showTooltip: false,
        triggerElRect: null,
        contentElRect: null,
        mouseEnterEvt: null,
        observer: null
      };
    },

    mounted() {
      this.updateElRects();

      this.observer = new MutationObserver(debounce(this.updateElRects, 5));

      const config = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      };
      this.observer.observe(this.$refs.trigger, config);
      this.observer.observe(this.$refs.content, config);
    },

    beforeDestroy() {
      this.observer.disconnect();
    }
  };
</script>

<style lang="scss" module>
  .tooltip {
    position: relative;
  }
</style>
