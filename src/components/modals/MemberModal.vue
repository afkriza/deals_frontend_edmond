<template>
  <ActionModal
    :title="title"
    :submit-button-text="submitButtonText"
    cancel-button-text="Cancel"
    size="small"
    :is-loading="isLoading"
    :is-destructive="destructive"
    scrollable
    @submit="onSubmit"
    @close="close"
  >
    <template v-if="destructive">
      <p>Warning: this cannot be undone.</p>
      <p>
        Deleting {{ member.name }} will permanently remove all their information
        from the database which means that they will:
      </p>
      <ul :class="$style.list">
        <li>Lose access to Edmond RMS,</li>
        <li>No longer recieve email reports,</li>
        <li>All shared links will be invalid.</li>
      </ul>
    </template>
    <section v-else :class="$style.content">
      <div :class="[$style.row, $style.split]">
        <ValidationField
          :v="$v.memberLocal.firstName"
          :error-messages="errorMessagesFirstName"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="memberLocal.firstName"
              label="First name"
              :message="errorMessage"
              :error="isError"
              @focus="$v.memberLocal.firstName.$reset()"
            />
          </template>
        </ValidationField>
        <ValidationField
          :v="$v.memberLocal.lastName"
          :error-messages="errorMessagesLastName"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="memberLocal.lastName"
              label="Last name"
              :message="errorMessage"
              :error="isError"
              @focus="$v.memberLocal.lastName.$reset()"
            />
          </template>
        </ValidationField>
      </div>

      <ValidationField
        :v="$v.memberLocal.email"
        :error-messages="errorMessagesEmail"
      >
        <template #default="{ isError, errorMessage }">
          <InputText
            v-model.trim="memberLocal.email"
            label="Email"
            :message="errorMessage"
            :error="isError"
            @focus="$v.memberLocal.email.$reset()"
          />
        </template>
      </ValidationField>

      <ValidationField
        :v="$v.memberLocal.role"
        :error-messages="errorMessagesRole"
      >
        <template #default="{ isError, errorMessage }">
          <InputSelect
            :value="memberLocal.role"
            label="Role"
            :options="roles"
            :message="
              isError
                ? errorMessage
                : memberLocal.role && memberLocal.role.description
            "
            :error="isError"
            search-by="name"
            @select="memberLocal.setRole($event)"
            @focus="$v.memberLocal.role.$reset()"
          />
        </template>
      </ValidationField>

      <div v-if="isSales" :class="$style.departments">
        <label :class="$style.label">Sales department</label>

        <InputCheckbox
          v-for="department in salesDepartments"
          :key="department.id"
          :label="department.name"
          :checked="isSalesDepartmentChecked(department.id)"
          @change="onSalesDepartmentChange(department, $event)"
        />
      </div>

      <ValidationField
        v-show="isPropertiesSelectEnabled"
        :v="$v.memberLocal.properties"
        :error-messages="errorMessagesProperties"
      >
        <template #default="{ isError, errorMessage }">
          <InputMultiselect
            v-model="memberLocal.properties"
            label="Properties"
            :options="properties"
            :message="errorMessage"
            :error="isError"
            search-by="name"
            searchable
            @focus="$v.memberLocal.properties.$reset()"
          />
        </template>
      </ValidationField>

      <div v-if="areEmailReportsAvailable" :class="$style.emailReports">
        <ValidationField
          :v="$v.memberLocal.reports"
          :error-messages="errorMessagesReports"
        >
          <template #default="{ isError, errorMessage }">
            <div>
              <label :class="$style.label">Email reports</label>
              <span v-if="isError" :class="$style.error">{{
                errorMessage
              }}</span>
            </div>
          </template>
        </ValidationField>

        <InputCheckbox
          v-for="emailReport in emailReports"
          :key="emailReport.id"
          :label="emailReport.name"
          :checked="isEmailReportChecked(emailReport.id)"
          @change="onEmailReportChange(emailReport, $event)"
        />
      </div>
    </section>
  </ActionModal>
</template>

<script lang="ts">
  import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
  import { email, required, requiredIf } from 'vuelidate/lib/validators';
  import { includes, reject, map } from 'lodash';

  import { errorMessagesFactory } from '@/utils/validation';
  import { Member } from '@/models/Member.model';
  import InputCheckbox from '@/components/inputs/new/InputCheckbox.vue';
  import ValidationField from '@/components/renderless/ValidationField';
  import InputText from '@/components/inputs/new/InputText.vue';
  import ActionModal from '@/components/modals/ActionModal.vue';
  import { Role } from '@/enums/Role.enum';
  import { EmailReport } from '@/models/EmailReport.model';
  import { MembersConfiguration } from '@/store/modules/members/Members.module';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import InputMultiselect from '@/components/inputs/new/InputMultiselect.vue';
  import { SalesDepartment } from '@/models/SalesDepartment.model';

  @Component({
    components: {
      InputMultiselect,
      InputSelect,
      ActionModal,
      InputText,
      ValidationField,
      InputCheckbox
    },
    validations: {
      memberLocal: {
        firstName: {
          required
        },
        lastName: {
          required
        },
        email: {
          required,
          email,
          emailTaken() {
            return !this.errors.email;
          }
        },
        role: {
          required
        },

        properties: {
          required: requiredIf(function () {
            return this.isPropertiesSelectEnabled;
          })
        },

        reports: {
          required: requiredIf(function () {
            return this.areEmailReportsRequired;
          })
        }
      }
    }
  })
  export default class MemberModal extends Vue {
    @Prop({
      type: String,
      required: true
    })
    readonly title: string;

    @Prop({
      type: Boolean
    })
    readonly destructive: boolean;

    @Prop({
      type: String,
      required: true
    })
    readonly submitButtonText: string;

    @Prop({
      type: Member,
      default: () => Member.default()
    })
    member!: Member;

    @Prop({
      type: Object,
      default: null
    })
    readonly configuration: MembersConfiguration;

    @Prop({
      type: Function,
      required: true
    })
    readonly submit: (member: Member) => Promise<void>;

    memberLocal = this.member.copy();

    isLoading = false;

    errors = {};

    get isSales() {
      return this.memberLocal.role?.id === Role.Sales;
    }

    get areEmailReportsAvailable() {
      return this.memberLocal.role?.id !== Role.Sales;
    }

    get areEmailReportsRequired() {
      return this.memberLocal.role?.id === Role.Subscriber;
    }

    get isPropertiesSelectEnabled() {
      if (!this.memberLocal.role) {
        return false;
      }

      return this.memberLocal.role?.id !== Role.Administrator;
    }

    get roles() {
      return this.configuration?.roles;
    }

    get properties() {
      return this.configuration?.properties;
    }

    get emailReports() {
      return this.configuration?.emailReports;
    }

    get salesDepartments() {
      return this.configuration?.salesDepartments;
    }

    get errorMessagesFirstName() {
      return errorMessagesFactory('required', 'Please enter a name');
    }

    get errorMessagesLastName() {
      return errorMessagesFactory('required', 'Please enter a surname');
    }

    get errorMessagesEmail() {
      return errorMessagesFactory({
        required: 'Please enter an email address',
        emailTaken: 'Email has already been taken'
      });
    }

    get errorMessagesRole() {
      return errorMessagesFactory('required', 'Please enter a role');
    }

    get errorMessagesProperties() {
      return errorMessagesFactory(
        'required',
        'Please select at least one property '
      );
    }

    get errorMessagesReports() {
      return errorMessagesFactory(
        'required',
        'Please select at least one report'
      );
    }

    isEmailReportChecked(emailReportId: EmailReport['id']) {
      return includes(map(this.memberLocal.reports, 'id'), emailReportId);
    }

    onEmailReportChange(emailReport: EmailReport, value: boolean) {
      if (value) {
        this.memberLocal.reports = [...this.memberLocal.reports, emailReport];
      } else {
        this.memberLocal.reports = reject(this.memberLocal.reports, [
          'id',
          emailReport.id
        ]);
      }
    }

    isSalesDepartmentChecked(salesDepartmentId: SalesDepartment['id']) {
      return includes(
        map(this.memberLocal.salesDepartments, 'id'),
        salesDepartmentId
      );
    }

    onSalesDepartmentChange(salesDepartment: SalesDepartment, value: boolean) {
      if (value) {
        this.memberLocal.salesDepartments = [
          ...this.memberLocal.salesDepartments,
          salesDepartment
        ];
      } else {
        this.memberLocal.salesDepartments = reject(
          this.memberLocal.salesDepartments,
          ['id', salesDepartment.id]
        );
      }
    }

    @Emit('close')
    close() {
      return;
    }

    async onSubmit() {
      this.errors = {};
      if (!this.destructive) {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }
      }

      try {
        this.isLoading = true;

        await this.submit(this.memberLocal);
      } catch (e) {
        this.errors = e;
      } finally {
        this.isLoading = false;
      }
    }
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .content {
    @include column;

    gap: 30px;

    padding-bottom: 16px;
  }

  .row {
    @include row;
    align-items: center;
  }

  .row + .row {
    margin-top: 30px;
  }

  .split {
    gap: 16px;

    & > * {
      flex: 1;
    }
  }

  .email-reports,
  .departments {
    @include column;
    align-items: flex-start;

    padding-top: 16px;

    gap: 8px;

    .label {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;

      color: $color-text-main-light;

      margin-bottom: 8px;
    }

    .error {
      color: $color-text-warning;
      font-size: 12px;
      line-height: 16px;

      margin-left: 16px;
    }
  }

  .list {
    padding-left: 16px;
  }
</style>
