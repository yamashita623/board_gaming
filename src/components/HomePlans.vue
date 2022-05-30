<template>
  <v-container grid-list-lg>
    <v-layout row>
      <v-flex
        xs12
        class="text-xs-center display-1 font-weight-black my-5"
      >人気のあるゲーム</v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm12 md4>
        <v-card @click="move('人狼')">
          <v-responsive>
            <v-img
              src="../assets/jinrou.jpg"
              height="500px"
            >
          
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline white--text">人狼ゲーム</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-responsive>

          <v-card-text>
            <div>
              <h3 class="headline mb-0">人狼ゲーム</h3>
              <div>
                【プレイヤー数】６ ~ １２<br>
                【難易度】中級 <br>
                【ルール】<br>
                人狼ゲームは基本的に村人勢と人狼勢の二つの陣営によって行われるゲームになります。
                ゲームの目的は、村人側にとっては村に紛れ込んだ人狼を
                見つけ出して処刑することであり、人狼側にとっては自分の正体を悟られないようにして村人を減らしていくことになります。
                最終的にどちらかの陣営を壊滅させた側が勝利となります。
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm12 md4>
        <v-card @click="move('カタン')">
          <v-responsive>
            <v-img
              src="../assets/katan.jpg"
              height="500px"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline white--text">カタンの開拓者たち</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-responsive>

          <v-card-text>
            <div>
              <h3 class="headline mb-0">カタンの開拓者たち</h3>
              <div>
                【プレイヤー数】4<br>
                【難易度】簡単 <br>
                【ルール】<br>
                カタンという無人島を舞台に、拠点となる開拓地(家)を建ててそこから島全体を開拓していきます。<br>
                対戦相手との開拓競争で、最初に10点<br>（例：開拓地1点）取った人が勝者になります。<br>
                小学生（8才）から遊べるほど<br>簡単なルールでありながら、大人もハマるボードゲームの決定版です！
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm12 md4>
        <v-card  @click="move()">
          <v-responsive>
            <v-img
              src="../assets/other.jpg"
              height="500px"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline white--text">その他のゲーム</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-responsive>

          <v-card-text>
            <div>
              <h3 class="headline mb-0">その他のゲーム</h3>
              <div>
                【プレイヤー数】様々<br>
                【難易度】様々 <br>
                【ルール】<br>
                ルールも募集人数も様々！<br>
                100種類以上のゲームの中から、あなたのお気に入りを探しましょう！
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "HomePlans",
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
}}
</script>

<style scoped>
a { text-decoration: none; }
</style>
