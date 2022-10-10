<template>
  <div :class="[$style.tab, 'variable']">
    <span :class="$style.name">{{ variable.name }}</span>
    <template v-if="!readonly">
      <span :class="$style.edit" @click="onEditVariableClick(variable)">
        <IconEditBold />
      </span>
      <BasicTooltip
        theme="light"
        align="right"
        :class="$style.removeBtn"
        :custom-tooltip-class="$style.tooltip"
        :disabled="!deleteDisabled"
        :offset="{
          vertical: 25
        }"
      >
        <span
          slot="trigger"
          :class="{
            [$style.disabled]: deleteDisabled
          }"
          @click.stop="onRemoveVariableClick(variable.variableId)"
        >
          <IconRemove />
        </span>
        <div :class="$style.tooltipContent">
          Variable used in: <br />
          <ul :class="$style.calculations">
            <li
              v-for="calculation in relatedCalculationsNames"
              :key="calculation.id"
            >
              {{ calculation }}
            </li>
          </ul>
        </div>
      </BasicTooltip>
    </template>
  </div>
</template>

<script>
  import BasicTooltip from 'components/core/BasicTooltip';
  import IconEditBold from '@/assets/images/icons/edit-2px.svg';
  import IconRemove from '@/assets/images/icons/remove.svg';

  export default {
    components: {
      BasicTooltip,
      IconEditBold,
      IconRemove
    },
    props: {
      variable: {
        type: Object,
        required: true
      },

      relatedCalculations: {
        type: Array,
        default() {
          return [];
        }
      },

      readonly: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      deleteDisabled() {
        return this.relatedCalculations.length;
      },

      relatedCalculationsNames() {
        return (
          this.relatedCalculations.length &&
          this.relatedCalculations.map(({ name }) => name)
        );
      }
    },

    methods: {
      onEditVariableClick(variable) {
        this.$emit('edit:click', variable);
      },

      onRemoveVariableClick(id) {
        this.$emit('remove:click', id);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .tab {
    @extend %wizard-tab;

    display: flex;
    align-items: center;
    min-height: 48px;
    cursor: grab;

    padding-top: 0;
    padding-bottom: 0;
    width: 286px;

    background-color: $color-bg-light;
    color: $color-text-primary;

    &:hover {
      background-color: $color-bg-primary-dimmed;
      .remove-btn,
      .edit {
        display: block;
      }
    }
  }

  .tooltip {
    top: 0;
    bottom: auto;
  }

  .tooltip-content {
    font-weight: normal;
    width: 105px;
  }

  .calculations {
    font-weight: bold;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .remove-btn {
    display: none;
    cursor: pointer;

    position: absolute;
    top: -10px;
    right: -10px;

    /* stylelint-disable selector-max-type */
    .disabled path:first-child {
      fill: $color-text-main-lighter;
    }

    /* stylelint-enable selector-max-type */
  }

  .name {
    @include text-ellipsis;

    flex: 1;
  }

  .edit {
    display: none;
    margin-left: auto;

    cursor: pointer;

    /* stylelint-disable selector-max-type */
    > svg path {
      fill: $color-text-primary;
    }

    /* stylelint-enable selector-max-type */
  }
</style>
