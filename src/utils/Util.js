/**
 * 【汎用性のあるメソッド】
 */
import firebase from "firebase";

export default {
  computed: {
    // ログイン中のアカウントのuidを取得
    isMyUid() {
      const myUid = firebase.auth().currentUser.uid;
      return myUid ? myUid : "";
    },
  },
  methosd: {},
};
