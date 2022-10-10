import {Vue} from "vue-property-decorator";

export interface ComponentModel {
    readonly component: string | Vue,
    readonly props: object
}
