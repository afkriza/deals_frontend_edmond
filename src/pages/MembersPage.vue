<template>
  <div :class="$style.page">
    <AppHeader>
      <Filters
        v-if="filters.length"
        hide-expanded-filters
        :max-number-of-pinned-filters="null"
        :filters="filters"
        @filter:update="updateFilter"
      />

      <ButtonOutline :class="$style.button" @click="openCreateMemberModal">
        Create member
      </ButtonOutline>
    </AppHeader>

    <AppLoader v-if="isLoading" loading-text="Loading members" />
    <template v-else>
      <template v-if="hasData">
        <MembersTable :members="members" :header-items="headerItems">
          <MemberItem
            v-for="(member, memberIndex) in members"
            :key="memberIndex"
            :class="$style.member"
            :is-property-filtered="hasActiveProperty"
            :member="member"
            @editMember:click="openEditMemberModal"
            @deleteMember:click="openDeleteMemberModal"
          />
          <IntersectionEmitter
            :key="members.length"
            :options="{
              rootMargin: '100px'
            }"
            @intersect="fetchNextMembersPage"
          />
          <LoadingView
            v-if="areMembersLazyLoading"
            loader-message="Loading members..."
            transparent
          />
        </MembersTable>
      </template>
      <AppEmptyState
        v-else
        :empty-state-icon="IconEmptyStateMembers"
        description="There are no results based on your filtering criteria."
        title="No results found"
      />
    </template>

    <MemberModal
      v-if="isCreateMemberModalOpen"
      title="Create member"
      :configuration="configuration"
      submit-button-text="Create"
      :submit="onCreateMemberSubmit"
      @close="closeCurrentOpenModal"
    />
    <MemberModal
      v-if="isEditMemberModalOpen"
      title="Edit member"
      :configuration="configuration"
      :member="activeMember"
      submit-button-text="Save"
      :submit="onEditMemberSubmit"
      @close="closeCurrentOpenModal"
    />
    <MemberModal
      v-if="isDeleteMemberModalOpen"
      title="Do you want to delete this member?"
      :member="activeMember"
      submit-button-text="Delete"
      destructive
      :submit="onDeleteMemberSubmit"
      @close="closeCurrentOpenModal"
    />
  </div>
</template>

<script>
  import { get, last, size } from 'lodash';

  import { mapActions } from 'vuex';

  import AppHeader from 'components/app/AppHeader';
  import ButtonOutline from 'components/buttons/ButtonOutline';
  import MemberItem from 'components/members/MemberItem';
  import MembersTable from 'components/members/MembersTable';
  import IntersectionEmitter from 'components/core/IntersectionEmitter';

  import { createHeaderItems } from 'utils/members';
  import { toastTypesEnum } from 'enums/toast-types';
  import { toastFactory } from 'utils/toast';
  import Filters from '@/components/filters/Filters';
  import createFiltersMixin from '@/mixins/filters.mixin';
  import AppEmptyState from '@/components/core/AppEmptyState.vue';
  import IconEmptyStateMembers from '@/assets/images/icons/empty-state-members.svg';
  import AppLoader from '@/components/app/AppLoader';

  import { membersModule } from '@/store';
  import LoadingView from '@/components/app/LoadingView';
  import MemberModal from '@/components/modals/MemberModal';

  const MemberModalEnum = {
    CreateMember: 'createMember',
    EditMember: 'editMember',
    DeleteMember: 'deleteMember'
  };

  import { propertiesModule } from '@/store';

  export default {
    components: {
      MemberModal,
      LoadingView,
      AppLoader,
      Filters,
      ButtonOutline,
      MemberItem,
      MembersTable,
      IntersectionEmitter,
      AppHeader,
      AppEmptyState
    },

    mixins: [createFiltersMixin('members')],

    data() {
      const tableLabels = ['Member', 'Role', 'Properties & reports', ''];

      return {
        activeMember: null,
        currentOpenModal: '',
        headerItems: createHeaderItems(tableLabels),
        isLoading: false,
        areMembersLazyLoading: false
      };
    },

    computed: {
      isCreateMemberModalOpen() {
        return this.currentOpenModal === MemberModalEnum.CreateMember;
      },

      isEditMemberModalOpen() {
        return this.currentOpenModal === MemberModalEnum.EditMember;
      },

      isDeleteMemberModalOpen() {
        return this.currentOpenModal === MemberModalEnum.DeleteMember;
      },

      configuration() {
        return membersModule.configuration;
      },

      members() {
        return membersModule.members;
      },

      areMembersFullyLoaded() {
        return membersModule.areMembersFullyLoaded;
      },

      hasActiveProperty() {
        return Boolean(this.activePropertyId);
      },

      activePropertyId() {
        return get(
          membersModule.filters.filtersById.property,
          'value.id',
          null
        );
      },

      hasData() {
        return Boolean(size(this.members));
      },

      IconEmptyStateMembers() {
        return IconEmptyStateMembers;
      }
    },

    watch: {
      filters() {
        return this.loadMembers();
      }
    },

    created() {
      return Promise.all([
        membersModule.loadConfiguration(),
        this.initializeFilters()
      ]);
    },

    methods: {
      async fetchNextMembersPage() {
        if (this.areMembersFullyLoaded) {
          return;
        }

        try {
          this.areMembersLazyLoading = true;

          const membersDto = await membersModule.fetchMembers({
            filter: this.filtersQuery,
            created_after: last(this.members).createdAt
          });

          membersModule.ADD_MEMBERS(membersDto);
        } catch (e) {
          this.updateToast(
            toastFactory('Failed to fetch members', toastTypesEnum.DELETE)
          );
        } finally {
          this.areMembersLazyLoading = false;
        }
      },

      openCreateMemberModal() {
        this.openModal(MemberModalEnum.CreateMember);
      },

      openEditMemberModal(member) {
        this.activeMember = member;
        this.openModal(MemberModalEnum.EditMember);
      },

      openDeleteMemberModal(member) {
        this.activeMember = member;
        this.openModal(MemberModalEnum.DeleteMember);
      },

      openModal(modal) {
        this.currentOpenModal = modal;
      },

      closeCurrentOpenModal() {
        this.currentOpenModal = '';
      },

      async onCreateMemberSubmit(member) {
        try {
          await membersModule.createMember(member);

          this.closeCurrentOpenModal();

          this.updateToast(
            toastFactory(
              `Created member&nbsp; <strong>${member.firstName} ${member.lastName}</strong>`,
              toastTypesEnum.SUCCESS
            )
          );

          await this.refreshFilters();

          return this.loadMembers();
        } catch (e) {
          if (e.email) {
            throw e;
          }
          this.updateToast(
            toastFactory(
              `Failed to create member&nbsp; <strong>${member.firstName} ${member.lastName}</strong>`,
              toastTypesEnum.DELETE
            )
          );
        }
      },

      async onEditMemberSubmit(newMember) {
        const oldMember = this.activeMember;

        try {
          await membersModule.editMember({ newMember, oldMember });

          this.closeCurrentOpenModal();
          const toast = toastFactory(
            `Updated member&nbsp;<strong>${newMember.firstName} ${newMember.lastName}</strong>`,
            toastTypesEnum.SUCCESS
          );

          this.updateToast(toast);

          await this.refreshFilters();

          return this.loadMembers();
        } catch (e) {
          this.updateToast(
            toastFactory(
              `Failed to update member&nbsp; <strong>${oldMember.firstName} ${oldMember.lastName}</strong>`,
              toastTypesEnum.DELETE
            )
          );
        }
      },

      async onDeleteMemberSubmit(member) {
        try {
          await membersModule.deleteMember(member);

          this.closeCurrentOpenModal();
          this.updateToast(
            toastFactory(
              `Deleted&nbsp; <strong>${member.name}</strong>`,
              toastTypesEnum.DELETE
            )
          );

          return this.refreshFilters();
        } catch (e) {
          this.updateToast(
            toastFactory(
              `Failed to delete&nbsp; <strong>${member.name}</strong>`,
              toastTypesEnum.DELETE
            )
          );
        }
      },

      async loadMembers() {
        this.isLoading = true;

        try {
          const membersDto = await membersModule.fetchMembers({
            filter: this.filtersQuery
          });

          membersModule.SET_MEMBERS(membersDto);
        } catch (e) {
          this.updateToast(
            toastFactory('Failed to load members', toastTypesEnum.DELETE)
          );
        } finally {
          this.isLoading = false;
        }
      },

      ...mapActions(['updateToast'])
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .page {
    @include column;
    min-height: 0;

    height: 100vh;
  }

  .button {
    width: 144px;
    height: 32px;
    margin: 0 24px 0 auto;
  }

  .member {
    padding-right: 40px;
    padding-left: 20px;

    &:nth-child(even) {
      background-color: $color-bg-main-dimmed;
    }

    &:hover {
      background-color: $color-bg-primary-dimmed;
    }

    .intersection {
      margin-bottom: $action-footer-height;
    }
  }
</style>
