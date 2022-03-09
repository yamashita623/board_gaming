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
            <v-text-field
              v-model="searchWord"
              single-line
              hide-details
              prepend-inner-icon="search"
              label="キーワード検索"
              class="ma-5"
            ></v-text-field>
          </v-flex>

          <v-flex xs6>
            <v-select
              v-model="selectClasses"
              :items="classes"
              label="クラス選択"
              class="ma-5"
            ></v-select>
          </v-flex>
        </v-layout>

        <template v-if="filteredItems">
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            class="elevation-1 mb-12"
          >
            <template v-slot:[`item.remainNumber`]="{ item }">
              {{ item.remainNumber ? item.remainNumber : "満枠" }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                color="primary"
                :to="{ path: '/event', query: { eid: item.eid } }"
                >詳細・申し込み</v-btn
              >
            </template>
          </v-data-table>
        </template>
        <template v-else
          ><v-alert color="grey" type="info" class="mt-3 mb-12"
            >予定されているイベントはありません。</v-alert
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
    };
  },
  components: {},
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
    this.searchWord = this.$route.params.searchWord
  },

  computed: {
    filteredItems: function () {
      let data = this.items;
      const filterWord = this.searchWord && this.searchWord.toLowerCase();
      const filterClass = this.selectClasses;

      if (filterWord || this.selectClasses) {
        data = data.filter(function (row) {
          // カテゴリー絞り込み
          if (filterClass) {
            if (row["selectedClass"].indexOf(filterClass)) {
              return false;
            }
          }
          // キーワード絞り込み
          if (filterWord) {
            return Object.keys(row).some(function (key) {
              if (String(row[key]).toLowerCase().indexOf(filterWord) > -1) {
                return true;
              }
            });
          }
          return row;
        });
      }
      return data;
    },
  },
  methosd: {},
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
