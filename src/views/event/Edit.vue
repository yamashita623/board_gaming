<template>
  <v-app>
    <v-container fluid>
      <v-card>
        <v-card-title>
          <span class="text-h5">イベント編集・削除</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  label="タイトル"
                  :error-messages="titleErrors"
                  v-model="title"
                  :counter="30"
                  ref="title"
                  @input="$v.title.$touch()"
                  @blur="$v.title.$touch()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="募集人数(自身を除いた人数)"
                  v-model="selectedNumber"
                  persistent-hint
                  dense
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="$constant.classes"
                  item-text="showLabel"
                  item-value="selectedValue"
                  v-model="selectedClass"
                  return-object
                  label="クラス(募集要項)"
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="selectedPlace"
                  :items="$constant.pref"
                  item-text="showLabel"
                  item-value="selectedValue"
                  return-object
                  label="都道府県"
                >
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="集合場所"
                  :error-messages="placeErrors"
                  :counter="60"
                  v-model="place"
                  required
                  ref="place"
                  @input="$v.place.$touch()"
                  @blur="$v.place.$touch()"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <Datetime
                  v-model="requestDate"
                  :minute-interval="30"
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
                  :min-date="start"
                  :max-date="end"
                  label="集合時間"
                ></Datetime>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="特徴"
                  v-model="feature"
                  :error-messages="featureErrors"
                  :counter="300"
                  ref="feature"
                  @input="$v.feature.$touch()"
                  @blur="$v.feature.$touch()"
                  placeholder="遊びたいボードゲームなどのタイトルを入れてください"
                  required
                  dense
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6"> </v-col>
            </v-row>
          </v-container>
          <small></small>
        </v-card-text>
        <v-card-actions class="mb-8">
          <v-spacer></v-spacer>
          <v-btn
            large
            color="primary"
            class="ma-2 white--text"
            :disabled="$v.$invalid"
            @click="updateEvent"
            >登録</v-btn
          >
          <v-btn
            large
            color="error"
            class="ma-2 white--text"
            @click="dialog = true"
            >削除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>

    <!-- ダイアログ -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="text-h5"> 確認をお願いします。 </v-card-title>
          <v-card-text
            >本当にイベントの削除を続行しますか。イベントを削除すると参加予定者へ通知されます。</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">
              キャンセル
            </v-btn>
            <v-btn color="green darken-1" text @click="deleteEvent">
              続行する
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-app>
</template>

<script>
import vuetify from "../../plugins/vuetify";
import { required, maxLength } from "vuelidate/lib/validators";
import moment from "moment";
import Datetime from "vue-ctk-date-time-picker";
import "../../../node_modules/vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import firebase from "firebase";
const { validationMixin } = require("vuelidate");

export default {
  vuetify,
  mixins: [validationMixin],
  validations: {
    title: { required, titleMaxLength: maxLength(30) },
    requestDate: { required },
    selectedPlace: { required },
    place: { required, placeMaxLength: maxLength(60) },
    feature: { required, featureMaxLength: maxLength(300) },
  },
  components: {
    Datetime,
  },
  data: () => ({
    dialog: false,
    title: "",
    requestDate: "",
    selectedPlace: "",
    place: null,
    feature: null,
    checkbox: false,
    participant: [],
    selectPref: "",
    selectedNumber: "",
    selectedClass: "",
  }),

  props: ["user", "item"],

  created() {
    (async () => {
      try {
        const db = firebase.firestore();
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
        this.participant = postDoc.get("participant");
      } catch (err) {
        console.log(`Error: ${JSON.stringify(err)}`);
      }
    })();
  },
  computed: {
    eid() {
      return this.$route.query.eid;
    },
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.titleMaxLength &&
        errors.push("タイトルは３０文字以内で入力してください");
      !this.$v.title.required &&
        errors.push("(例)4人でボードゲームしたいです！");
      return errors;
    },
    placeErrors() {
      const errors = [];
      if (!this.$v.place.$dirty) return errors;
      !this.$v.place.placeMaxLength &&
        errors.push("集合場所は６０文字以内で入力してください");
      !this.$v.place.required && errors.push("場所を入力してください");
      return errors;
    },
    featureErrors() {
      const errors = [];
      if (!this.$v.feature.$dirty) return errors;
      !this.$v.feature.featureMaxLength &&
        errors.push("特徴は３００文字以内で入力してください");
      !this.$v.feature.required &&
        errors.push("(例)○○というゲームで遊びたい！");
      return errors;
    },
    getPref: {
      get: function () {
        var self = this;
        return self.pref.filter(function (item) {
          return item;
        });
      },
      set: function (v) {
        this.pref = v;
      },
    },
    start() {
      // min-date に明日の9時を指定
      const start = moment().add(1, "days").hour(8);
      return start.format("YYYY-MM-DDTHH:mm:ss");
    },
    end() {
      // max-date に min-date から3ヶ月後を指定
      const start = moment(this.start);
      const end = start.add(3, "months").endOf("day");
      return end.format("YYYY-MM-DDTHH:mm:ss");
    },
  },
  methods: {
    addEvent() {
      this.$store.dispatch("addEventOne", {
        title: this.title,
        requestDate: this.requestDate,
        selectedPlace: this.selectedPlace,
        place: this.place,
        selectedNumber: this.selectedNumber,
        selectedClass: this.selectedClass,
        feature: this.feature,
      });
      return;
    },
    updateEvent() {
      this.$store.dispatch("updateEventOne", {
        eid: this.eid,
        title: this.title,
        requestDate: this.requestDate,
        selectedPlace: this.selectedPlace,
        place: this.place,
        selectedNumber: this.selectedNumber,
        selectedClass: this.selectedClass,
        feature: this.feature,
      });
      this.$store.dispatch("addMessageOne", {
        eid: this.eid,
        message:
          "イベント作成者によって情報が更新されました。参加者の皆様は更新内容を確認しましょう。",
      });
      this.$router.push("/mypage");
    },
    deleteEvent() {
      this.$store.dispatch("deleteEventOne", {
        eid: this.eid,
        title: this.title,
        participant: this.participant,
      });
      this.$store.dispatch("addMessageOne", {
        eid: this.eid,
        message: "イベント作成者によってイベントが削除されました。",
      });
      this.$router.push("/mypage");
    },
    clear() {
      this.$v.$reset();
      this.title = "";
      this.selectedPlace = "";
      this.requestDate = "";
      this.place = "";
      this.feature = "";
      this.checkbox = false;
      this.selectedNumber = "";
    },
  },
};
</script>

<style></style>
