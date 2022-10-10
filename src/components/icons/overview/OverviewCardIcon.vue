<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { CARD_STATUSES } from '@/constants/overview';

  @Component({
    name: 'OverviewCardIcon'
  })
  export default class OverviewCardIcon extends Vue {
    @Prop({
      type: String,
      required: true,
      validator(theme: string): boolean {
        return CARD_STATUSES.includes(theme);
      }
    })
    readonly theme: string;
  }
</script>
