<template>
  <v-app>
    <v-container>
      <v-data-iterator
        :items="items"
        :search="search"
        hide-default-footer
        loading 
        loading-text="Loading... Please wait"
      >
        <template v-slot:header>
          
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="Search"
            ></v-text-field>
            
             <v-row>
               
        <v-col
        class="d-flex"
        cols="12"
        lg="12"
      >
      
        <v-card-title><b>クラス選択</b></v-card-title>
        <v-row>      
    <v-col lg="12"></v-col> <v-col xs="12"></v-col> 
    <v-col xs="12">初心者歓迎</v-col> <v-col xs="12">経験者限定</v-col> 
    <v-col lg="12">社会人限定</v-col>  
    <v-col lg="12">女性限定</v-col>
    <v-col xs="12">学生限定</v-col>
  </v-row>   
    
      </v-col>

      
      </v-row>
        
        </template>
  
        <template v-slot:default="props">
          <v-row 
          alignment='center'>
            <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="props.items"
        >
        
        </v-data-table>

      </v-col>
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
      headers: [
           { text: 'クラス', value: 'selectedClass' },
           { text: '都道府県', value: 'selectedPlace' },
           { text: '日程', value: 'requestDate' },
           { text: '集合場所', value: 'place' },
           { text: '残り枠', value: 'selectedNumber' },
           { text: '詳細', value: 'action' }
        ],
      search: null,
      items:[],
    }
  },
  created() {
    const db = firebase.firestore();
    db.collection("boardGame").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            const docItem = doc.data()
             
            console.log(docItem)
            this.items.push(docItem)
        });
    });
    
  },
 
}
</script>