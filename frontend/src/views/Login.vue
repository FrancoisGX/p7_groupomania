<template>
    <div class="card m-auto w-75 align-items-center shadow rounded">
      <img class="logo" src="../assets/icon-above-font.svg" alt="Logo Groupomania" width=300 />
      <h1  v-if="mode == 'login'">Connexion</h1>
      <h1  v-else>Inscription</h1>
      <p v-if="mode == 'login'">Tu n'as pas encore de compte ? <span class="lien_co" @click="switchToCreateAccount()">Créer un compte</span></p>
      <p v-else >Tu as déjà un compte ? <span class="lien_co" @click="switchToLogin()">Se connecter</span></p>
      <div class="p-2">
        <div class="form-group">
          <label for="inputEmail">Adresse mail</label>
          <input type="email" v-model="email" class="form-control" id="inputEmail"  />
        </div>
        <div class="form-group">
          <label for="inputUsername" v-if="mode == 'create'" >Nom utilisateur</label>
          <input type="text" v-if="mode == 'create'"  v-model="username" class="form-control " id="inputUsername" />
        </div>
        <div class="form-group">
          <label for="inputPassword">Mot de passe</label>
          <input type="password" v-model="password" class="form-control" id="inputPassword"/>
        </div>
        <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
          <p class="error_message">Adresse mail et/ou mot de passe invalide</p>
        </div>
        <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
          <p class="error_message">Adresse mail déja utilisée</p>
        </div>
        <button @click="login()" class="btn btn-primary" :class="{'disabled' : !validatedFields}" v-if="mode == 'login'">
          <span v-if= "status == 'loading'">Connexion en cours...</span>
          <span v-else>Connexion</span>
          </button>
        <button @click="createAccount()" class="btn btn-primary" :class="{'disabled' : !validatedFields}" v-else>
          <span v-if= "status == 'loading'">Création en cours...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: 'Login',
  data: function() {
    return{
      mode: "login",
      email: '',
      username: '',
      password:'',
    }
  },
  computed: {
    validatedFields: function() {
      if (this.mode == 'create') {
        if(this.email != "" && this.username !="" && this.password != ""){
          return true;
        }else{
          return false;
        }
      }else{
        if (this.email != "" && this.password != ""){
          return true;
        }else {
          return false;
        }
      }
    },
    ...mapState(['status'])
  },
  mounted: function (){
    if(this.$store.state.user.userId !== -1){
        this.$router.push('/');
         return;
    }
  },

  methods: {
    switchToCreateAccount: function () {
      this.mode = 'create';
    },
    switchToLogin: function () {
      this.mode = 'login';
    },
    createAccount: function () {
      const self = this;
      this.$store.dispatch('createAccount',{
        email: this.email,
        username: this.username,
        password: this.password
      }).then(function(){
        self.login();
      }), function (error){
        console.log(error);
      }
    },
    login: function() {
      const self = this;
      this.$store.dispatch('login',{
        email: this.email,
        password: this.password
      }).then(function(){
        self.$router.push('/princip');
      }), function (error){
        console.log(error);
      }
    },
  }
}
</script>

<style scoped lang="scss">

  .lien_co{
    color:blue;
    text-decoration: underline ;
    cursor: pointer;
  };

  .error_message{
    color: red;
  };
  

</style>
