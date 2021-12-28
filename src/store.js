import Vue from "vue";
import Vuex from "vuex";
import firebase from 'firebase';
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    displayName:'',
    user: null,
    isAuthenticated: false,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
    setUpDateDisplayName(state, payload) {
      state.displayName = payload;
    },
  },
  actions: {
    signInUser({ commit }, userInfo) {
      firebase
        .auth()
        .signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(() => {
          commit('setIsAuthenticated', true);
          const user = firebase.auth().currentUser;
          commit('setUser', user);
          commit('setUpDateDisplayName', user.displayName);
          router.push('/');
        })
        .catch((e) => {
          alert(e.message);
        });
    },
    async SignUpUser({ commit }, { UserName,email, password }) {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(email,password);
        const user = firebase.auth().currentUser;
        await user.updateProfile({
          displayName: UserName,
        });
        commit('setIsAuthenticated', true);
        commit('setUser', user);
        commit('setUpDateDisplayName', user.displayName);
        router.push('/');
      } catch (e) {
        alert(e.message);
      }
    },
    userSignOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('setUser', null);
          commit('setIsAuthenticated', false);
          router.push('/');
        })
        .catch(() => {
          commit('setUser', null);
          commit('setIsAuthenticated', false);
          router.push('/');
        });
    },
    async addEvent({ title,requestDate,selectedPlace,place,selectedNumber,feature,userName }){
      const val = {
        title:title,
        requestDate:requestDate,
        selectedPlace:selectedPlace,
        place:place,
        selectedNumber:selectedNumber,
        feature:feature,
        usernName:userName
      }
      const isMyUid = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      db.collection('boardGame')
        .add({
          uid: isMyUid,
          title: val.title,
          requestDate: val.requestDate,
          selectedPlace: val.selectedPlace,
          place: val.place,
          selectedNumber: val.selectedNumber,
          feature: val.feature,
          createday: timestamp,
          updateday: timestamp,
          userName: val.userName
        })
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id);
          router.push('/join');
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    },
     googleSignin ({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
         const user = result.user;
          commit('setIsAuthenticated', true);
          commit('setUser', user);
          commit('setUpDateDisplayName', user.displayName);
      }).catch((e) => (this.error = e.message))
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
    displayName(state) {
      return state.displayName;
    }
  }
});
