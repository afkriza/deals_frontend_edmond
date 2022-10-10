<template>
  <div :class="$style.observer"></div>
</template>

<script>
  export default {
    name: 'IntersectionEmitter',
    props: {
      options: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        observer: null
      };
    },
    mounted() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          this.$emit('intersect');
        }
      }, this.options);

      this.observer.observe(this.$el);
    },

    destroyed() {
      this.observer.disconnect();
    }
  };
</script>

<style lang="scss" module>
  .observer {
    min-height: 1px;
    visibility: hidden;
  }
</style>
