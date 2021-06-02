<template>
    <nav class="col offset-md-4 navbar navbar-expand-md navbar-light font-weight-bold">
        <router-link to="/princip"><img class="logo" src="../assets/icon-2.png" alt="Logo Groupomania" /></router-link>
        <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarContent" class="collapse navbar-collapse ">
            <ul class="navbar-nav ml-auto text-right">
                <li class="nav-item nav">
                    <router-link class="nav-link" to="/princip"><i class="fas fa-home"></i>Accueil</router-link>
                </li>
                <li class="nav-item nav">
                    <router-link class="nav-link" to="/profil"><i class="far fa-user"></i>Profil</router-link>
                </li>
                <li class="nav-item nav">
                    <router-link @click="logout()" class="nav-link" to="/"><i class="fas fa-sign-out-alt"></i>Déconnexion</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default{
        name: 'Header',
        methods: {
            logout: function () {
                this.$store.commit('logout');
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped lang="scss">

    .navbar{
        position: relative;
        margin: 0;
        margin-top: 0px ;
        border-bottom: 6px groove rgba(164,63,63,0.43);
        border-radius: 0px 0px 20px 20px;
        .logo{
            width: 400px;
            max-width: 50%;
        }
    }


    .nav {
        a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
        color: #e93717;
        }
    }
}

</style>