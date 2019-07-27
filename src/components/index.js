import scrollView from "./scrollView";

export default {
  install(Vue, option = {}) {
    Vue.component("scrollView", scrollView);
  }
};
