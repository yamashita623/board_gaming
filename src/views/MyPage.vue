<template>
  <v-app>
    <v-container>
      <v-data-iterator
        :items="items"
        hide-default-footer
        loading
        loading-text="読み込み中です"
      >
        <v-layout wrop>
          <v-flex xs6>
            <v-btn
              :to="{ path: '/message', query: { eid: firstChannelId } }"
              color="primary"
              elevation="5"
              rounded
              x-large
              class="ma-8"
              :disabled="!isJoinEventItems"
              >メッセージチャンネルへ移動</v-btn
            >
          </v-flex>
        </v-layout>

        <!-- イベント削除のお知らせ表示 -->
        <template v-if="deleteEventMessages"
          ><div v-for="(message, index) in deleteEventMessages" :key="index">
            <v-alert type="warning" class="mt-3 mb-12"
              ><span>{{ message.message }}</span
              ><v-btn
                @click="confirmNotice(message.noticeId)"
                color="white"
                class="ml-8"
                outlined
              >
                確認しました。
              </v-btn></v-alert
            >
          </div></template
        >

        <!-- 参加予定イベント -->
        <template v-if="isJoinEventItems">
          <v-data-table
            :headers="headers"
            :items="joinEventItems"
            class="elevation-1 mb-12"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>参加予定イベント</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:[`item.remainNumber`]="{ item }">
              {{ item.remainNumber ? item.remainNumber : "満枠" }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                color="primary"
                :to="{ path: '/event', query: { eid: item.eid } }"
                >詳細</v-btn
              >
            </template>
          </v-data-table>
        </template>
        <template v-else
          ><v-alert color="grey" type="info" class="mt-3 mb-12"
            >参加予定イベントはありません。</v-alert
          ></template
        >

        <!-- 作成イベント -->
        <template v-if="isMyEventItems">
          <v-data-table
            :headers="headers"
            :items="myEventItems"
            class="elevation-1 mb-12"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>作成イベント</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:[`item.remainNumber`]="{ item }">
              {{ item.remainNumber ? item.remainNumber : "満枠" }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                color="primary"
                :to="{ path: '/event/edit', query: { eid: item.eid } }"
                >編集・削除</v-btn
              >
            </template>
          </v-data-table>
        </template>
        <template v-else
          ><v-alert color="grey" type="info" class="mt-3"
            >作成されたイベントはありません。</v-alert
          ></template
        >
      </v-data-iterator>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import firebase from "firebase";
export default {
  vuetify,
  data() {
    return {
      headers: [
        {
          text: "クラス",
          value: "selectedClass",
          sortable: false,
          filter: this.filterClass,
        },
        { text: "都道府県", value: "selectedPlace", sortable: false },
        { text: "日程", value: "requestDate", sortable: false },
        { text: "集合場所", value: "place", sortable: false },
        { text: "残り枠", value: "remainNumber", sortable: false },
        { text: "詳細", value: "actions", sortable: false },
      ],
      classes: [
        { text: "全て", value: "" },
        { text: "初心者歓迎", value: "初心者" },
        { text: "経験者限定", value: "経験者" },
        { text: "社会人限定", value: "社会" },
        { text: "女性限定", value: "女性" },
        { text: "学生限定", value: "学生" },
      ],
      searchWord: "",
      items: [],
      selectClasses: "",
      showContent: false,
      eventIndex: -1,
      form: "",
      joinEventItems: [],
      myEventItems: [],
      unsubscribe: null,
      deleteEventMessages: [],
    };
  },
  created() {
    const db = firebase.firestore();
    db.collection("boardGame")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const docItem = doc.data();
          this.items.push(docItem);
        });
      });

    // イベント削除のお知らせがあれば取得
    (async () => {
      try {
        const postRef = db
          .collection("notice")
          .where("participant", "array-contains", this.isMyUid);
        const postDoc = await postRef.get();
        postDoc.forEach((doc) => {
          const noticeDoc = doc.data();
          this.deleteEventMessages.push(noticeDoc);
        });
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();

    // 参加予定イベントを取得
    (async () => {
      try {
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

    // 自分が作成したイベントを取得
    (async () => {
      try {
        const postRef = db
          .collection("boardGame")
          .where("uid", "==", this.isMyUid);
        const postDoc = await postRef.get();
        postDoc.forEach((doc) => {
          const myEventDoc = doc.data();
          this.myEventItems.push(myEventDoc);
        });
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();
  },

  computed: {
    // メッセージチャンネルで初期表示するチャンネルを指定
    firstChannelId() {
      if (this.isJoinEventItems) return this.joinEventItems[0].eid;
      return "";
    },
    // 参加イベントの有無を判定
    isJoinEventItems() {
      return this.joinEventItems.length;
    },
    // 自作イベントの有無を判定
    isMyEventItems() {
      return this.myEventItems.length;
    },
  },
  methods: {
    // イベントを削除した際、noticeコレクションのparticipantフィールドから、
    // ログインユーザーのIDを削除する事でお知らせ表示を削除する
    confirmNotice(id) {
      this.$store.dispatch("deleteNotice", {
        uid: this.isMyUid,
        noticeId: id,
      });
      return false;
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th {
  color: white;
  background-color: #1e90ff;
}
input {
  width: 30%;
  padding: 0.5em 1em;
  border-radius: 2px;
  margin-bottom: 1em;
}
</style>
