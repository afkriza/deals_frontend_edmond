<template>
  <div :class="$style.sectionRibbon">
    <h3 :class="$style.ribbonTitle">{{ title }}</h3>
    <BasicTooltip
      v-if="instructions"
      :offset="offset"
      :class="$style.tooltip"
      theme="light"
    >
      <span slot="trigger" :class="$style.ribbonIcon">
        <InfoIcon />
      </span>
      <div :class="$style.tooltipBody">
        <span v-if="type === iconTypes.LABELS" :class="$style.tooltipIcon">
          <TableLabelsIcon />
        </span>
        <span v-else :class="$style.tooltipIcon">
          <TableValuesIcon />
        </span>
        <p :class="$style.tooltipText">
          {{ instructions }}
        </p>
      </div>
    </BasicTooltip>
    <span
      :class="[$style.chevron, { [$style.isOpen]: isOpen }]"
      @click="toggleAccordion"
    >
      <ChevronUpIcon />
    </span>
  </div>
</template>

<script>
  import BasicTooltip from 'components/core/BasicTooltip';
  import InfoIcon from '@/assets/images/icons/info-thick.svg';
  import TableLabelsIcon from '@/assets/images/icons/table-labels.svg';
  import TableValuesIcon from '@/assets/images/icons/table-values.svg';
  import ChevronUpIcon from '@/assets/images/icons/chevron-up.svg';

  import { wizardSectionRibbonTypes } from 'enums/wizard-section-ribbon-types';

  export default {
    components: {
      BasicTooltip,
      InfoIcon,
      TableLabelsIcon,
      TableValuesIcon,
      ChevronUpIcon
    },

    props: {
      title: {
        type: String,
        required: true
      },

      instructions: {
        type: String,
        default: ''
      },

      offset: {
        type: Object,
        required: true
      },

      type: {
        type: String,
        default: wizardSectionRibbonTypes.LABELS
      },

      isOpen: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        iconTypes: wizardSectionRibbonTypes
      };
    },

    methods: {
      toggleAccordion() {
        this.$emit('accordion:toggle');
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .section-ribbon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    max-height: 56px;
    padding-left: 25px;

    color: $color-text-light;
  }

  .ribbon-title {
    font-size: 12px;

    margin: 0;

    text-transform: uppercase;
  }

  .chevron {
    margin-left: auto;
    padding: 10px 25px;
    transition: transform 0.3s;
    cursor: pointer;

    &.is-open {
      transform: rotate(180deg);
    }

    /* stylelint-disable selector-max-type */
    svg path {
      fill: $color-text-light;
    }

    /* stylelint-enable selector-max-type */
  }

  .ribbon-icon {
    margin-left: 5px;
    cursor: pointer;

    /* stylelint-disable selector-max-type */
    > svg path {
      fill: $color-text-main-lighter;
    }

    /* stylelint-enable selector-max-type */
  }

  .tooltip {
    height: 16px;
  }

  .tooltip-body {
    font-size: 14px;
    line-height: 1.43em;

    display: flex;
    align-items: flex-start;

    width: 275px;
    background-color: $color-bg-light;
  }

  .tooltip-text {
    margin: 0 0 0 15px;
  }
</style>
