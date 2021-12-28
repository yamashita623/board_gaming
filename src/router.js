import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";


Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/join",
      name: "join",
      component: () => import("./views/Join.vue"),
     
    },
    {
      path: "/registor",
      name: "registor",
      component: () => import("./views/Registor.vue")
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("./views/Signin.vue")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/Signup.vue")
    }
  ],
  scrollBehaivor () {
    return { x: 0, y: 0 }
  }
});



export default router;
