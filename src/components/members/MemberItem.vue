<template>
  <div :class="$style.wrapper">
    <div :class="$style.container">
      <div :class="[$style.cell, $style.column]">
        <span :class="$style.name">{{ member.name }}</span>
        <span :class="$style.email">{{ member.email }}</span>
      </div>
      <div :class="$style.cell">{{ role }}</div>
      <div :class="[$style.cell, $style.column]">
        <span
          v-if="!isPropertyFiltered && properties.length"
          :class="[$style.bold, $style.row]"
        >
          <!-- @svg("hotels") -->
          <span>{{ properties }}</span>
        </span>
        <span v-if="reports.length" :class="$style.row">
          <!-- @svg("reports") -->
          <span>{{ reports }}</span>
        </span>
      </div>
      <div :class="$style.cell">
        <VPopover
          :class="$style.popover"
          :popover-class="$style.tooltip"
          :container="false"
          placement="bottom-start"
          :popper-options="{
            modifiers: {
              preventOverflow: {
                enabled: false
              }
            }
          }"
        >
          <IconEllipsis :class="$style.icon" />

          <template #popover>
            <div :class="$style.dropdown">
              <div
                v-close-popover
                :class="$style.dropdownItem"
                @click="onEditMemberClick"
              >
                Edit member
              </div>
              <div
                v-close-popover
                :class="$style.dropdownItem"
                @click="onDeleteMemberClick"
              >
                Delete member
              </div>
            </div>
          </template>
        </VPopover>
      </div>
    </div>
  </div>
</template>

<script>
  import { VClosePopover, VPopover } from 'v-tooltip';
  import IconEllipsis from '@/assets/images/icons/ellipsis.svg';

  import { emailReportsEnum } from 'enums/email-reports';
  import { memberRolesEnum } from 'enums/member-roles';
  import { capitalize } from 'utils/string';

  export default {
    components: {
      VPopover,
      IconEllipsis
    },

    directives: {
      closePopover: VClosePopover
    },

    props: {
      isPropertyFiltered: {
        type: Boolean,
        required: true
      },

      member: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        emailReports: Object.values(emailReportsEnum)
      };
    },

    computed: {
      role() {
        if (this.member.role) {
          return this.member.role.name;
        } else {
          return capitalize(memberRolesEnum.SUBSCRIBER.id);
        }
      },

      properties() {
        if (
          this.member.role &&
          this.member.role.id === memberRolesEnum.ADMIN.id
        ) {
          return 'All properties';
        }

        return this.member.properties.map(({ name }) => name).join(', ');
      },

      reports() {
        return this.member.reports
          .map(report => {
            const emailReport = this.emailReports.find(
              ({ id }) => report.id === id
            );

            if (!emailReport) {
              return;
            }

            return emailReport.name;
          })
          .join(', ');
      }
    },

    methods: {
      onEditMemberClick() {
        this.$emit('editMember:click', this.member);
      },

      onDeleteMemberClick() {
        this.$emit('deleteMember:click', this.member);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .wrapper {
    transition: background-color 0.2s;

    &:hover {
      background-color: $color-bg-primary-dimmed;

      .popover {
        visibility: visible;
      }
    }
  }

  .container {
    display: flex;

    margin: 0;
  }

  .cell {
    display: flex;
    flex: 1 0;
    line-height: 20px;
    padding: 30px 0;
    color: $color-text-main;

    &.column {
      flex-direction: column;
    }
  }

  .name {
    font-weight: bold;
    margin-bottom: 7px;
  }

  .email {
    color: $color-text-main-lighter;
  }

  .dropdown {
    min-width: 205px;
    padding: 8px 0;
    background-color: $color-bg-light;

    border-radius: 4px;
  }

  .dropdown-item {
    @include row;
    align-items: center;
    transition: background-color 0.2s;
    height: 48px;
    padding-left: 16px;

    cursor: pointer;

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }
  }

  .popover {
    visibility: hidden;
    margin-left: auto;

    .tooltip {
      z-index: 0;
    }
  }

  .bold {
    font-weight: bold;
  }

  .icon {
    cursor: pointer;
  }

  /* stylelint-disable selector-max-type */
  .row {
    @include row;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    > svg {
      flex-shrink: 0;
      margin-right: 15px;
    }
  }

  /* stylelint-enable selector-max-type */
</style>
