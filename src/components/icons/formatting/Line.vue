<template>
  <svg
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      :fill="backgroundColor_"
      fill-rule="evenodd"
    />
    <path
      clip-rule="evenodd"
      d="M16.4472 8.10555C16.9412 8.35254 17.1414 8.95321 16.8944 9.44719L14.8944 13.4472C14.6474 13.9412 14.0467 14.1414 13.5528 13.8944L10.4472 12.3416L8.8944 15.4472C8.64741 15.9412 8.04674 16.1414 7.55276 15.8944C7.05878 15.6474 6.85856 15.0467 7.10555 14.5528L9.10555 10.5528C9.35254 10.0588 9.95321 9.85856 10.4472 10.1055L13.5528 11.6583L15.1055 8.55276C15.3525 8.05878 15.9532 7.85856 16.4472 8.10555Z"
      :fill="color_"
      fill-rule="evenodd"
    />
  </svg>
</template>

<script>
  import BadgeIconMixin from 'mixins/badge-icon';

  export default {
    mixins: [BadgeIconMixin]
  };
</script>
