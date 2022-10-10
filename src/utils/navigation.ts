import {RawLocation, VueRouter} from "vue-router/types/router";

export function navigate(router: VueRouter, location: RawLocation) {
    // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
    return router.push(location).catch(ignored => {});
}
