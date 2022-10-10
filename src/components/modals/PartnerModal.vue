<template>
  <ActionModal
    :title="existingPartner ? 'Edit partner' : 'Add new partner'"
    submit-button-text="Save partner"
    cancel-button-text="Cancel"
    :is-loading="isLoading"
    width="1200px"
    is-dark-themed
    show-close-icon
    scrollable
    disable-backdrop-closing
    @submit="onSubmit"
    @close="close"
  >
    <div :class="$style.content">
      <section :class="$style.inputs">
        <ValidationField
          :v="$v.partner.name"
          :error-messages="errorMessagesOrganization"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="partner.name"
              label="Organization/Company"
              :error="isError"
              :message="errorMessage"
              @focus="$v.partner.name.$reset()"
            />
          </template>
        </ValidationField>

        <ValidationField
          :v="$v.partner.address"
          :error-messages="errorMessagesAddress"
        >
          <template #default="{ isError, errorMessage }">
            <InputText
              v-model.trim="partner.address"
              label="Address"
              :error="isError"
              :message="errorMessage"
              @focus="$v.partner.address.$reset()"
            />
          </template>
        </ValidationField>

        <div :class="$style.row">
          <ValidationField
            :v="$v.partner.postcode"
            :error-messages="errorMessagesPostcode"
          >
            <template #default="{ isError, errorMessage }">
              <InputText
                v-model.trim.number="partner.postcode"
                :class="$style.inputPostcode"
                label="Postcode"
                :error="isError"
                :message="errorMessage"
                @focus="$v.partner.postcode.$reset()"
              />
            </template>
          </ValidationField>

          <ValidationField
            :v="$v.partner.city"
            :error-messages="errorMessagesCity"
          >
            <template #default="{ isError, errorMessage }">
              <InputText
                v-model.trim="partner.city"
                :class="$style.grow"
                label="City"
                :error="isError"
                :message="errorMessage"
                @focus="$v.partner.city.$reset()"
              />
            </template>
          </ValidationField>
        </div>

        <ValidationField
          :v="$v.partner.country"
          :error-messages="errorMessagesCountry"
        >
          <template #default="{ isError, errorMessage }">
            <InputSelect
              v-model="selectedCountry"
              :class="$style.inputCountry"
              :options="countryOptions"
              :error="isError"
              :message="errorMessage"
              placeholder="Select country"
              label="Country"
              searchable
              search-by="name"
            />
          </template>
        </ValidationField>
      </section>

      <p :class="$style.info">
        To map this partner to the existing one in HIS, enter its ID here:
      </p>

      <InputText
        v-model.trim="partner.partnerIdentifier"
        :class="$style.inputPartnerId"
        label="Partner ID (optional)"
      />

      <section :class="$style.contact">
        <h4 :class="$style.title">Contact</h4>
        <template v-for="(partnerContact, idx) in partnerContacts">
          <div :key="partnerContact.id" :class="$style.row">
            <ValidationField
              :v="$v.partner.partnerContacts.$each.$iter[idx].title"
              :error-messages="errorMessagesTitle"
            >
              <template #default="{ isError, errorMessage }">
                <InputRadioGroup
                  v-model="partnerContact.title"
                  label="Title"
                  :options="partnerContactTitleOptions"
                  :message="errorMessage"
                  :error="isError"
                />
              </template>
            </ValidationField>
            <ValidationField
              :v="$v.partner.partnerContacts.$each.$iter[idx].firstName"
              :error-messages="errorMessagesFirstName"
            >
              <template #default="{ isError, errorMessage }">
                <InputText
                  v-model.trim="partnerContact.firstName"
                  :class="$style.inputName"
                  label="First name"
                  :error="isError"
                  :message="errorMessage"
                  @focus="
                    $v.partner.partnerContacts.$each.$iter[
                      idx
                    ].firstName.$reset()
                  "
                />
              </template>
            </ValidationField>
            <ValidationField
              :v="$v.partner.partnerContacts.$each.$iter[idx].lastName"
              :error-messages="errorMessagesLastName"
            >
              <template #default="{ isError, errorMessage }">
                <InputText
                  v-model.trim="partnerContact.lastName"
                  :class="$style.inputName"
                  label="Last name"
                  :error="isError"
                  :message="errorMessage"
                  @focus="
                    $v.partner.partnerContacts.$each.$iter[
                      idx
                    ].lastName.$reset()
                  "
                />
              </template>
            </ValidationField>

            <ValidationField
              :v="$v.partner.partnerContacts.$each.$iter[idx].email"
              :error-messages="errorMessagesEmail"
            >
              <template #default="{ isError, errorMessage }">
                <InputText
                  v-model.trim="partnerContact.email"
                  :class="$style.inputEmail"
                  label="Email"
                  :error="isError"
                  :message="errorMessage"
                  @focus="
                    $v.partner.partnerContacts.$each.$iter[idx].email.$reset()
                  "
                />
              </template>
            </ValidationField>
            <InputText
              v-model.trim="partnerContact.phoneNumber"
              :class="$style.inputPhone"
              label="Phone (optional)"
            />
            <div v-show="hasMultipleContacts" :class="$style.controls">
              <ButtonGhost
                v-if="!partnerContact.primary"
                tooltip-text="Set as primary contact"
                :class="$style.btnOval"
                oval
                @click="setPrimaryContact(partnerContact)"
              >
                <template #icon>
                  <IconFavoriteUnfilled />
                </template>
              </ButtonGhost>
              <IconFavoriteFilled
                v-else
                v-tooltip.bottom="{
                  content: 'Primary contact',
                  container: false
                }"
                :class="$style.primary"
              />
              <ButtonGhost
                tooltip-text="Delete contact"
                :class="$style.btnOval"
                :theme="ButtonTheme.Secondary"
                oval
                destructive
                @click="removeContact(partnerContact)"
              >
                <template #icon>
                  <IconDelete />
                </template>
              </ButtonGhost>
            </div>
          </div>
        </template>
        <ButtonGhost
          :class="$style.btnAdd"
          text="Add another contact"
          @click="addContact"
        >
          <template #icon>
            <IconAdd />
          </template>
        </ButtonGhost>
      </section>
    </div>
  </ActionModal>
</template>

<script>
  import { VTooltip } from 'v-tooltip';
  import { reject } from 'lodash';
  import ActionModal from 'components/modals/ActionModal';
  import { email, numeric, required } from 'vuelidate/lib/validators';
  import { errorMessagesFactory } from 'utils/validation';
  import InputText from '@/components/inputs/new/InputText';
  import ValidationField from '@/components/renderless/ValidationField';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import IconFavoriteFilled from '@/assets/images/icons/Misc/ic-24-favorite-active.svg';
  import IconFavoriteUnfilled from '@/assets/images/icons/Misc/ic-24-favorite-default.svg';
  import IconDelete from '@/assets/images/icons/Misc/ic-24-delete.svg';
  import IconAdd from '@/assets/images/icons/add-flat.svg';
  import { Partner } from '@/models/groups/Partner.model';
  import InputRadioGroup from '@/components/inputs/new/InputRadioGroup';
  import InputSelect from '@/components/inputs/new/InputSelect.vue';
  import { countries, countryOptions } from '@/constants/countries';
  import { ButtonTheme } from '@/enums/ButtonTheme.enum';

  export default {
    name: 'PartnerModal',
    components: {
      InputRadioGroup,
      ButtonGhost,
      ValidationField,
      InputText,
      ActionModal,
      IconAdd,
      IconFavoriteFilled,
      IconFavoriteUnfilled,
      IconDelete,
      InputSelect
    },

    directives: {
      tooltip: VTooltip
    },
    extends: ActionModal,

    props: {
      existingPartner: {
        type: Partner,
        default: null
      },

      isLoading: {
        type: Boolean,
        default: false
      },

      errors: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        InputText,
        partner: this.existingPartner
          ? this.existingPartner.duplicate()
          : Partner.default()
      };
    },

    computed: {
      ButtonTheme() {
        return ButtonTheme;
      },

      countryOptions() {
        return countryOptions;
      },

      hasMultipleContacts() {
        return this.partnerContacts.length > 1;
      },

      errorMessagesOrganization() {
        return errorMessagesFactory({
          required: 'Please enter the organization name',
          unique:
            'Partner with this name already exists, please enter a different name'
        });
      },
      errorMessagesAddress() {
        return errorMessagesFactory('required', 'Please enter the address');
      },
      errorMessagesPostcode() {
        return errorMessagesFactory({
          required: 'Please enter the postcode',
          numeric: 'Please enter a valid number'
        });
      },
      errorMessagesCity() {
        return errorMessagesFactory('required', 'Please enter the city');
      },
      errorMessagesCountry() {
        return errorMessagesFactory('required', 'Please enter the country');
      },

      errorMessagesTitle() {
        return errorMessagesFactory('required', 'Please select the title');
      },

      errorMessagesFirstName() {
        return errorMessagesFactory('required', 'Please enter the first name');
      },

      errorMessagesLastName() {
        return errorMessagesFactory('required', 'Please enter the last name');
      },

      errorMessagesEmail() {
        return errorMessagesFactory({
          required: 'Please enter an email address',
          email: 'Please enter a valid email address'
        });
      },

      partnerContacts() {
        return this.partner.partnerContacts;
      },

      partnerContactTitleOptions() {
        return [
          { label: 'Mr.', value: 'mr' },
          { label: 'Ms.', value: 'ms' }
        ];
      },

      selectedCountry: {
        get() {
          if (!this.partner.country) {
            return;
          }
          return countries[this.partner.country];
        },

        set(newCountry) {
          this.partner.country = newCountry.id;
        }
      }
    },

    methods: {
      onSubmit() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        this.$emit('submit', this.partner);
      },

      addContact() {
        this.partner.addContact();
      },

      removeContact(contact) {
        this.partner.removeContact(contact);
      },

      setPrimaryContact(contact) {
        this.partner.setPrimaryContact(contact);
      }
    },

    validations: {
      partner: {
        name: {
          required,
          unique(value) {
            return this.errors.name !== value;
          }
        },
        address: {
          required
        },
        postcode: {
          required,
          numeric
        },
        city: {
          required
        },
        country: {
          required
        },
        partnerContacts: {
          $each: {
            title: {
              required
            },
            firstName: {
              required
            },
            lastName: {
              required
            },
            email: {
              required,
              email
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .content {
    @include column;

    padding-top: 30px;
    padding-bottom: 40px;
  }

  .row {
    @include row;

    > * + * {
      margin-left: 16px;
    }
  }

  .grow {
    flex: 1;
  }

  .input-postcode {
    width: 140px;
  }

  .inputs {
    width: 400px;

    > * + * {
      margin-top: 30px;
    }
  }

  .input-partner-id {
    width: 240px;
  }

  .input-country {
    width: 280px;
  }

  .info {
    margin: 34px 0 20px;
  }

  .input-email {
    width: 256px;
  }

  .input-name {
    width: 200px;
  }

  .input-phone {
    width: 160px;
  }

  .contact {
    padding-top: 50px;

    .title {
      margin: 0 0 20px;
    }

    .row + .row {
      margin-top: 30px;
    }
  }

  .btn-oval {
    color: $color-text-main;
    width: 36px;
    height: 36px;

    align-self: flex-end;
  }

  .primary {
    color: $color-text-main;
    margin: 6px;
  }

  .btn-add {
    position: relative;
    left: -8px;
    margin-top: 26px;
  }

  .controls {
    @include row;

    align-self: flex-end;
    align-items: center;
  }
</style>
