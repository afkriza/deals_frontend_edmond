<template>
  <div>
    <div :class="$style.dealNumber">#{{ deal.id }}</div>
    <TextEllipsis :class="$style.dealName" :text="deal.inquiry.name" />
    <TextEllipsis :text="deal.partner.name" />
    <TextEllipsis
      v-if="showDepartment"
      :class="$style.department"
      :text="formatDepartment(deal.department)"
    />
    <div :class="$style.groups">
      {{ determineGroupsText(deal.numOfGroups) }}
    </div>
    <div>{{ formatBudgetValue(deal.budget, deal.budgetCurrency) }}</div>
    <DealStatusTag :deal-status="deal.status" />
    <IconText
      v-if="deal.inquiry.priority"
      :class="$style.priority"
      :icon="IconWarning"
      text="Priority"
    />
    <DealUpdatesTag
      v-if="deal.messagesCount"
      :class="$style.updatesTag"
      :num-of-updates="deal.messagesCount"
    />
    <VPopover
      v-if="hasAccess(Role.Admin, Role.Sales)"
      :popover-inner-class="$style.popover"
      placement="left-start"
      offset="0 20"
      :class="$style.actions"
      :open.sync="dropdownOpen"
    >
      <ButtonGhost :active="dropdownOpen" oval @click.stop="toggleDropdown">
        <template #icon>
          <IconEllipsis :class="[$style.icon, $style.ellipsis]" />
        </template>
      </ButtonGhost>
      <template #popover>
        <DropdownList
          v-close-popover
          :class="$style.dropdownList"
          :custom-item-class="$style.dropdownListItem"
          :items="dealActions"
          @select="onDropdownActionClick($event, deal.id)"
        >
          <template #item="{ item }">
            <span>{{ item.name }}</span>
          </template>
        </DropdownList>
      </template>
    </VPopover>
  </div>
</template>

<script>
  import { VClosePopover, VPopover } from 'v-tooltip';
  import { mapGetters } from 'vuex';
  import { size, upperCase } from 'lodash';

  import { inquiryGridStatusTypeByEvent } from 'enums/groups';
  import { formatPriceNumber } from 'utils/format';
  import DropdownList from '@/components/core/DropdownList.vue';
  import IconEllipsis from '@/assets/images/icons/ellipsis.svg';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import DealStatusTag from '@/components/groups/DealStatusTag';
  import IconText from '@/components/groups/deal/IconText.vue';
  import IconWarning from '@/assets/images/icons/warning.svg';
  import DealUpdatesTag from '@/components/groups/DealUpdatesTag';
  import TextEllipsis from '@/components/core/TextEllipsis';

  import { Role } from '@/enums/Role.enum';
  import DealStatus from '@/enums/DealStatus.enum';
  import { SalesDepartment } from '@/enums/SalesDepartment.enum';

  export default {
    name: 'DealRow',
    components: {
      DropdownList,
      VPopover,
      IconEllipsis,
      ButtonGhost,
      DealStatusTag,
      IconText,
      DealUpdatesTag,
      TextEllipsis
    },
    directives: {
      closePopover: VClosePopover
    },
    props: {
      deal: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        Role,
        dropdownOpen: false,
        IconWarning
      };
    },
    computed: {
      ...mapGetters(['currentUser', 'hasAccess']),

      showDepartment() {
        return size(this.currentUser.salesDepartments) !== 1;
      },

      isDealCanceled() {
        return this.deal.status === DealStatus.Canceled;
      },

      dealActions() {
        const actions = [
          // TODO: uncomment this after deal duplication gets implemented
          // this.dealActionFactory('Duplicate deal', dealId =>
          //   this.$emit('deal:duplicate', dealId)
          // )
        ];

        if (!this.isDealCanceled) {
          actions.push(
            this.dealActionFactory('Cancel deal', dealId =>
              this.$emit('deal:cancel', dealId)
            )
          );
        }

        actions.push(
          this.dealActionFactory('Delete deal', dealId =>
            this.$emit('deal:delete', dealId)
          )
        );

        return actions;
      }
    },
    methods: {
      formatDepartment(department) {
        switch (department) {
          case SalesDepartment.MICE:
            return upperCase(department);
          default:
            return department;
        }
      },

      determineStatusType(status) {
        return inquiryGridStatusTypeByEvent[status];
      },

      determineGroupsText(numOfGroups) {
        return `${numOfGroups} ${numOfGroups > 1 ? 'groups' : 'group'}`;
      },

      formatBudgetValue(budget, budgetCurrency) {
        if (!budget || !budgetCurrency) {
          return '-';
        }

        return `${budgetCurrency}${formatPriceNumber(budget)}`;
      },

      dealActionFactory(name, action) {
        return {
          name,
          action
        };
      },

      onDropdownActionClick({ action }, dealId) {
        action(dealId);
      },

      toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .deal-number {
    color: $color-text-main-light;
  }

  .deal-name {
    font-weight: bold;
    overflow: hidden;
  }

  .updates-tag {
    margin-left: auto;

    grid-area: updates;
  }

  .dropdown-list {
    background-color: $color-bg-light;
    width: 178px;
    padding: 8px 0;

    &-item {
      padding: 14px 16px;
    }
  }

  .groups {
    grid-area: groups;
  }

  .priority {
    grid-area: priority;
  }

  .actions {
    grid-area: actions;
  }

  .department {
    text-transform: capitalize;
  }
</style>
