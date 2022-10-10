<template>
  <div ref="wrapper" :class="$style.pageWrapper">
    <Filters
      v-show="!(filters.length === 0 || fullscreen)"
      :class="$style.filters"
      :filters="filters"
      :fetch-options="fetchOptions"
      :toggle-filter-pin="togglePin"
      @filter:update="updateFilter"
      @filterSet:select="onFilterSetSelect"
      @expanded-filters:open="onExpandedFilterOpen"
      @expanded-filters:close="onExpandedFilterClose"
    >
      <template #filterSets>
        <FilterSet
          :filter-sets="filterSets"
          :active-filter-set="activeFilterSet"
          :default-filter-set="defaultFilterSet"
          :on-create="onFilterSetCreate"
          :on-edit="onFilterSetEdit"
          :on-delete="onFilterSetDelete"
          @select="onFilterSetSelect"
        />
      </template>
    </Filters>
    <section :class="[$style.wrapper, isEditMode && $style.editWrapper]">
      <DashboardHeader
        :class="$style.dashboardHeader"
        :dashboard="dashboard"
        :display-density="displayDensity"
        :errors="errors"
        :is-default="isDefault"
        :is-edit-mode="isEditMode"
        :name="name"
        :readonly="readonly"
        :v="$v.name"
        @default:toggle="onDefaultToggleClick"
        @displayDensity:click="onDisplayDensityClick"
        @edit="openEditMode"
        @name:input="onNameInput"
        @public:toggle="onPublicToggleClick"
      />

      <WidgetGrid
        v-if="filtersSettled && layout && layout.length"
        :calculations="widgetCalculations"
        :configurations="widgetConfigurations"
        :current-open-dropdown="currentOpenDropdown"
        :display-density="displayDensity"
        :has-multiple-dashboards="Boolean(otherDashboards.length)"
        :is-active="isEditMode"
        :layout="layout"
        :namespace="namespace"
        :scroll="addedNewWidget && !hasScrolled"
        :readonly="readonly"
        :widgets="widgets"
        :filters="filtersQuery"
        :expanded-filter-active="expandedFilterActive"
        :current-user="currentUser"
        @dropdown:close="closeDropdown"
        @dropdown:open="openDropdown"
        @layout:ready="onLayoutReady"
        @widget:convert="onConvertWidgetClick"
        @widget:copy="onCopyWidgetClick"
        @widget:delete="onDeleteWidgetClick"
        @widget:duplicate="onDuplicateWidgetClick"
        @widget:edit="redirectToWidget"
        @widget:export="onExportWidgetClick"
        @scroll="hasScrolled = true"
      />

      <Fab
        v-show="!readonly && !isEditMode && !isCreateNewWidgetModalOpen"
        @click="onCreateNewWidgetClick"
      />

      <footer v-if="isEditMode" :class="$style.toolbar">
        <ButtonOutline
          :theme="ButtonTheme.Secondary"
          @click="onDeleteDashboardClick"
          >Delete dashboard view</ButtonOutline
        >
        <ButtonOutline @click="onEditCancelClick">Cancel</ButtonOutline>
        <ButtonRegular @click="onEditSaveClick">Save</ButtonRegular>
      </footer>

      <ActionModal
        v-if="isCopyWidgetModalOpen"
        :is-loading="isCopying"
        submit-button-text="Copy"
        title="Copy widget to..."
        @close="onCopyWidgetPromptClose"
        @submit="onCopyWidgetPromptSubmit"
      >
        <MaterialDropdown
          :class="$style.copyWidgetDropdown"
          :is-open="currentOpenDropdown === 'copyWidget'"
          :items="otherDashboards"
          :value="copyWidgetDashboardValue && copyWidgetDashboardValue.name"
          label="Select dashboard"
          @close="closeDropdown"
          @item:click="onCopyWidgetItemClick"
          @open="openDropdown('copyWidget')"
        />
      </ActionModal>

      <ConfirmDialog
        v-if="hasUnsavedChangesPrompt"
        :is-loading="isLoading"
        :o-btn="$style.oBtn"
        :size="modalSizes.DEFAULT"
        confirm-text="Discard changes"
        dismiss-text="Continue editing"
        title="Unsaved Changes"
        @confirm="onUnsavedChangesPromptSubmit"
        @dismiss="onUnsavedChangesPromptClose"
      >
        You have unsaved changes that will be lost.
      </ConfirmDialog>

      <ConfirmDialog
        v-if="hasDestructivePrompt"
        :is-destructive="true"
        :is-loading="isDeleting"
        :o-btn="$style.oBtn"
        :size="modalSizes.DEFAULT"
        :title="deletePromptTitle"
        confirm-text="Delete"
        dismiss-text="Cancel"
        @confirm="onDeletePromptSubmit"
        @dismiss="onDeletePromptClose"
      >
        <template v-if="isDeleteDashboardModalOpen"
          >Deleting a dashboard view will permanently remove it. If the
          dashboard is public, all members will lose access to it. This action
          cannot be undone.
        </template>
        <template v-else
          >Deleting a widget will permanently remove it from your dashboard.
          This action cannot be undone.
        </template>
      </ConfirmDialog>

      <SelectGraphModal
        v-if="isCreateNewWidgetModalOpen || isSelectGraphModalOpen"
        :title="isCreateNewWidgetModalOpen ? 'Create new widget' : 'Convert to'"
        :graph-type="isSelectGraphModalOpen ? activeGraphType : ''"
        @submit="
          isCreateNewWidgetModalOpen
            ? onWidgetTypeSelect($event)
            : onSelectCurrentGraphSubmit($event)
        "
        @close="
          isCreateNewWidgetModalOpen
            ? onCloseCreateNewWidget()
            : onCloseSelectGraphModal()
        "
      />

      <div
        v-if="!isLoadingDashboard && (!widgets || !widgets.length)"
        :class="$style.placeholder"
      >
        <!-- @svg("emptystate-analytics") -->
        <p :class="$style.disclaimer">
          Click on the plus button to start adding<br />widgets to your
          dashboard.
        </p>
      </div>
    </section>
    <BaseModal
      v-if="isWidgetModalOpen"
      :fullscreen="true"
      height="100vh"
      width="100vw"
    >
      <WidgetPage
        :dashboard-id="id"
        :representation="representation"
        :widget-id="widgetId"
        @widget:edit="onEditWidget"
        @widget:add="onAddNewWidget"
        @widget:close="closeWidgetModal"
      />
    </BaseModal>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
  import { cloneDeep, isEqual, keyBy } from 'lodash';

  import * as mutationTypes from 'store/mutation-types';
  import dashboardModals from 'enums/dashboard-modals';
  import tableDisplayDensities from 'enums/table-display-densities';
  import { widgetRepresentations } from 'enums/widget-representations';
  import { pages } from 'enums/pages';
  import { modalSizesEnum } from 'enums/modal-sizes';
  import { toastTypesEnum } from 'enums/toast-types';
  import { toastFactory } from 'utils/toast';
  import { ANALYTICS } from 'constants/namespaces';
  import { maxLength, required } from 'vuelidate/lib/validators';
  import { toSnakeCase } from 'utils/string';

  import DashboardHeader from 'components/dashboard/Header';
  import Fab from 'components/core/Fab';
  import MaterialDropdown from 'components/app/MaterialDropdown';
  import WidgetGrid from 'components/dashboard/WidgetGrid';
  import ButtonOutline from 'components/buttons/ButtonOutline';
  import ButtonFlat from 'components/buttons/ButtonFlat';
  import WidgetPage from 'pages/WidgetPage';
  import BaseModal from 'components/modals/BaseModal';

  import ConfirmDialog from 'components/modals/ConfirmDialog';
  import ActionModal from 'components/modals/ActionModal';
  import SelectGraphModal from 'components/dashboard/SelectGraphModal';

  import namespacedMixin from 'mixins/namespaced';

  import DashboardCofigurationModel from 'components/analytics/models/DashboardConfiguration.js';
  import { navigate } from '@/utils/navigation';
  import Filters from '@/components/filters/Filters';
  import FilterSet from '@/components/filters/FilterSet';
  import ButtonRegular from '@/components/buttons/ButtonRegular';

  import { ButtonTheme } from '@/enums/ButtonTheme.enum';

  export default {
    components: {
      ButtonRegular,
      FilterSet,
      Filters,
      DashboardHeader,
      Fab,
      MaterialDropdown,
      WidgetGrid,
      ConfirmDialog,
      ActionModal,
      SelectGraphModal,
      ButtonOutline,
      WidgetPage,
      BaseModal
    },
    mixins: [namespacedMixin],

    props: {
      addedNewWidget: {
        type: Boolean
      }
    },

    data() {
      return {
        ButtonFlat,
        expanded: false,
        id: this.$route.params.id,
        activeGraphModalWidgetID: null,
        copyWidgetDashboardValue: null,
        copyingWidgetItemID: null,
        deletingItemID: null,
        isEditMode: false,
        initialLayout: [],
        currentOpenDropdown: '',
        currentOpenModal: '',
        hasUnsavedChangesPrompt: false,
        layout: [],
        modals: dashboardModals,
        modalSizes: modalSizesEnum,
        initialName: '',
        name: '',
        errors: {},
        showCreateNewWidgetMenu: false,
        hasScrolled: false,
        filtersSettled: false,
        expandedFilterActive: false,
        isWidgetModalOpen: false,
        representation: widgetRepresentations.TABLE.id,
        widgetId: null,
        widgets: null,
        isLoadingDashboard: true,
        isDeleting: false,
        isCopying: false
      };
    },

    computed: {
      ButtonTheme() {
        return ButtonTheme;
      },

      defaultDashboard() {
        return this.namespace === ANALYTICS
          ? this.currentUser.defaultAnalyticsDashboard
          : this.currentUser.defaultRateShopperDashboard;
      },

      isDefault() {
        return this.defaultDashboard
          ? this.dashboard.id === this.defaultDashboard.id
          : false;
      },

      widgetsById() {
        return keyBy(this.widgets, 'id');
      },

      activeGraphType() {
        return this.widgetsById[this.activeGraphModalWidgetID].representation;
      },

      deletePromptTitle() {
        return this.isDeleteDashboardModalOpen
          ? 'Delete dashboard view'
          : 'Delete widget';
      },

      isSelectGraphModalOpen() {
        return this.currentOpenModal === 'graphModal';
      },

      isCreateNewWidgetModalOpen() {
        return this.currentOpenModal === 'createNewWidget';
      },

      displayDensity() {
        return this.dashboard && this.dashboard.displayDensity
          ? this.dashboard.displayDensity
          : tableDisplayDensities.DEFAULT;
      },

      hasDestructivePrompt() {
        return this.isDeleteDashboardModalOpen || this.isDeleteWidgetModalOpen;
      },

      isDeleteDashboardModalOpen() {
        return this.currentOpenModal === this.modals.DASHBOARD_DELETE;
      },

      isDeleteWidgetModalOpen() {
        return this.currentOpenModal === this.modals.WIDGET_DELETE;
      },

      isCopyWidgetModalOpen() {
        return this.currentOpenModal === this.modals.COPY_WIDGET;
      },

      isLoading() {
        return this.isLoadingDashboard;
      },

      isDirty() {
        return (
          !isEqual(this.initialLayout, this.layout) ||
          this.initialName !== this.name
        );
      },

      currentDashboard() {
        const dashboards =
          this.namespace === ANALYTICS
            ? this.dashboardsAnalytics
            : this.dashboardsRateShopper;

        return dashboards.filter(
          dashboard =>
            dashboard.id === this.id &&
            dashboard.user.id === this.currentUser.id
        )[0];
      },

      otherDashboards() {
        const dashboards =
          this.namespace === ANALYTICS
            ? this.dashboardsAnalytics
            : this.dashboardsRateShopper;

        return dashboards.filter(
          dashboard =>
            dashboard.id !== this.id &&
            dashboard.user.id === this.currentUser.id
        );
      },

      readonly() {
        return (
          this.dashboard.public &&
          this.dashboard.user.id !== this.currentUser.id
        );
      },

      widgetConfigurations() {
        return this.widgets.reduce((acc, curr) => {
          acc[curr.id] = curr.configuration;

          return acc;
        }, {});
      },

      ...mapGetters('analytics', [
        'dashboards',
        'dashboardsAnalytics',
        'dashboardsRateShopper'
      ]),

      ...mapState({
        dashboard(state, getters) {
          return getters[`${this.namespace}/dashboard`];
        },

        initialWidgets(state, getters) {
          return getters[`${this.namespace}/widgets`];
        },

        widgetIDs(state, getters) {
          return getters[`${this.namespace}/widgetIDs`];
        },

        getWidgetById(state, getters) {
          return getters[`${this.namespace}/getWidgetById`];
        },

        widgetCalculations(state, getters) {
          return getters[`${this.namespace}/widgetCalculations`];
        }
      }),

      ...mapGetters(['showLoader', 'currentUser', 'fullscreen'])
    },

    watch: {
      $route() {
        if (this.fullscreen) {
          this[mutationTypes.END_FULLSCREEN]();
          this.unsetLightBodyTheme();
        }

        this.resetData();
        // this.fetchDashboardAndWidgetCalculations(this.id);
      },

      widgets: {
        handler() {
          this.populateGrid();
        },
        deep: true
      },

      showLoader() {
        if (
          this.addedNewWidget &&
          !this.showLoader &&
          !this.hasScrolled &&
          this.currentDashboard
        ) {
          this.openEditMode();
        }
      }
    },

    async created() {
      await Promise.all([
        this.initializeFilters(),
        this.fetchDashboard(this.id)
      ]);
      this.widgets = [...this.initialWidgets];
      this.isLoadingDashboard = false;

      this.filtersSettled = true;
    },

    methods: {
      onCloseSelectGraphModal() {
        this.closeModal();
        this.activeGraphModalWidgetID = null;
      },

      onCloseCreateNewWidget() {
        this.closeModal();
      },

      resetWidgetCalculationState(activeGraphModalWidgetId) {
        this.$store.commit(
          `${this.namespace}/${mutationTypes.RESET_WIDGET_CALCULATION_STATE}`,
          activeGraphModalWidgetId
        );
      },

      openDropdown(dropdownID) {
        this.currentOpenDropdown = dropdownID;
      },

      closeDropdown() {
        this.currentOpenDropdown = '';
      },

      openModal(modalID) {
        this.currentOpenModal = modalID;
      },

      closeModal() {
        this.currentOpenModal = '';
      },

      openEditMode() {
        this.isEditMode = true;
        this.name = this.currentDashboard.name;
        this.initialName = this.name;
        this[mutationTypes.START_FULLSCREEN]();
        this.setLightBodyTheme();
      },

      onAddNewWidget(widget) {
        this.closeWidgetModal();
        this.$set(this, 'widgets', [...this.widgets, widget]);
        this.openEditMode();
        this.hasScrolled = false;
      },

      onEditWidget(widget) {
        this.closeWidgetModal();
        this.$set(
          this,
          'widgets',
          this.widgets.map(w => {
            if (w.id === widget.id) {
              return widget;
            }
            return w;
          })
        );
      },

      closeWidgetModal() {
        this.isWidgetModalOpen = false;
        this.widgetId = null;
      },

      onDeleteWidgetClick(id) {
        this.openModal(this.modals.WIDGET_DELETE);
        this.deletingItemID = id;
      },

      onCopyWidgetClick(id) {
        this.openModal(this.modals.COPY_WIDGET);
        // TODO: use same value as deleting widget item id, something like editing widget id
        this.copyingWidgetItemID = id;
        this.closeDropdown();
      },

      onConvertWidgetClick(id) {
        this.openModal('graphModal');
        this.closeDropdown();
        this.activeGraphModalWidgetID = id;
      },

      onCreateNewWidgetClick() {
        this.openModal('createNewWidget');
      },

      async onExportWidgetClick(widgetId) {
        const widget = this.getWidgetById(widgetId);

        const loadingMessage = `Exporting <strong>${widget.name}</strong>`;

        try {
          const abortable = true;
          const { signal } = await this.updateToast(
            toastFactory(loadingMessage, toastTypesEnum.LOADING, abortable)
          );
          await this.exportWidget(widgetId, signal);

          this.closeDropdown();

          this.updateToast(
            toastFactory(
              `<strong>${widget.name}</strong> successfully exported`,
              toastTypesEnum.SUCCESS
            )
          );
        } catch (error) {
          if (error.message === 'canceled') {
            this.updateToast(
              toastFactory(
                `Canceled exporting widget <strong>${widget.name}</strong>`,
                toastTypesEnum.WARNING
              )
            );
          } else {
            this.updateToast(
              toastFactory(
                `An error occurred while exporting widget <strong>${widget.name}</strong>`,
                toastTypesEnum.DELETE
              )
            );
          }
        } finally {
          this.removeToast(loadingMessage);
        }
      },

      onDeleteDashboardClick() {
        this.openModal(this.modals.DASHBOARD_DELETE);
        this.deletingItemID = this.dashboard.id;
      },

      onNameInput(input) {
        this.$v.name.$reset();

        this.name = input;
      },

      async onDuplicateWidgetClick(widgetId) {
        const widget = this.getWidgetById(widgetId);

        try {
          const duplicatedWidget = await this.duplicateWidget(widgetId);
          this.$set(this, 'widgets', [...this.widgets, duplicatedWidget]);

          this.closeDropdown();

          this.updateToast(
            toastFactory(
              `<strong>${widget.name}</strong> successfully <strong>duplicated</strong>`,
              toastTypesEnum.SUCCESS
            )
          );
        } catch (err) {
          this.updateToast(
            toastFactory(
              `An error occurred while duplicating widget <strong>${widget.name}</strong>`,
              toastTypesEnum.DELETE
            )
          );
        }
      },

      onWidgetTypeSelect(type) {
        this.representation = type;
        this.isWidgetModalOpen = true;
      },

      async handleDashboardDelete() {
        try {
          await this.deleteDashboard();
          if (this.isDefault) {
            await this.toggleDefaultDashboard();
          }
          this.resetDeletePrompt();
          navigate(this.$router, {
            name:
              this.namespace === ANALYTICS
                ? pages.ANALYTICS
                : pages.RATE_SHOPPER
          });
        } catch (message) {
          this.errors = message;
        } finally {
          this.isDeleting = false;
        }
      },

      redirectToWidget(id) {
        this.widgetId = id;
        this.isWidgetModalOpen = true;
      },

      onDeletePromptClose() {
        this.resetDeletePrompt();
      },

      onUnsavedChangesPromptClose() {
        this.closeUnsavedChangesModal();
      },

      onCopyWidgetPromptClose() {
        this.copyWidgetDashboardValue = '';
        this.closeModal();
      },

      resetDeletePrompt() {
        this.closeModal();
        this.deletingItemID = null;
      },

      async onDeletePromptSubmit() {
        this.isDeleting = true;
        try {
          if (this.isDeleteDashboardModalOpen) {
            await this.handleDashboardDelete();
          } else {
            const deletedWidget = await this.deleteWidget(this.deletingItemID);
            this.resetDeletePrompt();
            this.$set(
              this,
              'widgets',
              this.widgets.filter(w => w.id !== deletedWidget.id)
            );
          }
        } catch (messages) {
          this.errors = messages;
        } finally {
          this.isDeleting = false;
        }

        this.deletingItemID = null;
        this[mutationTypes.END_FULLSCREEN]();
        this.unsetLightBodyTheme();
      },

      onCopyWidgetItemClick(dashboard) {
        this.copyWidgetDashboardValue = dashboard;
        this.closeDropdown();
      },

      async onCopyWidgetPromptSubmit() {
        this.isCopying = true;
        const widget = this.getWidgetById(this.copyingWidgetItemID);

        const data = {
          dashboardId: this.copyWidgetDashboardValue.id,
          ...widget,
          configuration: DashboardCofigurationModel.adaptKeys(
            widget.configuration
          )
        };

        const toast = {
          message: `<strong>${widget.name}</strong> copied to <strong>${this.copyWidgetDashboardValue.name}</strong>`,
          type: toastTypesEnum.SUCCESS
        };

        try {
          await this.createWidget(data);
          this.closeModal();
          this.updateToast(toast);
        } catch (messages) {
          this.errors = messages;
        } finally {
          this.isCopying = false;
        }
      },

      async onSelectCurrentGraphSubmit(newType) {
        const currentType = this.getWidgetById(
          this.activeGraphModalWidgetID
        ).representation;
        const typeChange = currentType !== newType;

        // HACK: CHANGE THIS, THIS ONLY TEMPORARILY RESETS STATE TO AVOID STATE RESET AFTER THEN
        if (typeChange) {
          this[mutationTypes.RESET_WIDGET_CALCULATION_STATE](
            this.activeGraphModalWidgetID
          );
        }

        const convertedWidget = await this.convertWidget({
          widgetId: this.activeGraphModalWidgetID,
          representation: toSnakeCase(newType)
        });

        this.$set(
          this,
          'widgets',
          this.widgets.map(w => {
            if (w.id === convertedWidget.id) {
              return convertedWidget;
            }
            return w;
          })
        );
      },

      async submitChanges() {
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }

        const rearrangedWidgets = this.serializeLayout();
        const data = { name: this.name };

        this.bulkEditWidgetPlacement(rearrangedWidgets);
        try {
          await this.editDashboard(data);

          this.updateToast(
            toastFactory('Dashboard edited', toastTypesEnum.SUCCESS)
          );

          this.isEditMode = false;
          this.errors = {};
          this[mutationTypes.END_FULLSCREEN]();
          this.unsetLightBodyTheme();
        } catch (messages) {
          this.errors = { messages, data };
        }
      },

      cancelWithoutSave() {
        this.isEditMode = false;
        this[mutationTypes.END_FULLSCREEN]();
        this.unsetLightBodyTheme();
        this.populateGrid();
      },

      onUnsavedChangesPromptSubmit() {
        this.cancelWithoutSave();
        this.closeUnsavedChangesModal();
      },

      onEditSaveClick() {
        if (this.isDirty) {
          this.updateWidgetLayout();
          this.submitChanges();
        } else {
          this.cancelWithoutSave();
        }
      },

      onEditCancelClick() {
        if (this.isDirty) {
          this.openUnsavedChangesModal();
        } else {
          this.cancelWithoutSave();
        }
      },

      openUnsavedChangesModal() {
        this.hasUnsavedChangesPrompt = true;
      },

      closeUnsavedChangesModal() {
        this.hasUnsavedChangesPrompt = false;
      },

      populateGrid() {
        this.layout = this.createLayout();
      },

      resetData() {
        this.name = '';
        this.id = this.$route.params.id;
        this.deletingItemID = null;
        this.currentOpenDropdown = '';
        this.currentOpenModal = '';
        this.isEditMode = false;
        this.modals = dashboardModals;
      },

      onPublicToggleClick() {
        const data = {
          public: !this.dashboard.public
        };

        const toast = {
          message: this.dashboard.public ? 'Set to private' : 'Set to public',
          type: toastTypesEnum.SUCCESS
        };

        this.editDashboard(data).then(() => this.updateToast(toast));
      },

      onDefaultToggleClick() {
        this.toggleDefaultDashboard();
      },

      onDisplayDensityClick(displayDensity) {
        this.editTableDisplayDensity(displayDensity);
      },

      updateDefaultDashboard(dashboardId) {
        const data = {
          ...this.currentUser
        };

        const dashboard = { id: dashboardId };
        if (this.namespace === ANALYTICS) {
          data.defaultAnalyticsDashboard = dashboard;
        } else {
          data.defaultRateShopperDashboard = dashboard;
        }

        return this.updateCurrentUser(data);
      },

      onLayoutReady(layout) {
        this.initialLayout = cloneDeep(layout);
      },

      toggleDefaultDashboard() {
        const newDefaultDashboard = this.isDefault ? null : this.dashboard.id;

        const toast = {
          message: 'Updated default dashboard status',
          type: toastTypesEnum.SUCCESS
        };

        return this.updateDefaultDashboard(newDefaultDashboard).then(() =>
          this.updateToast(toast)
        );
      },

      createLayout() {
        return this.widgets.map(item => {
          return {
            i: item.id,
            x: item.positionX,
            y: item.positionY,
            w: item.width,
            h: item.height,
            name: item.name
          };
        });
      },

      serializeLayout() {
        return this.layout.map(item => {
          return {
            configuration: DashboardCofigurationModel.adaptKeys(
              this.getWidgetById(item.i).configuration
            ),
            id: item.i,
            height: item.h,
            width: item.w,
            positionX: item.x,
            positionY: item.y,
            name: item.name
          };
        });
      },

      onExpandedFilterOpen() {
        this.expandedFilterActive = true;
      },

      onExpandedFilterClose() {
        this.expandedFilterActive = false;
      },

      exportWidget(id, signal) {
        return this.$store.dispatch(`${this.namespace}/exportWidget`, {
          id,
          signal
        });
      },

      editDashboard(payload) {
        return this.$store.dispatch(`${this.namespace}/editDashboard`, payload);
      },

      bulkEditWidgetPlacement(payload) {
        return this.$store.dispatch(
          `${this.namespace}/bulkEditWidgetPlacement`,
          payload
        );
      },

      deleteWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/deleteWidget`, payload);
      },

      fetchDashboardWidget(payload) {
        return this.$store.dispatch(
          `${this.namespace}/fetchDashboardWidget`,
          payload
        );
      },

      fetchDashboard(payload) {
        return this.$store.dispatch(
          `${this.namespace}/fetchDashboard`,
          payload
        );
      },

      convertWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/convertWidget`, payload);
      },

      editTableDisplayDensity(payload) {
        return this.$store.dispatch(
          `${this.namespace}/editTableDisplayDensity`,
          payload
        );
      },

      createWidget(payload) {
        return this.$store.dispatch(`${this.namespace}/createWidget`, payload);
      },

      deleteDashboard(payload) {
        return this.$store.dispatch(
          `${this.namespace}/deleteDashboard`,
          payload
        );
      },

      duplicateWidget(payload) {
        return this.$store.dispatch(
          `${this.namespace}/duplicateWidget`,
          payload
        );
      },

      fetchWidgetCalculations(payload) {
        return this.$store.dispatch(
          `${this.namespace}/fetchWidgetCalculations`,
          payload
        );
      },

      setLightBodyTheme() {
        document.body.classList.add(this.$style.lightTheme);
      },

      unsetLightBodyTheme() {
        document.body.classList.remove(this.$style.lightTheme);
      },

      updateWidgetLayout() {
        this.widgets = this.widgets.map(widget => {
          const item = this.layout.find(item => item.i === widget.id);
          return {
            ...widget,
            height: item.h,
            width: item.w,
            positionX: item.x,
            positionY: item.y
          };
        });
      },

      ...mapActions(['updateCurrentUser', 'updateToast', 'removeToast']),

      ...mapMutations('analytics', [
        mutationTypes.RESET_WIDGET_CALCULATION_STATE
      ]),

      ...mapMutations([
        mutationTypes.START_FULLSCREEN,
        mutationTypes.END_FULLSCREEN
      ])
    },

    validations: {
      name: {
        required,
        maxLength: maxLength(50),
        isNameInvalid(currentName) {
          return !(this.errors.data && this.errors.data.name === currentName);
        }
      }
    }
  };
</script>
<style lang="scss" module>
  @import 'utils';

  $toolbar-height: 72px;

  .widget-page {
    @include stretch;
  }

  .filters {
    z-index: $z-filters;
  }

  .o-btn {
    width: 168px;
  }

  .page-wrapper {
    min-width: 1280px;
    background-color: $color-bg-main-dimmed;

    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .wrapper {
    @include column;

    overflow: auto;
    padding: 32px 40px;
  }

  .edit-wrapper {
    flex: 1;
    padding: 30px 0 calc(40px + #{$toolbar-height}) 14px;
  }

  .dashboard-header {
    padding: 0 16px;
    margin-bottom: 24px;
  }

  .placeholder {
    @include vertical-center;
    @include flex-center;
    flex-direction: column;

    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .disclaimer {
    font-size: 14px;
    line-height: 20px;

    margin: 0 auto;

    color: $color-text-main-light;
  }

  .copy-widget-dropdown {
    max-width: 320px;
    margin-top: 9px;
    margin-bottom: 14px;
  }

  .toolbar {
    @include toolbar(fixed, $z-toolbar, $toolbar-height);
    @include row;
    align-items: center;

    background-color: $color-bg-light;

    padding: 0 40px;

    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.08);

    button {
      min-width: 160px;
      height: 48px;

      &:first-child {
        min-width: 216px;
        margin-right: auto;
      }

      &:nth-child(2) {
        color: $color-text-main;
      }
    }

    button + button {
      margin-left: 16px;
    }
  }

  .light-theme {
    background-color: $color-bg-main-dimmed;
  }

  .expanded-filters {
    position: fixed;
    z-index: $z-dropdown;
    top: 0;
    right: 0;
    bottom: 0;
    left: $navigation-width;

    width: calc(100% - #{$navigation-width});

    background-color: $color-bg-primary-dark;
  }
</style>
