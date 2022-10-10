<template>
  <ActionModal
    title="Conditional formatting"
    submit-button-text="Save"
    cancel-button-text="Cancel"
    :is-disabled="!hasChanges"
    width="960px"
    @submit="onSubmit"
    @close="close"
  >
    <div :class="$style.rowsWrapper">
      <ConditionalFormattingModalRow
        v-for="formatting in formattingsLocal"
        :key="formatting.id"
        :class="$style.formattingRow"
        :formatting="formatting"
        saved
        @edit="editConditionalFormatting"
        @delete="deleteConditionalFormatting"
      />
      <ConditionalFormattingModalRow
        v-if="isEmptyRuleShown || !hasFormattings"
        :class="$style.formattingRow"
        @add="addConditionalFormatting"
        @cancel="hideEmptyRule"
      />
      <ButtonGhost
        v-show="!isEmptyRuleShown && hasFormattings"
        :class="$style.buttonAdd"
        text="Add another rule"
        @click="showEmptyRule"
      >
        <template #icon>
          <IconAddOutline />
        </template>
      </ButtonGhost>
    </div>
  </ActionModal>
</template>

<script>
  import { map, size, findIndex, reject, isEqual } from 'lodash';

  import ActionModal from 'components/modals/ActionModal';
  import ConditionalFormattingModalRow from './ConditionalFormattingModalRow';

  import IconAddOutline from '@/assets/images/icons/add-outline.svg';
  import ButtonGhost from '@/components/buttons/ButtonGhost';

  export default {
    components: {
      ButtonGhost,
      ConditionalFormattingModalRow,
      ActionModal,
      IconAddOutline
    },

    props: {
      formattings: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        formattingsLocal: map(this.formattings, formatting =>
          formatting.copy()
        ),
        isEmptyRuleShown: size(this.formattings) === 0
      };
    },

    computed: {
      hasChanges() {
        return !isEqual(this.formattings, this.formattingsLocal);
      },

      hasFormattings() {
        return size(this.formattingsLocal) > 0;
      }
    },

    methods: {
      showEmptyRule() {
        this.isEmptyRuleShown = true;
      },

      hideEmptyRule() {
        this.isEmptyRuleShown = false;
      },

      deleteConditionalFormatting(formattingId) {
        this.formattingsLocal = reject(this.formattingsLocal, [
          'id',
          formattingId
        ]);
      },

      editConditionalFormatting(formatting) {
        const formattingIndex = findIndex(this.formattingsLocal, [
          'id',
          formatting.id
        ]);

        this.$set(this.formattingsLocal, formattingIndex, formatting);
      },

      addConditionalFormatting(formatting) {
        this.formattingsLocal.push(formatting);

        this.hideEmptyRule();
      },

      close() {
        this.$emit('close');
      },

      onSubmit() {
        this.$emit('submit', this.formattingsLocal);
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .rows-wrapper {
    margin: 16px -40px 20px;
  }

  .formatting-row {
    border-top: 1px solid $color-border-main-light;

    &:last-of-type {
      border-bottom: 1px solid $color-border-main-light;
    }
  }

  .button-add {
    margin-top: 16px;
    margin-left: 30px;
  }
</style>
