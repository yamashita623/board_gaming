<template>
  <v-app id="inspire">
    <v-container class="py-8 px-6">
      <!-- チャンネル切り替えタブ -->
      <template>
        <v-row class="justify-center">
          <div v-for="(item, index) in joinEventItems" :key="`chip-${index}`">
            <v-btn
              :to="{ path: '/message', query: { eid: item.eid } }"
              class="mr-5 mb-3"
              color="primary"
              outlined
              rounded
              style="font-weight: bold"
              >{{ item.title }}
            </v-btn>
          </div>
        </v-row>
      </template>

      <v-row class="overflow-auto" style="height: 600px">
        <v-col cols="12">
          <!-- メッセージエリア -->
          <template v-for="(message, index) in messages">
            <v-card
              :key="`message-${index}`"
              class="mx-auto mb-5"
              outlined
              elevation="1"
            >
              <v-list-item three-line>
                <v-list-item-avatar tile size="80" color=""
                  ><v-icon size="80"
                    >mdi-account-circle</v-icon
                  ></v-list-item-avatar
                >
                <v-list-item-content>
                  <div class="text-overline text-h2">
                    {{ message.displayName }}
                  </div>
                  <p class="text-justify mb-2">
                    {{ message.message }}
                  </p>
                  <p class="text-justify mb-2">
                    {{ setPostDate(message.postDate) }}
                  </p>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </template>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <!-- メッセージ投稿フォーム -->
          <template>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="postMessage"
                      append-outer-icon="mdi-send"
                      filled
                      clearable
                      label="メッセージ本文"
                      type="text"
                      @click:append-outer="sendMessage"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    text: "center",
    postMessage: "",
    messages: [],
    joinEventItems: [],
    drawer: null,
    unsubscribe: null,
  }),
  mounted() {
    const eid = this.$route.query.eid;
    const db = firebase.firestore();
    this.unsubscribe = db
      .collection("messages")
      .where("eid", "==", eid)
      .orderBy("postDate")
      .onSnapshot((snapshot) => {
        this.messages = [];
        snapshot.forEach(async (doc) => {
          if (!doc && !doc.data()) return;
          const message = doc.data();
          const userName = await db
            .collection("users")
            .where("uid", "==", message.uid)
            .get();
          if (!userName.docs[0] && !userName.docs[0].data()) return;
          this.messages.push({
            ...message,
            displayName: userName.docs[0].data().displayName,
          });
        });
      });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  created() {
    // 参加予定イベントを取得
    (async () => {
      try {
        const db = firebase.firestore();
        const postRef = db
          .collection("boardGame")
          .where("participant", "array-contains", this.isMyUid);
        const postDoc = await postRef.get();
        postDoc.forEach((doc) => {
          const joinEventDoc = doc.data();
          this.joinEventItems.push(joinEventDoc);
        });
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();
  },
  watch: {
    // 同ページ内でのチャンネル切り替えではbeforeDestroyのunsubscribeが発動しないので、
    // クエリの変更をwatchで監視して、onSnapshotで取得するイベントid切り替えを反映させる
    "$route.query"(query) {
      this.unsubscribe();
      const db = firebase.firestore();
      this.unsubscribe = db
        .collection("messages")
        .where("eid", "==", query.eid)
        .orderBy("postDate")
        .onSnapshot((snapshot) => {
          this.messages = [];
          snapshot.forEach(async (doc) => {
            // 存在チェック
            if (!doc && !doc.data()) return;
            const message = doc.data();
            const userName = await db
              .collection("users")
              .where("uid", "==", message.uid)
              .get();
            // 存在チェック
            if (!userName.docs[0] && !userName.docs[0].data()) return;
            this.messages.push({
              ...message,
              displayName: userName.docs[0].data().displayName,
            });
          });
        });
    },
  },
  computed: {
    eid() {
      return this.$route.query.eid;
    },
  },
  methods: {
    // timestampなどの変換は本来dayjsなどのライブラリを使うと良いです
    setPostDate(timestamp) {
      const date = new Date(timestamp.toDate());
      const convertDate =
        date.getFullYear() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
      return convertDate;
    },
    // メッセージ送信
    sendMessage() {
      // 空で送信しようとした際はアラートを表示
      if (!this.postMessage) {
        return alert("メッセージを入力して下さい。");
      }
      this.$store.dispatch("addMessageOne", {
        eid: this.eid,
        message: this.postMessage,
      });
      this.postMessage = "";
      return;
    },
  },
};
</script>
