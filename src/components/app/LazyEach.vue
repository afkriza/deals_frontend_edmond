<template>
  <div :class="$style.lazyEach" id="lazy-each">
    <slot :items="items" />
  </div>
</template>

<script>
  export default {
    mounted: function() {
      const elementList = document.querySelectorAll(
        this.scrollableContainerSelector
      );
      if (elementList.length) {
        this.element = elementList[0];
        this.checkPosition();
      }
    },

    destroyed: function() {
      this.element = '';
      this.isDestroyed = true;
    },

    components: {},
    props: {
      items: {
        type: Array,
        required: true
      },

      scrollableContainerSelector: {
        type: String,
        required: true
      }
    },
    computed: {},
    methods: {
      checkPosition() {
        if (this.isDestroyed) {
          return;
        }

        window.requestAnimationFrame(() => {
          if (
            this.element.scrollTop ===
            this.element.scrollHeight - this.element.offsetHeight
          ) {
            this.$emit('lazyLoad:trigger');
          }

          this.checkPosition();
        });
      }
    },
    data() {
      return {
        element: '',
        isDestroyed: false
      };
    }
  };
</script>
<style lang="scss" module>
  .lazy-each {
    overflow: auto;
  }
</style>
