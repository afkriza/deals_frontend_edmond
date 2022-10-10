<template>
  <article :class="$style.placeholder">
    <span :class="$style.text">New calculation</span>
    <div
      :class="[
        $style.dropzoneWrapper,
        $style.border,
        { [$style.noBorder]: !this.showPlaceholder }
      ]"
    >
      <draggable
        :class="$style.dropzone"
        v-model="elements"
        :ghostClass="$style.ghostClass"
        :group="{
          name: 'calculationPlaceholderValues',
          pull: false,
          put: [
            'calculationValues',
            'variables',
            'operators',
            'recentVariables'
          ]
        }"
        direction="horizontal"
        @add="onAdd"
        ref="dropzone"
      >
      </draggable>
      <span v-show="showPlaceholder" :class="$style.placeholderText"
        >Drag and drop values and operators</span
      >
    </div>
  </article>
</template>

<script>
  import Draggable from 'vuedraggable';
  import { debounce } from 'lodash';

  const ghostClassRegex = new RegExp('\\bghost-class.*?\\b', 'g');

  export default {
    name: 'ValueCalculationPlaceholder',
    components: {
      Draggable
    },
    methods: {
      onAdd() {
        this.$emit('placeholder:add', this.elements[0]);

        this.elements = [];
      }
    },
    mounted() {
      this.observer = new MutationObserver(
        debounce(mutationsList => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const numberOfChildren = this.$refs.dropzone.$el.children.length;

              const { addedNodes } = mutation;

              const [addedNode] = addedNodes;

              // Pure vue solution doesn't work, like toggling ghost class on draggable
              if (
                addedNode &&
                addedNode.attributes.getNamedItem('class') &&
                addedNode.attributes
                  .getNamedItem('class')
                  .nodeValue.startsWith('item-wrapper')
              ) {
                addedNode.className = addedNode.className.replace(
                  ghostClassRegex,
                  ''
                );
              }

              this.showPlaceholder = numberOfChildren === 0;
            }
          }
        }, 5)
      );

      this.observer.observe(this.$refs.dropzone.$el, {
        childList: true
      });
    },
    beforeDestroy() {
      this.observer.disconnect();
    },
    data() {
      return {
        observer: null,
        showPlaceholder: true,
        elements: []
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .placeholder {
    display: flex;
    align-items: center;

    min-height: 80px;
    min-width: 700px;
    padding: 16px 30px 16px 15px;

    background-color: $color-bg-light;
    box-shadow: $value-calculation-box-shadow;
    border-radius: $base-border-radius;

    white-space: nowrap;
    color: $color-text-main-lighter;
  }

  .text {
    font-weight: bold;
    margin-left: 40px;
  }

  .dropzone-wrapper {
    position: relative;
    margin-left: 118px;
  }

  .border {
    border: 1px dashed $color-border-main-mid;
    border-radius: 4px;

    &.no-border {
      border: 1px solid transparent;
    }
  }

  .dropzone {
    width: 288px;
    height: 48px;
  }

  .placeholder-text {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    transform: translateX(-50%) translateY(-50%);
  }

  .ghost-class {
    display: absolute;
    z-index: 1;

    border: 1px dashed $color-border-primary;
    border-radius: 4px;
    background-color: $color-bg-primary-dimmed;
    box-shadow: none;
    min-width: 48px;
    min-height: 48px;
  }
</style>
