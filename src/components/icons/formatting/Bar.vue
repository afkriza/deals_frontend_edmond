<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      :fill="backgroundColor_"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11 7H8V17H11V7ZM16 10H13V17H16V10Z"
      :fill="color_"
    />
  </svg>
</template>

<script>
  import BadgeIconMixin from 'mixins/badge-icon';

  export default {
    mixins: [BadgeIconMixin]
  };
</script>
