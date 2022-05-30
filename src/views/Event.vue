<template>
  <v-app>
    <v-container fluid>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="残り枠"
                  v-model="leftNumber"
                  dense
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="募集人数"
                  v-model="selectedNumber"
                  persistent-hint
                  dense
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="クラス(募集要項)"
                  v-model="selectedClass"
                  dense
                  readonly
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <Datetime
                  v-model="requestDate"
                  disabled
                  :format="'YYYY-MM-DD HH:mm'"
                  :disabled-hours="[
                    '00',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                  ]"
                  :overlay="true"
                  label="集合時間"
                ></Datetime>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="都道府県"
                  v-model="selectedPlace"
                  dense
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  label="集合場所"
                  v-model="place"
                  dense
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="特徴"
                  v-model="feature"
                  dense
                  readonly
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6"> </v-col>
            </v-row>
          </v-container>
          <small></small>
        </v-card-text>
        <v-card-actions class="mb-8">
          <v-spacer></v-spacer>
          <template v-if="!isParticipate">
            <v-btn
              large
              color="primary"
              class="ma-2 white--text"
              :disabled="leftNumber == 0"
              @click="joinConfirmDialog = true"
              >このイベントに参加申し込みをする</v-btn
            >
          </template>
          <template v-else>
            <v-btn large color="primary" class="ma-2 white--text" disabled
              >参加申し込み済み</v-btn
            >
          </template>
          <v-btn
            v-if="isParticipate && !isCreateUser"
            large
            color="error"
            class="ma-2 white--text"
            @click="deleteConfirmDialog = true"
            >このイベントの参加をやめる</v-btn
          >
        </v-card-actions>
      </v-card>

      <!-- イベント参加確認ダイアログ -->
      <v-row justify="center">
        <v-dialog v-model="joinConfirmDialog" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> 確認をお願いします。 </v-card-title>
            <v-card-text>イベントを続行しますか。</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="joinConfirmDialog = false"
              >
                キャンセル
              </v-btn>
              <v-btn color="green darken-1" text @click="addParticipant">
                続行する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <!-- イベント離脱確認ダイアログ -->
      <v-row justify="center">
        <v-dialog v-model="deleteConfirmDialog" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> 確認をお願いします。 </v-card-title>
            <v-card-text
              >イベント参加の取り止めを続行しますか。イベントから抜けた事は他の参加者に通知されます。</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="deleteConfirmDialog = false"
              >
                キャンセル
              </v-btn>
              <v-btn color="green darken-1" text @click="deleteParticipant">
                続行する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";
import { required, maxLength } from "vuelidate/lib/validators";
import Datetime from "vue-ctk-date-time-picker";
import firebase from "firebase";
import "../../node_modules/vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

export default {
  vuetify,
  validations: {
    title: { required, titleMaxLength: maxLength(30) },
    requestDate: { required },
    selectPlace: { required },
    place: { required, placeMaxLength: maxLength(60) },
    feature: { required, featureMaxLength: maxLength(300) },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },
  components: {
    Datetime,
  },
  data: () => ({
    title: "",
    requestDate: "",
    selectedPlace: "",
    place: null,
    feature: null,
    checkbox: false,
    selectPref: "",
    selectedNumber: "",
    selectedClass: "",
    items: "",
    participant: "",
    joinConfirmDialog: false,
    deleteConfirmDialog: false,
    eid: "",
    createUser: "",
    unsubscribe: null,
    userName: [],
  }),

  props: ["user", "item"],

  mounted() {
    // 残り枠をリアクティブに取得する
    const db = firebase.firestore();
    this.unsubscribe = db.doc(`boardGame/${this.eid}`).onSnapshot((doc) => {
      this.participant = doc.data().participant.filter((id) => id);
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  created() {
    (async () => {
      try {
        const db = firebase.firestore();
        this.eid = this.$route.query.eid;
        const postRef = db.collection("boardGame").doc(this.eid);
        const postDoc = await postRef.get();
        // 初期値を設定
        this.title = postDoc.get("title");
        this.selectedPlace = postDoc.get("selectedPlace");
        this.requestDate = postDoc.get("requestDate");
        this.place = postDoc.get("place");
        this.feature = postDoc.get("feature");
        this.checkbox = postDoc.get("checkbox");
        this.selectedClass = postDoc.get("selectedClass");
        this.selectedNumber = postDoc.get("selectedNumber");
        this.participant = postDoc.get("participant").filter((id) => id);
        this.createUser = postDoc.get("uid");
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();

    // ユーザー情報を取得
    (async () => {
      try {
        const db = firebase.firestore();
        const postRef = db.collection("users").where("uid", "==", this.isMyUid);
        const postDoc = await postRef.get();
        postDoc.forEach((doc) => {
          const userdoc = doc.data();
          this.userName.push(userdoc);
        });
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();
  },
  computed: {
    leftNumber() {
      // 残り枠の人数を算出
      // 募集人数 - (参加予定者 - 作成者）
      const num = this.selectedNumber - (this.participant.length - 1);
      return num;
    },
    // 参加予定者の中に自分のidがあるかチェック
    isParticipate() {
      if (this.participant) {
        return this.participant.includes(this.isMyUid) ? true : false;
      }
      return false;
    },
    // イベント作成者か判定
    isCreateUser() {
      return this.createUser === this.isMyUid ? true : false;
    },
  },
  methods: {
    addParticipant() {
      // イベント参加者に登録
      this.$store.dispatch("addParticipant", {
        eid: this.eid,
        uid: this.isMyUid,
        remainNumber: this.leftNumber - 1,
      });
      // 同時にメッセージチャンネルに通知
      this.$store.dispatch("addMessageOne", {
        eid: this.eid,
        message: `${this.userName[0].displayName} さんがイベントに参加しました。`,
      });
      // メッセージチャンネルに遷移
      this.$router.push({
        path: "/message",
        query: { eid: this.eid },
      });
    },
    // イベントから退出
    deleteParticipant() {
      this.$store.dispatch("deleteParticipant", {
        eid: this.eid,
        uid: this.isMyUid,
        remainNumber: this.leftNumber + 1,
      });
      // 同時にメッセージチャンネルに通知
      this.$store.dispatch("addMessageOne", {
        eid: this.eid,
        message: `${this.userName[0].displayName} さんがイベントから抜けました。`,
      });
      this.$router.push("/mypage");
    },
  },
};
</script>

<style></style>
