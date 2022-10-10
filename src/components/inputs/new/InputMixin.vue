<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component({
    model: {
      event: 'update'
    }
  })
  export default class InputMixin extends Vue {
    @Prop({
      type: String,
      default: ''
    })
    readonly label: string;

    @Prop({
      type: String,
      default: ''
    })
    readonly placeholder: string;

    @Prop({
      type: [String, Array],
      default: () => []
    })
    readonly inputClass: string | string[];

    @Prop({
      type: [String, Array],
      default: () => []
    })
    readonly wrapperClass: string | string[];

    @Prop({
      type: Boolean
    })
    readonly dark: boolean;

    @Prop({
      type: Boolean
    })
    readonly error: boolean;

    @Prop({
      type: String,
      default: ''
    })
    readonly message: string;

    @Prop({
      type: Boolean
    })
    readonly disabled: boolean;

    @Prop({
      type: Boolean
    })
    readonly readonly: boolean;

    @Prop({
      type: Boolean
    })
    readonly transparent: boolean;
  }
</script>
