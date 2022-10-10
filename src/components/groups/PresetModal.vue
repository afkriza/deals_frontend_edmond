<template>
  <ActionModal
    :size="modalSizesEnum.SMALL"
    :title="title"
    :submit-button-text="submitButtonText"
    :is-destructive="destructive"
    :is-loading="isLoading"
    @submit="onSubmit"
    @close="onClose"
  >
    <template v-if="destructive">
      <p>
        Are you sure you want to delete preset <b>‘{{ preset.name }}’</b>?
      </p>
    </template>
    <template v-else>
      <ValidationField
        :v="$v.presetLocal.name"
        :error-messages="errorMessagesPresetName"
      >
        <template #default="{ isError, errorMessage }">
          <InputText
            v-model.trim="presetLocal.name"
            label="Preset name"
            :error="isError"
            :message="errorMessage"
            @focus="$v.presetLocal.name.$reset"
          />
        </template>
      </ValidationField>
    </template>
  </ActionModal>
</template>

<script lang="ts">
  import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
  import { required } from 'vuelidate/lib/validators';

  import ActionModal from '@/components/modals/ActionModal.vue';
  import { modalSizesEnum } from '@/enums/modal-sizes.js';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputText from '@/components/inputs/new/InputText.vue';
  import { Preset } from '@/models/groups/Preset.model';
  import { errorMessagesFactory } from '@/utils/validation';

  @Component({
    components: { InputText, ValidationField, ActionModal },
    validations: {
      presetLocal: {
        name: {
          required
        }
      }
    }
  })
  export default class PresetModal extends Vue {
    @Prop({
      type: Preset,
      required: true
    })
    readonly preset!: Preset;

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
    readonly submit: (preset: Preset) => Promise<void>;

    presetLocal = this.preset.duplicate();

    isLoading = false;

    get modalSizesEnum() {
      return modalSizesEnum;
    }

    get errorMessagesPresetName() {
      return errorMessagesFactory('required', 'Please enter preset name');
    }

    async onSubmit() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      this.isLoading = true;

      try {
        await this.submit(this.presetLocal);

        this.onClose();
      } finally {
        this.isLoading = false;
      }
    }

    @Emit('close')
    onClose() {
      return;
    }
  }
</script>
