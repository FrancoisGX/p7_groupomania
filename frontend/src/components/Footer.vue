<template>
    <div class="footer">
        <div class="col text-center color_background">
            <img class="logo" src="../assets/icon-left-font-monochrome-black.svg" alt="Logo Groupomania" />
            <ul class="list-inline">
                <li class="list-inline-item"><a href="#">À propos</a></li>
                <li class="list-inline-item"><a href="#">Besoin d'aide?</a></li>
                <li class="list-inline-item"><a href="#">Mentions légales</a></li>
                <li class="list-inline-item"><a href="#">Accessibilité</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'Footer',
    }
</script>

<style scoped lang="scss">
    .footer{
        position: absolute;
        width: 100%;
        padding-top: 5%;
        padding-bottom: 2%;
        border-top: thick double #dab1af;
        background-color: rgb(251, 242, 242);
        .logo{
            width: 400px;
            max-width: 60%;
            padding-bottom:5% ;
        }
        li{
            margin-left: 1%;
            margin-right: 1%;
        }
    }
</style>