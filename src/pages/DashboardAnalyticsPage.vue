<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  import DashboardPage from '@/pages/DashboardPage.vue';
  import createFiltersMixin from '@/mixins/filters.mixin';

  @Component({
    extends: DashboardPage,
    mixins: [createFiltersMixin('analytics', true)]
  })
  export default class DashboardAnalyticsPage extends Vue {}
</script>
