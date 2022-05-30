import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import "firebase/auth";
import "@/firebase/";

import utils from "@/utils/Util.js";
import constant from "@/utils/Constant.js";
Vue.mixin(utils);
Vue.prototype.$constant = constant;

export const db = firebase.firestore();
export const auth = firebase.auth();



Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
