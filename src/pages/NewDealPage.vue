<template>
  <div :class="$style.page">
    <GroupsHeader :class="$style.header" title="New deal" @close="onCancel" />
    <form v-if="deal" :class="$style.form" @submit.prevent="onSubmit">
      <NewInquirySection :class="$style.section" title="Partner">
        <template #icon>
          <IconPartner />
        </template>
        <template #description>
          <p :class="$style.description">
            Search your existing partners or create a new one.
          </p>
        </template>
        <template>
          <ValidationField
            :v="$v.deal.partner"
            :error-messages="{ required: 'Please select a partner' }"
          >
            <template #default="{ isError, errorMessage }">
              <CardPartner
                v-model="deal.partner"
                :class="$style.card"
                :partners="searchedPartners"
                :error="isError"
                :error-message="errorMessage"
                :is-loading="loadingPartners"
                @partner:change="onPartnerChange"
                @partner:add="isPartnerModalOpen = true"
                @partner:search="onPartnerSearch"
                @validation:reset="$v.deal.partner.$reset()"
              />
            </template>
          </ValidationField>
        </template>
      </NewInquirySection>
      <hr :class="$style.solid" />
      <div :class="$style.groups">
        <div
          v-for="(group, idx) in deal.groups"
          :key="group.id"
          :class="[
            $style.wrapper,
            { [$style.active]: hoveredGroupId === group.id }
          ]"
        >
          <div
            @mouseover="hoveredGroupId = group.id"
            @mouseleave="resetHoveredGroup"
          ></div>
          <NewInquirySection
            :class="$style.section"
            :title="group.name"
            :active="hoveredGroupId === group.id"
            @mouseover.native.self="hoveredGroupId = group.id"
            @mouseleave.native.self="resetHoveredGroup"
          >
            <template #icon>
              <IconGroup />
            </template>
            <template v-if="hoveredGroupId === group.id" #actions>
              <ButtonGhost
                v-tooltip="'Duplicate groups'"
                type="button"
                oval
                @click="duplicateGroup(group)"
              >
                <template #icon>
                  <IconCopy />
                </template>
              </ButtonGhost>
              <ButtonGhost
                v-if="numberOfGroups > 1"
                v-tooltip="'Delete group'"
                type="button"
                destructive
                oval
                @click="deleteGroup(group)"
              >
                <template #icon>
                  <IconTrash />
                </template>
              </ButtonGhost>
            </template>
            <template v-if="idx === 0" #description>
              <p :class="$style.description">
                You can define multiple alternatives for one group.
                <br />
                <br />
                Create multiple groups for a serial deal.
              </p>
            </template>
            <template v-if="idx === numberOfGroups - 1" #additional>
              <ButtonGhost
                :class="$style.addGroup"
                text="Add group"
                type="button"
                @click="addGroup"
              >
                <template #icon>
                  <IconAddFlat />
                </template>
              </ButtonGhost>
            </template>
            <template>
              <CardGroup
                :class="$style.card"
                :group="group"
                :properties="properties"
                :room-types="roomTypes"
                :packages="packages"
                @alternative:add="addAlternative(group)"
                @mousemove.native="resetHoveredGroup"
              >
                <template #alternative="{ alternative, alternativeIdx }">
                  <AddAlternativeForm
                    v-if="editGroupAlternativeId === alternative.id"
                    :key="alternative.id"
                    :class="$style.alternativeForm"
                    :properties="properties"
                    :room-types="roomTypes"
                    :packages="packages"
                    :alternative="alternative"
                    :v="
                      $v.deal.groups.$each.$iter[idx].groupAlternatives.$each
                        .$iter[alternativeIdx]
                    "
                    :show-cancel="
                      alternative.saved ||
                      !(numberOfGroups === 1 && group.size === 1)
                    "
                    @save="onAlternativeSave(alternative)"
                    @cancel="onAlternativeCancel(group, alternative)"
                  />
                  <AlternativeView
                    v-else
                    :key="alternative.id"
                    :class="$style.alternativeView"
                    :properties="properties"
                    :room-types="roomTypes"
                    :packages="packages"
                    :alternative="alternative"
                    :show-delete="
                      !(idx === 0 && numberOfGroups === 1 && group.size === 1)
                    "
                    @duplicate="duplicateAlternative(group, alternative)"
                    @delete="deleteAlternative(group, alternative)"
                    @edit="onAlternativeViewClick(alternative)"
                  />
                </template>
              </CardGroup>
            </template>
          </NewInquirySection>
          <div
            @mouseover="hoveredGroupId = group.id"
            @mouseleave="resetHoveredGroup"
          ></div>
        </div>
      </div>
      <hr :class="$style.solid" />
      <NewInquirySection :class="$style.section" title="Budget">
        <template #icon>
          <IconBudget />
        </template>
        <template #description>
          <p :class="$style.description">
            Main budget for rooms and services. Put additional expenses into
            ancillary expenses.
          </p>
        </template>
        <template>
          <CardBudget
            :class="$style.card"
            :budget.sync="deal.budget"
            :ancillary.sync="deal.otherExpenses"
          />
        </template>
      </NewInquirySection>
      <template v-if="isCurrentUserAssignedMultipleSalesDepartments">
        <hr :class="$style.solid" />
        <NewInquirySection :class="$style.section" title="Department">
          <template #icon>
            <IconBudget />
          </template>
          <template #description>
            <p :class="$style.description">
              Select the department for which you are creating the deal.
            </p>
          </template>
          <template>
            <CardDepartment
              :class="$style.card"
              :department.sync="deal.department"
              :departments="salesDepartments"
              :v="$v"
            />
          </template>
        </NewInquirySection>
      </template>
      <hr :class="$style.solid" />
      <NewInquirySection :class="$style.section" title="Details">
        <template #icon>
          <IconNote />
        </template>
        <template #description>
          <p :class="$style.description">
            Add a note for the revenue managers. Choose to prioritize this deal
            for it to appear on top of the revenue manager’s list.
          </p>
        </template>
        <template>
          <CardDetails
            :class="$style.card"
            :name.sync="deal.name"
            :note.sync="deal.note"
            :priority.sync="deal.priority"
            :v="$v"
          />
        </template>
      </NewInquirySection>
      <div :class="$style.buttons">
        <ButtonFlat type="button" @click="onCancel">Cancel</ButtonFlat>
        <ButtonRegular :is-loading="isDealLoading">Submit deal</ButtonRegular>
      </div>
    </form>
    <PartnerModal
      v-if="isPartnerModalOpen"
      :errors="partnerErrors"
      :is-loading="isPartnerLoading"
      @submit="onPartnerSubmit"
      @close="onPartnerModalClose"
    />
    <ConfirmDialog
      v-if="isDiscardDealModalOpen"
      title="Discard deal?"
      confirm-text="Discard"
      dismiss-text="Cancel"
      is-destructive
      :size="modalSizesEnum.SMALL"
      @confirm="redirectToDeals"
      @dismiss="closeDiscardDealModal"
    >
      Are you sure you want to discard the changes you made?
    </ConfirmDialog>
  </div>
</template>

<script>
  import { first, throttle, debounce, cloneDeep, isEqual, size } from 'lodash';
  import { mapGetters } from 'vuex';

  import { required, requiredIf } from 'vuelidate/lib/validators';

  import { navigate } from '@/utils/navigation';
  import { pages } from '@/enums/pages';

  import Deal from '@/components/groups/new-inquiry/models/Deal.model';

  import ButtonFlat from 'components/buttons/ButtonFlat';
  import ButtonRegular from 'components/buttons/ButtonRegular';
  import NewInquirySection from '@/components/groups/new-inquiry/NewInquirySection';

  import IconPartner from '@/assets/images/icons/Deals/partner.svg';
  import IconGroup from '@/assets/images/icons/Deals/group.svg';
  import IconAddFlat from '@/assets/images/icons/add-flat.svg';
  import IconBudget from '@/assets/images/icons/groups/new-inquiry/budget.svg';
  import IconNote from '@/assets/images/icons/groups/new-inquiry/note-2px.svg';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import PartnerModal from '@/components/modals/PartnerModal';
  import CardPartner from '@/components/groups/new-inquiry/CardPartner';
  import CardBudget from '@/components/groups/new-inquiry/CardBudget';
  import CardDetails from '@/components/groups/new-inquiry/CardDetails';
  import CardGroup from '@/components/groups/new-inquiry/CardGroup';
  import IconCopy from '@/assets/images/icons/Misc/ic-24-copy.svg';
  import IconTrash from '@/assets/images/icons/trash.svg';
  import ValidationField from '@/components/renderless/ValidationField';
  import AddAlternativeForm from '@/components/groups/new-inquiry/AddAlternativeForm';
  import AlternativeView from '@/components/groups/new-inquiry/AlternativeView';
  import GroupsHeader from '@/components/groups/core/GroupsHeader';
  import { VTooltip } from 'v-tooltip';
  import { groupsModule } from '@/store';
  import ConfirmDialog from '@/components/modals/ConfirmDialog';
  import { modalSizesEnum } from '@/enums/modal-sizes';
  import { isBefore } from 'date-fns';
  import { resolveLatest } from '@/utils/function';
  import CardDepartment from '@/components/groups/new-inquiry/CardDepartment';
  import { Role } from '@/enums/Role.enum';

  export default {
    name: 'NewDealPage',
    components: {
      CardDepartment,
      ConfirmDialog,
      GroupsHeader,
      AlternativeView,
      AddAlternativeForm,
      ValidationField,
      CardGroup,
      CardDetails,
      CardBudget,
      CardPartner,
      PartnerModal,
      ButtonGhost,
      IconPartner,
      IconBudget,
      IconNote,
      NewInquirySection,
      ButtonFlat,
      ButtonRegular,
      IconGroup,
      IconAddFlat,
      IconCopy,
      IconTrash
    },
    directives: { tooltip: VTooltip },

    data() {
      return {
        searchedPartners: null,
        deal: null,
        editGroupAlternativeId: null,
        isPartnerModalOpen: false,
        hoveredGroupId: null,
        partnerErrors: { name: '' },
        isPartnerLoading: false,
        isDealLoading: false,
        isDiscardDealModalOpen: false,
        dealSnapshot: null,
        loadingPartners: false
      };
    },
    computed: {
      modalSizesEnum() {
        return modalSizesEnum;
      },

      properties() {
        return groupsModule.properties;
      },

      roomTypes() {
        return groupsModule.roomTypes;
      },

      packages() {
        return groupsModule.packages;
      },

      partners() {
        return groupsModule.partners;
      },

      salesDepartments() {
        return groupsModule.salesDepartments;
      },

      numberOfGroups() {
        return this.deal.size;
      },

      areGroupsInvalid() {
        return this.$v.deal.groups.$invalid;
      },

      defaultRoomTypeAndPackages() {
        return {
          roomType: first(this.roomTypes),
          packages: []
        };
      },

      defaultSalesDepartment() {
        return {
          department: this.isCurrentUserAssignedMultipleSalesDepartments
            ? null
            : first(this.currentUser.salesDepartments)
        };
      },

      isDealFormDirty() {
        return !isEqual(this.dealSnapshot, this.deal);
      },

      isCurrentUserAssignedMultipleSalesDepartments() {
        return (
          this.currentUser.role.id === Role.Admin ||
          size(this.currentUser.salesDepartments) !== 1
        );
      },

      ...mapGetters(['currentUser'])
    },

    methods: {
      async onSubmit() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        this.editGroupAlternativeId = null;

        this.isDealLoading = true;
        try {
          const deal = await groupsModule.createDeal(this.deal);

          await navigate(this.$router, {
            name: pages.DEAL,
            params: { dealId: deal.id }
          });
        } finally {
          this.isDealLoading = false;
        }
      },

      redirectToDeals() {
        navigate(this.$router, {
          name: pages.DEALS
        });
      },

      triggerGroupsValidation() {
        this.$v.deal.groups.$touch();
      },

      onCancel() {
        if (this.isDealFormDirty) {
          return this.openDiscardDealModal();
        }

        this.redirectToDeals();
      },

      openDiscardDealModal() {
        this.isDiscardDealModalOpen = true;
      },

      closeDiscardDealModal() {
        this.isDiscardDealModalOpen = false;
      },

      async onPartnerSubmit(partner) {
        this.isPartnerLoading = true;
        this.partnerErrors.name = '';

        try {
          this.deal.partner = await groupsModule.createPartner(partner);

          this.isPartnerModalOpen = false;
        } catch (e) {
          this.partnerErrors.name = partner.name;
        } finally {
          this.isPartnerLoading = false;
        }
      },

      onPartnerModalClose() {
        this.isPartnerModalOpen = false;
      },

      onPartnerChange() {
        this.deal.partner = null;
        this.searchedPartners = this.partners;

        // TODO: focus partner input
      },

      onPartnerSearch: debounce(async function (pattern) {
        if (!pattern && !this.loadingPartners) {
          this.searchedPartners = this.partners;
          return;
        }
        this.searchPartners(pattern);
      }, 300),

      async searchPartners(pattern) {
        try {
          this.loadingPartners = true;
          this.searchedPartners = await this.latestPartners(pattern);
          this.loadingPartners = false;
        } catch (e) {
          if (e !== 'stale') {
            throw e;
          }
        }
      },

      resetHoveredGroup: throttle(function () {
        this.hoveredGroupId = null;
      }, 0),

      addGroup() {
        this.triggerGroupsValidation();

        if (this.areGroupsInvalid) {
          return;
        }

        const group = this.deal.addDefaultGroup(
          this.defaultRoomTypeAndPackages
        );

        this.editGroupAlternativeId = first(group.groupAlternatives).id;
      },

      duplicateGroup(group) {
        this.triggerGroupsValidation();

        if (this.areGroupsInvalid) {
          return;
        }

        this.deal.duplicateGroup(group);

        this.editGroupAlternativeId = null;
      },

      deleteGroup(group) {
        this.deal.deleteGroup(group);
      },

      addAlternative(group) {
        this.triggerGroupsValidation();

        if (this.areGroupsInvalid) {
          return;
        }

        const groupAlternative = group.addDefaultAlternative(
          this.defaultRoomTypeAndPackages
        );

        this.editGroupAlternativeId = groupAlternative.id;
      },

      duplicateAlternative(group, alternative) {
        group.duplicateAlternative(alternative);
      },

      deleteAlternative(group, alternative) {
        group.deleteAlternative(alternative);

        if (group.size === 0) {
          this.deal.deleteGroup(group);
        }
      },

      onAlternativeSave(alternative) {
        alternative.save();

        this.editGroupAlternativeId = null;
      },

      onAlternativeCancel(group, alternative) {
        if (!alternative.saved) {
          group.deleteAlternative(alternative);

          if (group.size === 0) {
            this.deal.deleteGroup(group);
          }
        }

        this.editGroupAlternativeId = null;
      },

      onAlternativeViewClick(alternative) {
        this.triggerGroupsValidation();

        if (this.areGroupsInvalid) {
          return;
        }

        this.editGroupAlternativeId = alternative.id;
      }
    },

    validations: {
      deal: {
        partner: {
          required
        },
        groups: {
          $each: {
            groupAlternatives: {
              $each: {
                dateRange: {
                  from: {
                    required,
                    presentOrFuture(date) {
                      return !isBefore(date, Date.now());
                    }
                  },
                  to: {
                    required,
                    presentOrFuture(date) {
                      return !isBefore(date, Date.now());
                    }
                  }
                }
              }
            }
          }
        },
        department: {
          required: requiredIf(function () {
            return this.isCurrentUserAssignedMultipleSalesDepartments;
          })
        },
        name: {
          required
        }
      }
    },

    async created() {
      if (!groupsModule.isConfigurationLoaded) {
        await groupsModule.fetchConfiguration();
      }

      if (!groupsModule.partners) {
        await groupsModule.loadPartners();
      }

      this.deal = Deal.default({
        ...this.defaultRoomTypeAndPackages,
        ...this.defaultSalesDepartment
      });

      this.dealSnapshot = cloneDeep(this.deal);

      this.editGroupAlternativeId = this.deal.groups[0].groupAlternatives[0].id;
      this.searchedPartners = this.partners;

      this.latestPartners = resolveLatest(groupsModule.fetchPartners);
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;

    background-color: $color-bg-main-dimmed;
  }

  .header {
    position: sticky;
    top: 0;
    height: 60px;
    z-index: 1;
  }

  .form {
    margin-top: 16px;

    flex: 1;

    display: grid;
    grid-template-columns: minmax(32px, 120px) auto 1fr;
    grid-template-rows: repeat(7, auto) 1fr;
  }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 120px) auto 1fr;
  }

  .groups {
    grid-column-start: 1;
    grid-column-end: 4;

    display: grid;
    grid-template-columns: minmax(0, 120px) auto 1fr;
  }

  .wrapper {
    display: contents;

    > div:first-child {
      grid-column-start: 1;
    }
  }
  .wrapper.active > * {
    background-color: $color-bg-primary-dimmed;
  }

  .section {
    padding: 24px 24px 24px 0;
    grid-column-start: 2;
  }

  hr.solid {
    grid-column-start: 2;
    border: none;
    border-top: 1px solid $color-border-main-light;
    margin: 12px 24px 12px 0;
  }

  .card {
    width: 1035px;
  }

  .add-alternative {
    display: flex;
    align-self: flex-end;
    flex: 1;

    height: 72px;

    &-btn {
      flex: 1;
      justify-content: flex-start;
      border: none !important;
      border-radius: 0;
      padding: 24px 40px;
    }
  }

  .add-group {
    position: relative;
    left: -12px;
    margin-top: auto;
    align-self: flex-start;
  }

  .textarea {
    width: 336px;
    height: 108px;
  }

  .description {
    margin: 0;
  }

  .alternative-view {
    min-height: 145px;

    padding: 32px 40px;

    border-bottom: 1px solid $color-border-main-light;
  }

  .alternative-form {
    padding: 28px 40px 32px;

    border-bottom: 1px solid $color-border-main-light;
  }

  .buttons {
    @include row;
    grid-column-start: 2;

    align-items: flex-end;
    justify-content: flex-end;

    margin-bottom: 40px;

    padding-right: 24px;

    button {
      width: 176px;
      height: 48px;
    }

    button + button {
      margin-left: 16px;
    }
  }
</style>
