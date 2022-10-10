<template>
  <TimelineMessage
    :class="$style.message"
    :current-user="currentUser"
    :message-creator="message.user"
    :timestamp="message.createdAt"
  >
    <template #heading>
      <span
        >{{ message.user.firstName }} {{ message.user.lastName }} sent an
        <b :class="$style.main">offer</b></span
      >
    </template>
    <div :class="$style.heading">
      <h2 :class="$style.title">{{ offer.property.name }}</h2>
      <OfferStatus
        :class="$style.offerStatus"
        :value="offer.status"
        :readonly="!hasAccess(Role.Admin, Role.Sales)"
        @change="onOfferStatusChange"
      />
      <ButtonRegular
        v-if="hasAccess(Role.Admin, Role.Sales)"
        v-show="offer.numberOfFinalOffers > 0 && isNewOffer"
        :class="$style.buttonSendToPms"
        @click="onSendToPMSClick"
      >
        Send to PMS
      </ButtonRegular>
    </div>
    <div :class="$style.groups">
      <template v-for="(group, idx) in offer.groups">
        <div :key="group.id" :class="$style.group">
          <div :class="[$style.table, $style.header]">
            <b>{{
              formatDateRange(group.dateRange.from, group.dateRange.to)
            }}</b>
            <template v-if="idx === 0">
              <b>Price</b>
              <b>Quantity</b>
            </template>
          </div>
          <template v-for="unit in group.units">
            <div :key="unit.id" :class="[$style.table, $style.row]">
              <span>{{ unit.unitType.name }}</span>
              <span>{{ unit.service.name }}</span>
              <span>€ {{ formatPriceNumber(unit.price) }}</span>
              <span>{{ unit.quantity }}</span>
            </div>
          </template>
          <div :class="$style.table">
            <b :class="$style.total">{{ calculateTotalQuantity(group) }}</b>
          </div>
        </div>
      </template>
      <div :class="$style.footer">
        <template v-if="hasAccess(Role.Admin, Role.Sales)">
          <ButtonGhost
            v-if="offer.numberOfFinalOffers > 0"
            :text="`View PDFs (${offer.numberOfFinalOffers})`"
            @click="onViewPdfsClick"
          >
            <template #icon>
              <IconPdf />
            </template>
          </ButtonGhost>

          <ButtonGhost v-else text="Create PDF" @click="onCreatePdfClick">
            <template #icon>
              <IconAdd />
            </template>
          </ButtonGhost>
        </template>

        <ButtonGhost
          v-if="hasAccess(Role.Admin, Role.Manager)"
          :class="$style.buttonCopyAndEditOffer"
          text="Copy and edit offer"
          @click="onCopyAndEditOfferClick"
        >
          <template #icon>
            <IconCopy />
          </template>
        </ButtonGhost>
      </div>
    </div>
  </TimelineMessage>
</template>

<script lang="ts">
  import { mapGetters } from 'vuex';
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import { map, sum } from 'lodash';
  import {
    formatDateRange,
    formatList
  } from '@/components/groups/shared/utils';
  import { formatPriceNumber } from '@/utils/format';
  import ButtonRegular from '@/components/buttons/ButtonRegular.vue';
  import ButtonGhost from '@/components/buttons/ButtonGhost.vue';

  import TimelineMessage from '@/components/groups/deal/TimelineMessage.vue';

  import { SentOfferMessage } from '@/models/groups/Message';

  import IconAdd from '@/assets/images/icons/add-flat.svg';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconPdf from '@/assets/images/icons/Misc/ic-24-PDF.svg';
  import OfferStatus from '@/components/groups/timeline/OfferStatus.vue';
  import { Role } from '@/enums/Role.enum';
  import OfferStatusEnum from '@/enums/OfferStatus.enum';

  @Component({
    components: {
      OfferStatus,
      TimelineMessage,
      ButtonRegular,
      ButtonGhost,
      IconAdd,
      IconCopy,
      IconPdf
    },
    computed: mapGetters(['hasAccess']),
    methods: {
      formatDateRange,
      formatList,
      formatPriceNumber
    }
  })
  export default class NewOfferCard extends Vue {
    @Prop({
      type: SentOfferMessage,
      required: true
    })
    readonly message;

    @Prop({
      type: Object,
      required: true
    })
    readonly currentUser;

    get Role() {
      return Role;
    }

    get offer() {
      return this.message.offer;
    }

    get isNewOffer() {
      return this.offer.status === OfferStatusEnum.New;
    }

    calculateTotalQuantity(group) {
      return sum(map(group.units, 'quantity'));
    }

    @Emit('pdf:view')
    onViewPdfsClick() {
      return;
    }

    @Emit('pdf:create')
    onCreatePdfClick() {
      return;
    }

    @Emit('offer:copy-and-edit')
    onCopyAndEditOfferClick() {
      return;
    }

    @Emit('send-to-pms')
    onSendToPMSClick() {
      return this.offer;
    }

    @Emit('offer:status-change')
    onOfferStatusChange(status) {
      return status;
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .message {
    padding-bottom: 16px;
  }

  .heading {
    @include row;
    align-items: center;

    padding: 17px 24px;

    border-bottom: 1px solid $color-border-main-light;
  }

  .main {
    color: $color-text-main;
  }

  .offer-status {
    margin-left: auto;
  }

  .title {
    margin: 0;
    line-height: 24px;
  }

  .button-send-to-pms {
    width: 128px;
    height: 32px;

    margin-left: 16px;
  }

  .groups {
    padding: 13px 24px 0;
  }

  .group {
    @include column;
  }

  .group + .group {
    margin-top: 8px;
  }

  .table {
    @include row;
    align-items: center;
    padding: 6px 12px;
  }

  .header {
    > :nth-child(1) {
      flex-grow: 1;

      margin-bottom: 4px;
    }

    > :nth-child(2),
    > :nth-child(3) {
      flex-basis: 72px;
      margin-left: 40px;
      margin-bottom: 6px;

      line-height: 16px;
      font-size: 12px;
      color: $color-text-main-light;
      text-transform: uppercase;

      text-align: end;
    }
  }

  .row {
    border-radius: 4px;

    &:nth-child(2n) {
      background-color: $color-bg-main-dimmed;
    }

    > :nth-child(1) {
      flex-basis: 120px;
    }

    > :nth-child(2) {
      flex: 1;
    }

    > :nth-child(3),
    > :nth-child(4) {
      flex-basis: 72px;
      margin-left: 40px;

      text-align: end;

      white-space: nowrap;
    }
  }

  .total {
    margin-left: auto;
  }

  .footer {
    @include row;
    justify-content: space-between;

    padding-top: 22px;
    padding-bottom: 16px;
  }

  .button-copy-and-edit-offer {
    margin-left: auto;
  }
</style>
