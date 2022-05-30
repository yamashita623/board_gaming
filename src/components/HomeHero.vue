<template>
  <v-container fluid fill-height class="home-hero" style="max-height: 100vh;">
    <v-layout justify-center align-center column pa-5>
      <div class="display-1 font-weight-black white--text text-xs-center">あなたも一緒にボードゲームで遊びませんか？</div><br>
      <div class="font-weight-black white--text text-xs-center mb-3">「ボードゲームクラブ」なら、<br>
      どこよりも簡単にボードゲームで遊ぶ相手を探すことができます！
      </div>
      <router-link
      to="/signup">
      <v-btn
  color="primary"
  elevation="5"
  rounded
  x-large
>新規登録</v-btn>
</router-link>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "HomeHero"
};
</script>

<style scoped>
.home-hero {
  background-image: url("../assets/boardgame_home.jpg");
  background-size: cover;
  width: 100%;
  height: 20%;
}
a { text-decoration: none; }
</style>
