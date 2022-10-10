<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  import DashboardPage from '@/pages/DashboardPage.vue';
  import createFiltersMixin from '@/mixins/filters.mixin';

  @Component({
    extends: DashboardPage,
    mixins: [createFiltersMixin('rate-shopper', true)]
  })
  export default class DashboardRateShopperPage extends Vue {}
</script>
