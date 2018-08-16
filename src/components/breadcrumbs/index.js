import Breadcrumbs from "./Breadcrumbs";

export default function install(Vue, options) {
  Object.defineProperty(Vue.prototype, "$breadcrumbs", {
    get() {
      let crumbs = this.$route.matched.map(route => {
        //check to see if there is a meta property. If there is no meta property you need to dynamically generate the breadcrumb.
        const title = route.meta.title
          ? route.meta.title.split("-")[1]
          : document.title;
        return {
          title: title.charAt(0).toUpperCase() + title.slice(1),
          path: route.path
        };
      });
      return crumbs;
    }
  });

  Vue.component("breadcrumbs", Breadcrumbs);
}
