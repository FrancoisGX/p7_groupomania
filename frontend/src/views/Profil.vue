<template>
    <div class="background-image">
        <Header/>
        <div class="profil-page card m-auto my-2 w-75 align-items-center shadow rounded test2">
            <div class ="my-5 shadow carte-message">
                <h1 class="titre-profil">Profil de l'utilisateur</h1>
                <img class="profil-icon mb-4" src="../assets/profil-icon.png" alt="icon-profil"/>
                <div class="groupe-nom-delete">
                    <div>
                        <h2 class="mx-4 background-case">Pseudo:<p>{{user.username}}</p></h2>
                    </div>
                    <div>
                        <h2 class="mx-4 background-case">Email:<p>{{user.email}}</p></h2>
                    </div>
                </div>
                <div class="groupe-texte">
                    <h3 class="mx-4 titre-description background-case">Description :</h3>
                    <div v-if="mode == 'bio'" class="texte-content">
                        <p>{{user.bio}}</p>
                    </div>
                    <textarea v-if="mode == 'modif-bio'" v-model="bio" placeholder="Ecrivez votre description..." class="texte-content bio-aera"></textarea>
                </div>
                <div class="my-3">
                    <button v-if="mode == 'bio'" @click="switchToModifBio()" class="btn btn-primary mx-4">Modifier la biographie</button>
                    <button v-if="mode == 'modif-bio'" @click='modifBio()' class="btn btn-primary">Sauvegarder</button>
                    <button v-if="mode == 'modif-bio'" @click="switchToBio()" class="btn btn-danger mx-4">Annuler</button>
                </div>    
            </div>
            <button @click="ConfirmMessage(user.id)" class="btn btn-danger mb-5">Supprimer le compte</button>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Header from '@/components/Header.vue'
    import Footer from '@/components/Footer.vue'
    import {mapState} from 'vuex'

    export default{
        components: { Header,Footer },
        name: 'Profil',
        data: function() {
            return{
            images:[
                '../assets/profil-icon.png',
            ],
            selectedImage: null,
            mode: "bio",
            bio: '',
            }
        },
        mounted: function () {
            console.log(this.$store.state.user);
            console.log(this.$store.state.userInfos);
            if(this.$store.state.user.userId < 0 && !this.$store.state.token){
                this.$router.push('/');
                return;
            }
            this.$store.dispatch('getUserInfos');
        },
        computed: {
            ...mapState({
                user: 'userInfos',
            }),
        },
        methods :{
            switchToModifBio: function () {
                this.mode = 'modif-bio';
            },
            switchToBio: function () {
                this.mode = 'bio';
            },
            modifBio: function () {
                this.$store.dispatch('modifBio',{
                    bio: this.bio
                }),document.location.reload(), 
                function (error){
                    console.log(error);
                }
            },
            ConfirmMessage: function(id) {
                if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
                    const self = this;
                    this.$store.dispatch('deleteAccount', {id})
                    .then(function(){self.$router.push('/');
                    }),function (error){
                    console.log(error);
                    }
                }
            }
        
        }
    }
</script>

<style scoped lang="scss">
    .profil-page{
        background-color: rgb(241, 227, 221);
    }

    .profil-icon{
        width: 150px;
        max-width: 30%;
    }

    .titre-profil{
        border-bottom: 5px solid rgba(119,75,74,0.3);
        border-radius: 0px 0px 22px 22px;
        background-color: rgb(230, 230, 230);
        margin-bottom: 5%;
        margin-left:20% ;
        margin-right:20% ;
        font-size: 2.3em;
    }

    .groupe-nom-delete{
        border-bottom: thick double #dab1af;
        margin-bottom: 2%;
        text-align: left;
    }

    h2{
        font-size: 2em;
        font-weight: bold;
    }

    h3{
        font-size: 1.5em;
        font-weight: bold;
    }
    
    .background-case{
        background-color: rgb(230, 230, 230);
        border: 2px solid rgba(119,119,119,0.3);
        border-radius: 16px;  
        textarea,p{
            font-size: 0.80em;
            font-weight: normal;
        }
    }

    .carte-message{
        background-color: rgb(224, 222, 222);
        position: relative;
        width: 85%;
        max-width: 800px;
        border-radius: 1em;
    }

    .titre-description{
        text-align: left;
        border: 4px solid rgba(119,119,119,0.3);
        border-radius: 16px;    
    }

    .texte-content{
        width: 700px;
        max-width: 100%;
        margin: auto;
        background-color: rgb(255, 251, 251);
        text-align: left;
        border: 6px double rgba(74,74,74,0.43);
        border-radius: 20px;   
    }

    .background-image{
        width: 100%;
        background-image: url("../assets/icon.svg");
        background-attachment: fixed;
        background-size: cover;
        background-repeat: no-repeat;
        background-position-x: center;
    }

    .bio-aera{
        outline: none;
    }

    @media screen and (max-width: 500px){
        .titre-profil{
        font-size: 1.2em;
        }
        .background-case{
            font-size: 1.6em;
        textarea,p{
            font-weight: normal;
            }
        }
    }

</style>