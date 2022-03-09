<template>
  <v-app>
    <v-container fluid>
      <form>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="title"
              :error-messages="titleErrors"
              :counter="30"
              label="タイトル"
              required
              ref="title"
              @input="$v.title.$touch()"
              @blur="$v.title.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
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
              label="集合日時"
            ></Datetime>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
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
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="place"
              :error-messages="placeErrors"
              :counter="60"
              label="集合場所"
              required
              ref="place"
              @input="$v.place.$touch()"
              @blur="$v.place.$touch()"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
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
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-select
              :items="numbers"
              item-text="showLabel"
              item-value="selectedValue"
              v-model="selectedNumber"
              return-object
              label="募集人数(自身を除いた人数)"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-textarea
          v-model="feature"
          :error-messages="featureErrors"
          :counter="300"
          outlined
          name="feature"
          label="特徴"
          required
          ref="feature"
          @input="$v.feature.$touch()"
          @blur="$v.feature.$touch()"
          placeholder="遊びたいボードゲームなどのタイトルを入れてください"
        ></v-textarea>
        <v-checkbox
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="利用規約に同意する"
          required
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
        ></v-checkbox>
        <v-btn
          color="primary"
          text
          href="../assets/html/kiyaku.html"
          target="blank"
        />

        <v-btn
          color="primary"
          class="white--text"
          :disabled="$v.$invalid"
          @click="addEvent()"
          >登録</v-btn
        >
        <v-btn @click="clear">入力内容を初期化</v-btn>
      </form>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";
import { required, maxLength } from "vuelidate/lib/validators";
import moment from "moment";
import Datetime from "vue-ctk-date-time-picker";
import "../../node_modules/vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
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
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
    selectedNumber: "",
    selectedClass: "",
  }),

  props: ["user", "item"],
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked &&
        errors.push("利用規約への同意をお願いします");
      return errors;
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
