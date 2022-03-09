<template>
<v-footer dark padless>
    <v-container>
      <v-row>
        <v-col cols="3">
          <p>2人用</p>
          <ul>
            <li><a @click="move('ガイスター')">ガイスター</a></li>
            <li><a @click="move('バトルライン')">バトルライン</a> <span>おすすめ</span></li>
            <li><a @click="move('ゴブレット・ゴブラーズ')">ゴブレット・ゴブラーズ</a></li>
          </ul>
        </v-col>
        <v-col cols="3">
          <p>4人用</p>
          <ul>
            <li><a @click="move('カタン')">カタンの開拓者たち</a></li>
            <li><a @click="move('ドミニオン')">ドミニオン</a></li>
            <li><a @click="move('宝石の煌き')">宝石の煌き</a></li>
            <li><a @click="move('ラブレター')">ラブレター</a> <span>おすすめ</span></li>
            <li><a @click="move('パンデミック')">パンデミック</a></li>
          </ul>
        </v-col>
        <v-col cols="3">
          <p>4人以上</p>
          <ul>
            <li><a @click="move('人狼')">人狼</a></li>
            <li><a @click="move('ワンナイト人狼')">ワンナイト人狼</a></li>
            <li><a @click="move('ハゲタカのえじき')">ハゲタカのえじき</a></li>
            <li><a @click="move('ごきぶりポーカー')">ごきぶりポーカー</a></li>
            <li><a @click="move('犯人は踊る')">犯人は踊る</a></li>
            
          </ul>
        </v-col>
         <v-col cols="3">
          <ul>
            <li><a @click="move('モノポリー')">モノポリー</a></li>
            <li><a @click="move('ニムト')">ニムト</a> <span>おすすめ</span></li>
          </ul>
        </v-col>
      </v-row>
      <hr>
      <div class="row row3">
        <div class="col-4">
          <p>&copy; 2021 - {{ new Date().getFullYear() }} ボードゲームクラブ</p>
        </div>
      </div>
    </v-container>
  
</v-footer>
</template>

<script>
export default {
  name: "Footer",
  methods: {
      // イベント参加ページへ遷移
    move(val) {
    this.$router.push({
      name: 'join',
      params: {
        searchWord: val
      },
    });
  },
}
};
</script>

<style scoped>

</style>