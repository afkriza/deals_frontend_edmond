<template>
  <fragment>
    <div>
      <div
        v-for="(contact, index) in contacts"
        :key="`email${index}`"
        :class="$style.contactRow"
      >
        <IconPrimaryContact v-if="contact.primary" />
        <div v-else :class="$style.notPrimary"></div>
        <span :class="$style.email">{{ contact.email || '-' }}</span>
      </div>
    </div>
    <div :class="$style.phoneNumbersContainer">
      <div
        v-for="(contact, index) in contacts"
        :key="`phone${index}`"
        :class="$style.contactRow"
      >
        {{ contact.phoneNumber || '-' }}
      </div>
    </div>
  </fragment>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import IconPrimaryContact from '@/assets/images/icons/Misc/ic-16-favorite-active.svg';
  import { Fragment } from 'vue-fragment';

  interface PartnerContact {
    email: string;
    phoneNumber: string;
    primary: boolean;
  }

  @Component({
    name: 'PartnerContacts',
    components: {
      IconPrimaryContact,
      Fragment
    }
  })
  export default class PartnerAddress extends Vue {
    @Prop({
      type: Array
    })
    readonly contacts: Array<PartnerContact>;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .contact-row {
    display: flex;
    align-items: center;

    &:not(:first-child) {
      padding-top: 16px;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $color-border-main-light;
      padding-bottom: 15px;
    }
  }

  .phone-numbers-container {
    margin-left: -20px;
  }

  .email {
    margin-left: 16px;
  }

  .not-primary {
    width: 16px;
  }
</style>
