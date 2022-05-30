<template>
  <v-container fluid fill-height class="home-registor" style="max-height: 20vh;">
    <v-layout justify-center align-center column pa-5>
      <div class="headline mt-3 font-weight-bold">
            簡単・気軽に参加してみたり、または募集をしてみましょう！</div><br>
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
  name: "HomeRegistor"
};
</script>
<style scoped>
a { text-decoration: none; }
</style>