<template>
  <div>
    <PinnedBaseFilter
      :filter-class="$style.filter"
      :label="filterSetLabel"
      :value="filterSetTitle"
    >
      <div :class="$style.dropdown">
        <div v-close-popover :class="$style.filterSets">
          <template v-if="filterSets.length">
            <DropdownList
              v-if="privateFilterSets.length"
              :class="$style.list"
              title="Private"
              :items="privateFilterSets"
              @select="onSelect"
            >
              <template #item="{ item, isHover }">
                <span
                  :class="[
                    $style.name,
                    { [$style.bold]: isEqual(item, activeFilterSet) }
                  ]"
                  >{{ item.name }}</span
                >
                <div :class="$style.icons">
                  <span
                    v-visible="isHover"
                    :class="[$style.icon, $style.iconOutline]"
                    @mousedown.stop="onEditClick(item)"
                  >
                    <!-- @svg("Analytics/edit") -->
                  </span>
                  <template v-if="isDefault(item)">
                    <span
                      v-visible="isDefault(item)"
                      :class="$style.icon"
                      @mousedown.stop="toggleDefaultFilterSet(item)"
                      @click.stop
                    >
                      <!-- @svg("Misc/favorite-active") -->
                    </span>
                  </template>
                  <template v-else>
                    <span
                      v-visible="isHover"
                      :class="[$style.icon, $style.iconOutline]"
                      @mousedown.stop="toggleDefaultFilterSet(item)"
                      @click.stop
                    >
                      <!-- @svg("Misc/favorite-default") -->
                    </span>
                  </template>
                </div>
              </template>
            </DropdownList>

            <DropdownList
              v-if="publicFilterSets.length"
              :class="$style.list"
              title="Public"
              :items="publicFilterSets"
              @select="onSelect"
            >
              <template #item="{ item, isHover }">
                <span
                  :class="[
                    $style.name,
                    { [$style.bold]: isEqual(item, activeFilterSet) }
                  ]"
                  >{{ item.name }}</span
                >
                <div :class="$style.icons">
                  <template v-if="item.owner">
                    <span
                      v-visible="isHover"
                      :class="[$style.icon, $style.iconOutline]"
                      @mousedown.stop="onEditClick(item)"
                    >
                      <!-- @svg("Analytics/edit") -->
                    </span>
                  </template>
                  <template v-if="isDefault(item)">
                    <span
                      v-visible="isDefault(item)"
                      :class="$style.icon"
                      @mousedown.stop="toggleDefaultFilterSet(item)"
                      @click.stop
                    >
                      <!-- @svg("Misc/favorite-active") -->
                    </span>
                  </template>
                  <template v-else>
                    <span
                      v-visible="isHover"
                      :class="[$style.icon, $style.iconOutline]"
                      @mousedown.stop="toggleDefaultFilterSet(item)"
                      @click.stop
                    >
                      <!-- @svg("Misc/favorite-default") -->
                    </span>
                  </template>
                </div>
              </template>
            </DropdownList>
          </template>
          <span v-else :class="$style.disclaimer"> No saved filter sets </span>
        </div>
        <ButtonCreateNew
          :class="$style.button"
          text="Save filter set"
          @click="openModal('createUserPreferenceModal')"
        />
      </div>
    </PinnedBaseFilter>
    <CreateUserPreferenceModal
      v-if="activeModal === 'createUserPreferenceModal'"
      :title="Boolean(filterSetEdit) ? 'Update filter set' : 'Save filter set'"
      placeholder="Filter set name"
      default-checkbox-label="Set as default filter set"
      public-checkbox-label="Make this filter set public"
      :preference="filterSetEdit"
      :show-delete="Boolean(filterSetEdit)"
      :is-loading="isFilterSetCreating || isFilterSetEditing"
      :errors="errors"
      @create="createFilterSet"
      @edit="editFilterSet"
      @close="closeModal"
      @delete="openModal('confirmDialog')"
    />
    <ConfirmDialog
      v-if="activeModal === 'confirmDialog'"
      title="Delete filter set"
      confirm-text="Delete"
      dismiss-text="Cancel"
      :is-destructive="true"
      :is-loading="isFilterSetDeleting"
      @confirm="deleteFilterSet"
      @dismiss="closeModal"
    >
      Are you sure you want to delete
      <span :class="$style.bold">{{ filterSetEdit.name }}</span> filter set?
    </ConfirmDialog>
  </div>
</template>

<script>
  import { VClosePopover } from 'v-tooltip';
  import DropdownList from 'components/core/DropdownList';
  import ButtonCreateNew from 'components/buttons/ButtonCreateNew';
  import CreateUserPreferenceModal from 'components/modals/CreateUserPreferenceModal';
  import ConfirmDialog from 'components/modals/ConfirmDialog';

  import { isEqual } from 'lodash';
  import PinnedBaseFilter from '@/components/filters/PinnedBaseFilter';

  export default {
    directives: {
      closePopover: VClosePopover
    },
    components: {
      PinnedBaseFilter,
      DropdownList,
      ButtonCreateNew,
      CreateUserPreferenceModal,
      ConfirmDialog
    },

    props: {
      filterSets: {
        type: Array,
        default: () => []
      },

      activeFilterSet: {
        type: Object,
        default: null
      },

      defaultFilterSet: {
        type: Object,
        default: null
      },

      onCreate: {
        type: Function,
        required: true
      },

      onEdit: {
        type: Function,
        required: true
      },

      onDelete: {
        type: Function,
        required: true
      }
    },

    data() {
      return {
        isOpen: false,
        isDisabled: false,
        activeModal: null,
        filterSetEdit: null,
        isFilterSetCreating: false,
        isFilterSetEditing: false,
        isFilterSetDeleting: false,
        errors: {}
      };
    },

    computed: {
      filterSetTitle() {
        return this.activeFilterSet ? this.activeFilterSet.name : '';
      },

      filterSetLabel() {
        return this.activeFilterSet ? '' : 'Custom filter set';
      },

      privateFilterSets() {
        return this.filterSets.filter(filter => !filter.public);
      },

      publicFilterSets() {
        return this.filterSets.filter(filter => filter.public);
      }
    },

    methods: {
      isEqual,

      isDefault(filterSet) {
        if (!this.defaultFilterSet) {
          return false;
        }

        return this.defaultFilterSet.id === filterSet.id;
      },

      openModal(modal) {
        this.activeModal = modal;
      },

      closeModal() {
        this.activeModal = null;
        this.filterSetEdit = null;
      },

      onDropdownOpen() {
        this.isOpen = true;
      },

      onDropdownClose() {
        this.isOpen = false;
      },

      onEditClick({ id, name, configuration, public: isPublic }) {
        this.filterSetEdit = {
          id,
          name,
          configuration,
          isPublic,
          isDefault: this.isDefault({ id })
        };

        this.openModal('createUserPreferenceModal');
      },

      onSelect(item) {
        this.$emit('select', item);

        this.onDropdownClose();
      },

      async createFilterSet({ name, isPublic, isDefault }) {
        this.isFilterSetCreating = true;

        this.errors = {};
        try {
          await this.onCreate({ name, isPublic, isDefault });

          this.closeModal();
        } catch (messages) {
          this.errors = { messages, data: { name } };
        } finally {
          this.isFilterSetCreating = false;
        }
      },

      async editFilterSet({ id, name, configuration, isPublic, isDefault }) {
        this.isFilterSetEditing = true;

        this.errors = {};
        try {
          await this.onEdit({ id, name, configuration, isPublic, isDefault });

          this.closeModal();
        } catch (messages) {
          this.errors = { messages, data: { name } };
        } finally {
          this.isFilterSetEditing = false;
        }
      },

      async deleteFilterSet() {
        this.isFilterSetDeleting = true;

        try {
          await this.onDelete(this.filterSetEdit);
        } catch (e) {
          // handle errors
        } finally {
          this.isFilterSetDeleting = false;
        }

        this.closeModal();
      },

      toggleDefaultFilterSet({ public: isPublic, ...filterSet }) {
        this.editFilterSet({
          ...filterSet,
          isDefault: !this.isDefault(filterSet),
          isPublic
        });
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .filter {
    @include hard-shadow($color-border-main-dark, 1px);

    background-color: transparent;
  }

  .dropdown {
    @include column;

    min-width: 240px;
    max-width: 545px;
    border-radius: $base-border-radius;

    max-height: 80vh;
    overflow-y: auto;

    background-color: $color-bg-light;
    box-shadow: $tooltip-shadow;
  }

  .name {
    color: $color-text-main;
    margin-right: 16px;
  }

  .list {
    margin-bottom: 18px;

    &:first-child {
      margin-top: 10px;
    }
  }

  .disclaimer {
    display: block;
    margin: auto;
    font-size: 14px;
    line-height: 20px;
    padding: 11px 0;
    margin-left: 19px;
    color: $color-text-main-light;
  }

  .icon {
    display: block;

    &:not(:first-child) {
      margin-left: 4px;
    }

    /* stylelint-disable selector-max-type */
    &-outline path {
      fill: $color-border-primary;
    }
  }

  .icons {
    @include row;
    align-items: center;
    margin-left: auto;
  }

  .filter-sets {
    @include column;

    border-bottom: 1px solid $color-border-main-light;
  }

  .button {
    flex-basis: 44px;
  }

  .bold {
    font-weight: bold;
  }
</style>
