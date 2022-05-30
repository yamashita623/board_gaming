import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    displayName: "",
    user: null,
    isAuthenticated: false,
    boardGameInfo: "",
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
    setBoardGameInfo(state, payload) {
      state.boardGameInfo = payload;
    },
  },
  actions: {
    // ログイン
    signInUser({ commit }, userInfo) {
      firebase
        .auth()
        .signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(() => {
          commit("setIsAuthenticated", true);
          const user = firebase.auth().currentUser;
          commit("setUser", user);
          commit("setUpDateDisplayName", user.displayName);
          router.push("/");
        })
        .catch((e) => {
          alert(e.message);
        });
    },
    // 新規登録
    async SignUpUser({ commit }, { UserName, email, password }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = firebase.auth().currentUser;
        const isMyUid = firebase.auth().currentUser.uid;
        // ユーザーコレクションに「ユーザー名」を登録
        await firebase.firestore().collection("users").add({
          uid: isMyUid,
          displayName: UserName,
        });
        commit("setIsAuthenticated", true);
        commit("setUser", user);
        commit("setUpDateDisplayName", user.displayName);
        router.push("/");
      } catch (e) {
        alert(e.message);
      }
    },
    // ログアウト
    userSignOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setUser", null);
          commit("setIsAuthenticated", false);
          alert("ログアウトしました。");
          router.push("/");
        })
        .catch(() => {
          commit("setUser", null);
          commit("setIsAuthenticated", false);
          router.push("/");
        });
    },
    // イベント登録
    async addEventOne(
      { commit },
      {
        title,
        requestDate,
        selectedPlace,
        place,
        selectedNumber,
        selectedClass,
        feature,
      }
    ) {
      const val = {
        title: title,
        requestDate: requestDate,
        selectedPlace: selectedPlace,
        place: place,
        selectedNumber: selectedNumber,
        selectedClass: selectedClass,
        feature: feature,
      };
      const isMyUid = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      const newDoc = db.collection("boardGame").doc().id;

      db.collection("boardGame")
        .doc(newDoc)
        .set({
          eid: newDoc,
          uid: isMyUid,
          title: val.title,
          requestDate: val.requestDate,
          selectedPlace: val.selectedPlace,
          place: val.place,
          selectedNumber: val.selectedNumber,
          remainNumber: val.selectedNumber,
          selectedClass: val.selectedClass,
          feature: val.feature,
          participant: [isMyUid],
          createday: timestamp,
          updateday: timestamp,
        })
        .then(function () {
          commit("setBoardGameInfo", true);
          router.push("/join");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    },
    // イベント情報の更新
    async updateEventOne(
      cursor,
      {
        eid,
        title,
        requestDate,
        selectedPlace,
        place,
        selectedNumber,
        selectedClass,
        feature,
      }
    ) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (cursor) {
        db.collection("boardGame").doc(eid).update({
          title: title,
          requestDate: requestDate,
          selectedPlace: selectedPlace,
          place: place,
          selectedNumber: selectedNumber,
          selectedClass: selectedClass,
          feature: feature,
          updateday: timestamp,
        });
      }
    },
    // イベント情報の削除
    async deleteEventOne(cursor, { eid, title, participant }) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      if (cursor) {
        db.collection("boardGame").doc(eid).delete();
      }
      // イベント削除と同時にお知らせを登録
      const newDoc = db.collection("boardGame").doc().id;
      db.collection("notice")
        .doc(newDoc)
        .set({
          eid: eid,
          noticeId: newDoc,
          message: `参加予定のイベント「${title}」が削除されました。`,
          confirm: false,
          title: title,
          participant: participant,
          postDate: timestamp,
          createday: timestamp,
          updateday: timestamp,
        })
        .then(function () {})
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    },
    // マイページお知らせ削除更新
    async deleteNotice(cursor, { uid, noticeId }) {
      const db = firebase.firestore();
      if (cursor) {
        db.collection("notice")
          .doc(noticeId)
          .update({
            participant: firebase.firestore.FieldValue.arrayRemove(uid),
          });
      }
      router.push("/");
    },
    // 指定のイベント参加者の追加更新
    async addParticipant(cursor, { eid, uid, remainNumber }) {
      const db = firebase.firestore();
      if (cursor) {
        db.collection("boardGame")
          .doc(eid)
          .update({
            participant: firebase.firestore.FieldValue.arrayUnion(uid),
            remainNumber: remainNumber,
          });
      }
    },
    // 指定のイベント参加者の削除更新
    async deleteParticipant(cursor, { eid, uid, remainNumber }) {
      const db = firebase.firestore();
      if (cursor) {
        db.collection("boardGame")
          .doc(eid)
          .update({
            participant: firebase.firestore.FieldValue.arrayRemove(uid),
            remainNumber: remainNumber,
          });
      }
    },
    // メッセージ登録
    async addMessageOne({ cursor }, { eid, message }) {
      const isMyUid = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const newDoc = db.collection("messages").doc().id;
      db.collection("messages")
        .doc(newDoc)
        .set({
          eid: eid,
          messageId: newDoc,
          uid: isMyUid,
          message: message,
          postDate: timestamp,
          createday: timestamp,
          updateday: timestamp,
        })
        .then(function () {
          console.log(cursor);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    },
    // Googleアカウントログイン
    googleSignin({ commit }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          commit("setIsAuthenticated", true);
          commit("setUser", user);
          commit("setUpDateDisplayName", user.displayName);
        })
        .catch((e) => (this.error = e.message));
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
    displayName(state) {
      return state.displayName;
    },
  },
});
