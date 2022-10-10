<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      :class="$style[theme]"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.5 5.25C6.5 4.83579 6.83579 4.5 7.25 4.5H12V9.5C12 9.77614 12.2239 10 12.5 10H17.5V17.75C17.5 18.1642 17.1642 18.5 16.75 18.5H7.25C6.83579 18.5 6.5 18.1642 6.5 17.75V5.25ZM16.7929 9L13 5.20711V9H16.7929ZM7.25 3.5C6.2835 3.5 5.5 4.2835 5.5 5.25V17.75C5.5 18.7165 6.2835 19.5 7.25 19.5H16.75C17.7165 19.5 18.5 18.7165 18.5 17.75V9.5C18.5 9.36739 18.4473 9.24021 18.3536 9.14645L12.8536 3.64645C12.7598 3.55268 12.6326 3.5 12.5 3.5H7.25ZM14.6036 12.3536C14.7988 12.1583 14.7988 11.8417 14.6036 11.6464C14.4083 11.4512 14.0917 11.4512 13.8964 11.6464L10.5 15.0429L9.35355 13.8964C9.15829 13.7012 8.84171 13.7012 8.64645 13.8964C8.45118 14.0917 8.45118 14.4083 8.64645 14.6036L10.1464 16.1036C10.3417 16.2988 10.6583 16.2988 10.8536 16.1036L14.6036 12.3536Z"
      fill="#1E559A"
    />
  </svg>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import OverviewCardIcon from '@/components/icons/overview/OverviewCardIcon.vue';

  @Component({
    name: 'DoneIcon'
  })
  export default class Done extends OverviewCardIcon {}
</script>

<style lang="scss" module>
  @import 'utils';

  .bad,
  .good {
    fill: $color-bg-light;
  }

  .mid {
    fill: $color-bg-main-dark;
  }
</style>
