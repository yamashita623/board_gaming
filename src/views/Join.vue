<template>
  <v-app>
    <v-container>
      <v-data-iterator
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
        loading 
        loading-text="Loading... Please wait"
      >
        <template v-slot:header>
          <v-toolbar
            dark
            color="blue lighten-1"
            class="mb-1"
          >
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="Search"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <div class="flex-grow-1"></div>
              <v-btn-toggle
                v-model="sortDesc"
                mandatory
              >
                <v-btn
                  large
                  depressed
                  color="blue lighten-1"
                  :value="false"
                >
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn
                  large
                  depressed
                  color="blue lighten-1"
                  :value="true"
                >
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>
  
        <template v-slot:default="props">
          <v-row 
          alignment='center'>
            <v-col
              v-for="item in props.items"
              :key="item.Name"
              cols="12" sm="12" md="6" lg="6"
            >
                <v-list dense flat max-width="500px">
                  <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>
                  <v-divider></v-divider>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                    :color="sortBy === key ? `blue lighten-4` : `white`"
                  >

                    <v-list-item-content>
                      <v-list-item-title><v-icon>{{ getDisplayIcon(key) }}</v-icon>{{ getDisplay(key) }}</v-list-item-title>
                      <v-list-item-subtitle >
                        <pre style="white-space: pre-wrap">{{ item[key]}}</pre>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
            </v-col>
          </v-row>
        </template>
  
        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">ページ</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
  
            <div class="flex-grow-1"></div>
  
            <span
              class="mr-4
              grey--text"
            >
              Page {{ page }} of {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="mr-1"
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue darken-3"
              class="ml-1"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </v-app>
</template>

<script>
import vuetify from '../plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import firebase from 'firebase';
export default {
  vuetify,
  data () {
    return {
      itemsPerPageArray: [8, 16, 32, 64],
      search: null,
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 8,
      sortBy: 'Updateday',
      keys: [
        'feature',
        'requestDate',
        'selectedPlace',
        'place',
        'selectedNumber',
        'createday',
        'updateday',
      ],
      items:[],
    }
  },
  created() {
    const db = firebase.firestore();
    db.collection("boardGame").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            const docItem = doc.data()
            if (docItem.createday != null) docItem.createday = this.convertDate(docItem.createday.toDate())
            if (docItem.updateday != null) docItem.updateday = this.convertDate(docItem.updateday.toDate()) 
            console.log(docItem)
            this.items.push(docItem)
        });
    });
    this.search = this.$route.params.search.toString();
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key != 'Name' && key != 'Src')
    },
  },
  methods: {
     nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page -1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    getDisplay(val) {
      switch(val) {
        case 'title': return "タイトル"
        case 'requestDate': return "日時"
        case 'selectedPlace': return "都道府県"
        case 'place': return "場所"
        case 'selectedNumber':return "募集人数"
        case 'feature': return "特徴"
        case 'createday': return "投稿日"
        case 'updateday': return "更新日"
        default: return val
      }
    },
    getAssetsImage(val) {
      if (val == "No_Image.jpg") {
        return require("../assets/No_Image.jpg")
      }
      return val;
    },
    getDisplayIcon(val) {
      switch(val) {
        case 'place': return "home"
        case 'selectedPlace': return "home"
        case 'feature': return "check_circle_outline"
        case 'selectedNumber': return "face"
        case 'requestDate': return "access_alarm"
        case 'createday': return "access_alarm"
        case 'updateday': return "access_alarm"
        default: return "" 
      }
    },
    convertDate(d) {
      const year  = d.getFullYear();
      const month = d.getMonth() + 1;
      const day  = d.getDate();
      const hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      const min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      const sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    },
  },
}
</script>