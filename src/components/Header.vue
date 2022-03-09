<template>
  <div>
    <v-app-bar>
      <!-- SP用ハンバーガーメニュー -->
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <router-link to="/">
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
      </router-link>
      <v-btn text to="/join" data-cy="joinBtn">参加する</v-btn>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <div v-if="!isAuthenticated" class="hidden-sm-and-down">
        <v-btn text to="/signin" data-cy="signinBtn">ログイン</v-btn>
        <v-btn text to="/signup" data-cy="signupBtn">会員登録(無料)</v-btn>
      </div>
      <div v-else class="hidden-sm-and-down">
        <v-btn text to="/registor" data-cy="registorBtn">募集する</v-btn>
        <v-btn text to="/mypage">マイページ</v-btn>
        <v-btn text @click="logout" data-cy="logout">ログアウト</v-btn>
      </div>
    </v-app-bar>

    <!-- SP用ドロワー -->
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group v-if="!isAuthenticated">
          <v-list-item to="/signin">
            <v-list-item-title>ログイン</v-list-item-title>
          </v-list-item>
          <v-list-item to="/signup">
            <v-list-item-title>会員登録(無料)</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group v-else>
          <v-list-item to="/registor">
            <v-list-item-title>募集する</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage">
            <v-list-item-title>マイページ</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      appTitle: "BoardGameClub",
      drawer: false,
    };
  },
  computed: {
      // ログインしているか確認
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("userSignOut");
    },
  },
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
a {
  text-decoration: none;
}
</style>
