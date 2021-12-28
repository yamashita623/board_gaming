<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>新規登録</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                                name="UserName"
                                label="ユーザー名"
                                type="UserName"
                                v-model="UserName"
                                :rules="UserNameRules"
                                data-cy="joinUserNameField"
                                required
                            >
                            </v-text-field>
                            <v-text-field
                                name="email"
                                label="メールアドレス"
                                type="email"
                                v-model="email"
                                :rules="emailRules"
                                data-cy="joinEmailField"
                                required
                            >
                            </v-text-field>
                            <v-text-field
                                name="password"
                                label="パスワード"
                                type="password"
                                required
                                v-model="password"
                                :rules="passwordRules"
                                data-cy="joinPasswordField"
                            >
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
              class="fill-width text-capitalize caption"
              height="36px"
              outlined
              style="border-color:#979797;"
              tile
              @click="googleSignin"
            >
              <img
                class="button-logo-img mr-4"
                src="https://madeby.google.com/static/images/google_g_logo.svg"
                style="height:18px;"
              />
              Googleで続ける
            </v-btn>
                        <v-btn
                            color="primary"
                            :disabled="!valid"
                            @click="submit"
                            data-cy="joinSubmitBtn"
                            >登録</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Singup',
    data() {
        return {
            valid: false,
            UserName: '',
            email: '',
            password: '',
             UserNameRules: [
            v => !!v || "ユーザー名を入力してください",
            v => (v && v.length < 12) || "ユーザー名は12文字以内でなければなりません",
            
        ],
            emailRules: [
                v => !!v || 'メールアドレスを入力してください',
                v => /.+@.+/.test(v) || '有効なメールアドレスを入力してください'
            ],
            passwordRules: [
                v => !!v || 'パスワードを入力してください',
                v =>
                    v.length >= 6 ||
                    'パスワードは6文字以上でなければなりません'
            ]
        };
    },
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('SignUpUser', {
                    UserName: this.UserName,
                    email: this.email,
                    password: this.password
                });
            }
        },
        googleSignin() {
            this.$store.dispatch('googleSignin')
            this.$router.push('/')
        }
    }
};
</script>

<style scoped></style>
