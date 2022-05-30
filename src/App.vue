<template>
  <v-app>
    <Header></Header>
    <v-content transition="slide-x-transition">
      <router-view></router-view>
      <Footer></Footer>
    </v-content>
    <!-- <Footer></Footer> -->
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
