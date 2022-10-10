<template>
  <ActionModal
    :title="title"
    size="small"
    :submit-button-text="submitButtonText"
    :is-destructive="destructive"
    :is-loading="loading"
    @submit="submit"
    @close="onClose"
  >
    <p v-if="$slots.default" :class="$style.description">
      <slot />
    </p>
    <ValidationField
      v-if="!destructive"
      :v="$v.pdfName"
      :error-messages="errorMessages"
    >
      <template #default="{ isError, errorMessage }">
        <InputText
          v-model.trim="pdfName"
          :class="$style.input"
          label="PDF name"
          :error="isError"
          :message="errorMessage"
          @focus="$v.$reset()"
        />
      </template>
    </ValidationField>
  </ActionModal>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import ActionModal from '@/components/modals/ActionModal.vue';
  import InputText from '@/components/inputs/new/InputText.vue';
  import { required } from 'vuelidate/lib/validators';
  import ValidationField from '@/components/renderless/ValidationField';
  import { errorMessagesFactory } from '@/utils/validation';

  @Component({
    components: { ValidationField, InputText, ActionModal },
    validations: {
      pdfName: {
        required,
        unique(name: string) {
          return this.errors?.name !== name;
        }
      }
    }
  })
  export default class PdfOfferModal extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly title: string;

    @Prop({
      type: String,
      required: true
    })
    readonly submitButtonText: string;

    @Prop({
      type: Boolean
    })
    readonly destructive: boolean;

    @Prop({
      type: Function,
      required: true
    })
    readonly onSubmit;

    @Prop({
      type: String,
      default: null
    })
    readonly name!: string;

    pdfName = this.name;

    loading = false;

    errors = null;

    get isEdit() {
      return Boolean(this.name);
    }

    get errorMessages() {
      return errorMessagesFactory({
        required: 'Please enter a name',
        unique: 'This name is already taken, please choose a different name'
      });
    }

    async submit() {
      if (!this.destructive) {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }
      }

      this.loading = true;
      this.errors = null;

      try {
        await this.onSubmit(this.pdfName);
      } catch (e) {
        if (e.name) {
          this.errors = { name: this.pdfName };
        } else {
          throw e;
        }
      } finally {
        this.loading = false;
      }
    }

    @Emit('close')
    onClose() {
      return;
    }
  }
</script>

<style lang="scss" module>
  .description {
    margin: 0;
  }

  .description + .input {
    margin-top: 12px;
  }

  .input {
    margin-bottom: 26px;
  }
</style>
