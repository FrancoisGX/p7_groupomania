<template>
    <div class="background-image">
        <Header/>
        <div id="listMessage" class="card m-auto my-2 w-75 align-items-center shadow rounded">
            <div class ="my-5 shadow carte-message zone-message">
                <p class="titre-sendtext">Publier votre message!</p>
                <textarea class="row" placeholder="Titre" type="text" v-model="title" id="title" name="title" required ></textarea>
                <textarea class="row" placeholder="Ecrivez votre message..." type="text" v-model="content" id="content"  name="content" required></textarea>
                <button @click="createMessage()" class="btn btn-primary mx-2">Publier votre message</button>
            </div>
            <div v-for='message in messages' :key="message.id" class ="my-5 shadow carte-message">
                <div class="groupe-nom-delete">
                    <div class="row">
                        <img class="profil-icon my-2 ml-4" src="../assets/profil-icon.png" alt="icon-profil" width="80"/>
                        <div class="row name-date">
                            <h2 class=" ml-4 col-12 name-put">{{message.User.username}}</h2>
                            <p class="ml-4 col-12 date-put">Posté le {{message.createdAt}}</p>
                        </div>
                        <i @click="ConfirmMessage(message.id)" class="fas fa-trash-alt fa-1x delete-icone "></i>
                    </div>
                </div>
                <div class="groupe-texte scroller">
                    <p class="ml-1 titre-message font-weight-bold">Sujet: {{message.title}}</p>
                    <p class="message">{{message.content}}</p>
                    <button v-if="mode == 'comment'" @click="showComments(message.id)" class="btn btn-primary">Afficher les commentaires</button>
                    <button v-if="mode == 'comment'" @click="switchToNocomment()" class="btn btn-primary">Cacher les commentaires</button>
                    <div v-if="mode == 'comment'" class="texte-content">
                        <div class="row" v-for='comment in comments' :key="comment">
                            <textarea class="row" placeholder="Ecrivez votre message..." type="text" v-model="content" id="content"  name="content" required></textarea>
                            <button @click="createComment()" class="btn btn-primary">Publier le commentaire</button>
                        </div>
                        <div class="comment-card">
                            <div class="row ">
                                <p class="pseudo ml-4">pseudo</p>
                            </div>
                            <div class="row">
                                <p class="date ml-4">{{comment.createdAt}}</p>
                            </div>
                            <div class="row">
                                <p class="comment-text ml-4">{{comment.comment}}</p>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import Header from '@/components/Header.vue'
    import Footer from '@/components/Footer.vue'

    export default{
        components: { Header,Footer },
        name: 'Princip',
        data: function() {
            return{
            mode: "normal",
            title: '',
            content: '',
            comment:''
            }
        },
        computed: {
            validatedFields: function() {
                if(this.title != "" && this.content !="" &&this.comment){
                return true;
                }else{
                return false;
                }
            },
            messages () { return this.$store.state.userMessages },
            comments () { return this.$store.state.userComments }
        },
        mounted: 
        function () {
            console.log(this.$store.state.user);
            if(this.$store.state.user.userId < 0){
                this.$router.push('/');
                return;
            }
            this.$store.dispatch('getuserMessages',); 
                 
        },

        methods :{
             ConfirmMessage: function(id) {  
                console.log(id)
                if (window.confirm("Voulez-vous vraiment supprimer votre message ?")) {
                    this.$store.dispatch('deleteMessage',{id})
                }
            },
           /* showComments: function(id) {
                this.mode = 'comment';  
                console.log(id)
                this.$store.dispatch('getComments',{id})
            },
            switchToNocomment: function () {
                this.mode = 'normal';
            },*/

            createMessage: function () {
                this.$store.dispatch('createMessage',{
                    title: this.title,
                    content: this.content,
                })
                , function (error){
                    console.log(error);
                }
            },
        }
        
    }
    
</script>

<style scoped lang="scss">
    #listMessage{
        background-color: rgb(241, 227, 221);
    }

    .zone-message{
        padding: 2%;
    }

    .titre-sendtext{
        font-size: 2em;
    }

    #title{
        margin: auto;
        height: 50px;
        width: 500px;
        max-width: 80%;
        border: 6px groove rgba(74,74,74,0.43);
        border-radius: 20px;
        outline:none;
    }
    #content{
        margin: auto;
        height: 100px;
        width: 500px;
        max-width: 80%;
        border: 6px groove rgba(74,74,74,0.43);
        border-radius: 20px;   
        outline:none; 
    }

    .input-image{
        margin-left: 5%;
        transition: transform .2s; 
        &:hover{
            transform: scale(1.05); 
        }
    }

    .ico-image{
        padding-right:5px ;
    }

    .btn{
        margin-top: 3%;
    }

    .groupe-nom-delete{
        border-bottom: thick double #dab1af;
        margin-bottom: 2%;
        .delete-icone{
        position: absolute;
        right: 20px;
        top: 20px;
        transition: transform .2s; 
            &:hover{
            transform: scale(1.5); 
            }
        }
        .modif-icone{
        position: absolute;
        right: 50px;
        top: 20px;
        transition: transform .2s; 
            &:hover{
            transform: scale(1.5); 
            }
        }
    }
    

    .carte-message{
        background-color: rgb(224, 222, 222);
        position: relative;
        width: 85%;
        max-width: 800px;
        border-radius: 1em;
    }

    .name-date{
        text-align: left;
        .name-put{
            padding-top:10px;
        }
    }

    .titre-message{
        font-size: 1em;
        text-align: left;
        padding-left:20px ;
    }

    .message{
        font-size: 1.2em;
        text-align: left;
        padding-left:25px ;
        padding-bottom: 3%;
    }

    .texte-content{
        width: 700px;
        height: 200px;
        max-width: 100%;
        margin: auto;
        background-color: rgb(255, 251, 251);
        text-align: left;
        padding-left: 1%;
        padding-right: 1%;
        border: 6px double rgba(74,74,74,0.43);
        border-radius: 20px; 
        overflow-y: scroll;
        overflow-x: hidden;
    }
   

    .background-image{
        width: 100%;
        background-image: url("../assets/icon.svg");
        background-attachment: fixed;
        background-size: cover;
        background-repeat: no-repeat;
        background-position-x: center;
    }

    .comment-card{
        border: 4px solid #000000;
        border-radius: 25px;
    }

</style>