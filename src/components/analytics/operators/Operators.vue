<template>
  <draggable
    :class="$style.operators"
    :group="{ name: 'operators', pull: 'clone', put: ['operators'] }"
    :value="operatorModels"
    :sort="false"
    v-on="$listeners"
  >
    <Operator
      v-for="(operatorModel, idx) in operatorModels"
      :key="idx"
      v-bind="operatorModel.props"
    />
  </draggable>
</template>

<script>
  import Draggable from 'vuedraggable';

  import Operator from './Operator';
  import OperatorModel from '../models/Operator';

  import operatorsMixin from 'mixins/widget-operators';

  import { SUM, AVG } from 'constants/widget-operators';

  export default {
    components: {
      Draggable,
      Operator
    },

    mixins: [operatorsMixin],

    computed: {
      sidebarOperators() {
        return this.operators.filter(
          operator => !this.operatorsNotIncluded.includes(operator)
        );
      },

      operatorModels() {
        return this.sidebarOperators.map(OperatorModel.from);
      }
    },

    data() {
      return {
        operatorsNotIncluded: [SUM, AVG]
      };
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .operators {
    @include flex-center($flex-direction: column);

    color: $color-text-primary;

    /* fixing dropzone twitch */
    /* stylelint-disable selector-max-universal */
    & > * {
      margin-bottom: 16px;
    }
  }
</style>
