<template>
  <span>
    <v-app-bar>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <router-link to="/">
        <v-toolbar-title >{{appTitle}}</v-toolbar-title>
      </router-link>
      <v-btn text to="/join" data-cy="joinBtn">参加する</v-btn>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <div v-if="!isAuthenticated" class="hidden-sm-and-down">
        <v-btn text to="/signin" data-cy="signinBtn">ログイン</v-btn>
        <v-btn text to="/signup" data-cy="signupBtn">会員登録(無料)</v-btn>
      </div>
      <div v-else>
        <v-btn text to="/registor" data-cy="registorBtn">募集する</v-btn>
        <v-btn text to="/myPage">マイページ</v-btn>
        <v-btn outlined color="gray" @click="logout" data-cy="logout">ログアウト</v-btn>
      </div>
    </v-app-bar>
  </span>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      appTitle: "BoardGameClub",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("userSignOut");
    }
  }
};
</script>

<style scoped>
.router-link-exact-active {
  color: black;
  text-decoration: none;
}
.v-toolbar__title {
  color: black;
  text-decoration: none;
}
a { text-decoration: none; }
</style>
