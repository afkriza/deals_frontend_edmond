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
      d="M6 16H18L14.8606 8.9364C14.5174 8.16412 13.4303 8.13943 13.0524 8.89532L11 13L9.9629 11.1851C9.55958 10.4793 8.52735 10.5241 8.1867 11.2622L6 16Z"
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
