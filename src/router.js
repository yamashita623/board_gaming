import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/join",
      name: "join",
      component: () => import("./views/Join.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/registor",
      name: "registor",
      component: () => import("./views/Registor.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("./views/Signin.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/Signup.vue"),
    },
    {
      path: "/mypage",
      name: "mypage",
      component: () => import("./views/MyPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/message",
      name: "message",
      component: () => import("./views/Message.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/event",
      name: "event",
      component: () => import("./views/Event.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/event/edit",
      name: "event-edit",
      component: () => import("./views/event/Edit.vue"),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehaivor() {
    return { x: 0, y: 0 };
  },
});

// Vuexに保持している認証フラグauth（Boolean:true/false）を返します
function isLogin() {
  return store.getters.isAuthenticated;
}
// メタフィールドrequiresAuthが要認証trueなら認証フラグ判定
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // requiresAuthがtrueなら評価
    if (!isLogin()) {
      // 未ログインならログインページへ
      next("/signin");
    } else {
      next(); // スルー
    }
  } else {
    next(); // スルー
  }
});

export default router;
