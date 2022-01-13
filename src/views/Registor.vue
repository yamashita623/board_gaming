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
              :items="getPref"
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
              :items="classes"
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
          color="deep-purple accent-4"
          class="white--text"
          @click="addEvent()"
          >登録</v-btn
        >
        <v-btn @click="clear">入力内容を初期化</v-btn>
      </form>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from '../plugins/vuetify';
import { required, maxLength } from 'vuelidate/lib/validators';
import moment from 'moment';
import Datetime from 'vue-ctk-date-time-picker';
import '../../node_modules/vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
const { validationMixin } = require('vuelidate');

export default {
  vuetify,
  mixins: [validationMixin],
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
    title: '',
    requestDate: '',
    selectedPlace: '',
    place: null,
    feature: null,
    checkbox: false,
    selectPref: '',
    //Max Upload Size
    pref: [
      '北海道',
      '青森県',
      '岩手県',
      '宮城県',
      '秋田県',
      '山形県',
      '福島県',
      '茨城県',
      '栃木県',
      '群馬県',
      '埼玉県',
      '千葉県',
      '東京都',
      '神奈川県',
      '新潟県',
      '富山県',
      '石川県',
      '福井県',
      '山梨県',
      '長野県',
      '岐阜県',
      '静岡県',
      '愛知県',
      '三重県',
      '滋賀県',
      '京都府',
      '大阪府',
      '兵庫県',
      '奈良県',
      '和歌山県',
      '鳥取県',
      '島根県',
      '岡山県',
      '広島県',
      '山口県',
      '徳島県',
      '香川県',
      '愛媛県',
      '高知県',
      '福岡県',
      '佐賀県',
      '長崎県',
      '熊本県',
      '大分県',
      '宮崎県',
      '鹿児島県',
      '沖縄県',
    ],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    classes: ['初心者歓迎','経験者限定','社会人限定','女性限定','学生限定',
    '社会人限定・初心者歓迎','社会人限定・経験者限定',
    '女性限定・初心者歓迎','女性限定・経験者限定','学生限定・初心者歓迎','学生限定・経験者限定'],
    selectedNumber: '',
    selectedClass: '',
  }),

  props: ['user', 'item'],
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked &&
        errors.push('利用規約への同意をお願いします');
      return errors;
    },
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.titleMaxLength &&
        errors.push('タイトルは３０文字以内で入力してください');
      !this.$v.title.required &&
        errors.push('(例)4人でボードゲームしたいです！初心者歓迎！');
      return errors;
    },
    placeErrors() {
      const errors = [];
      if (!this.$v.place.$dirty) return errors;
      !this.$v.place.placeMaxLength &&
        errors.push('集合場所は６０文字以内で入力してください');
      !this.$v.place.required && errors.push('場所を入力してください');
      return errors;
    },
    featureErrors() {
      const errors = [];
      if (!this.$v.place.$dirty) return errors;
      !this.$v.place.placeMaxLength &&
        errors.push('特徴は３００文字以内で入力してください');
      !this.$v.place.required && errors.push('特徴を入力してください');
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
      const start = moment().add(1, 'days').hour(8);
      return start.format('YYYY-MM-DDTHH:mm:ss');
    },
    end() {
      // max-date に min-date から3ヶ月後を指定
      const start = moment(this.start);
      const end = start.add(3, 'months').endOf('day');
      return end.format('YYYY-MM-DDTHH:mm:ss');
    },
  },
  methods: {
    addEvent() {
      this.$store.dispatch('addEvent', { title: this.title,
        requestDate: this.requestDate,
        selectedPlace: this.selectedPlace,
        place: this.place,
        selectedNumber: this.selectedNumber,
        feature: this.feature,
        userName: '香川'
        });
    },
    clear() {
      this.$v.$reset();
      this.title = '';
      this.selectedPlace = '';
      this.requestDate = '';
      this.place = '';
      this.feature = '';
      this.checkbox = false;
      this.selectedNumber = '';
    },
    
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
