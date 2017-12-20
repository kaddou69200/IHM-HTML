
let navbar = {

    props: {
        formu: String,
        modif: String,
        upco: String,
        curentpage: String
    },

    template: `<div class="ui three item menu">
                        <a class="ui violet item" :class="formu" v-on:click="formulaire">Formulaire</a>
                        <a class="ui violet item" :class="modif" v-on:click="modification">Modification Page</a>
                        <a class="ui violet item" :class="upco" v-on:click="upcoming">Upcoming Events</a>
                </div>`
    ,

    methods: {

        formulaire: function () {
            this.$emit('formulaire')
        },

        modification: function () {
            this.$emit('modification')
        },

        upcoming: function () {
            this.$emit('upcoming')
        }
    }
};

let shortformspage = {
    props: {
        title:String,
        description: String,
        id: Number,
        idasupprimer: Number
    },
    template:`<div>
                <p>{{id}}</p>
                <h2 class="ui center aligned header">{{ title }}</h2>

                <h4 class="ui center aligned header">
                {{ description }}
                </h4>
                <div class="ui center aligned header">
                  <input type="button" class="mini ui inverted violet button" name="supression" value="Supression" @click="suppression">
                  <input type="button" class="mini ui inverted violet button" name="modifcation" value="Modifcation">
                  <input type="button" class="mini ui inverted violet button" name="reponse" value="Répondre" ><br/><br/>
                </div>
</div>`,
    methods:{
        suppression: function(){
            this.$parent.$parent.$data.idasupprimer=this.id ;
            this.$emit('suppression')
        }
    }
};

let formspage = {
    props: {question: Object,
        idasupprimer: Number
        },
    components: { shortformspage },
    template: `<div>
                <div v-for="question in question">
                    <shortformspage @suppression="suppression" :idasupprimer="idasupprimer" :title="question.title" :description="question.description" :id="question.id" ></shortformspage>
                </div>
                <input v-on:click="newform" type="button" class="ui inverted violet button" value="Nouveau formulaire" >
                <br><br>
</div>`,
    methods:{
        suppression: function(){
            this.$emit('suppression')
        },
        newform: function(){
            this.$parent.$data.curentpage="newform"
        }
    }
};

let editclosedquestion = {
    props:{
        reponse: Object,
        newtab: Object
    },
  template:`<div>
                <br>

                <div v-for="reponse in reponse"><input type="button" class="ui right floated inverted red button" value="Supprimer">
                  <div class="field">
                    <input type="text" :value='reponse'>
                    <br><br>
                  </div>
                </div>
                <div class="seven wide field">
                    <input type="button" class="ui inline inverted violet button" value="Ajouter une réponse" @click="ajtrep">
                </div>
            </div>`,
    methods:{
        ajtrep: function(){
            this.newtab ++
        }
    }
};

let editopenquestion = {
    template: `<div>
                    <input type="text" value="Ceci est un compteur">
                    <div class="circular ui icon buttons">
                      <button class="ui negative button">-</button>
                      <button class="ui positive button">+</button>
                    </div>
               </div>`
};

let editquestion = {
    components: { editopenquestion, editclosedquestion },
    props: {
        titlequest: {type: String, default: "titre de votre question"},
        typequest: {type: String, default: 'QO'    },
        reponse: {type: Object, default: function(){ return } },
        newtab: Object

    },
    template: `<div><input type="button" class="ui right floated inverted red button" value="supprimer">
                    <select v-model="typequest" value="typequest">
                        <option value="QO">Question à choix ouvert</option>
                        <option value="QM">Question à choix multiple</option>
                        <option value="QC">Question à choix unique</option>
                    </select>
                    <div class="seven wide field">
                    <input type="text" :value="titlequest">
                    </div>

                    <editopenquestion v-if="typequest === 'QO' " :newtab="newtab"></editopenquestion>
                    <editclosedquestion v-if ="typequest === 'QM'" :reponse="reponse" :newtab="newtab"></editclosedquestion>
                    <editclosedquestion v-else-if ="typequest === 'QC'" :reponse="reponse" :newtab="newtab"></editclosedquestion>
                    <br><br>
               </div>`


};

let editformspage = {
    components:{ editquestion },
    props:{
      title: String,
        tabloadform: Object

    },
    template: `<div>
                  <form class="ui form">
                    <div class="field">
                      <div class="seven wide field">
                        <input name="title" placeholder="Titre" type="text" value="title">
                      </div>
                        <textarea rows="2" type="text" placeholder="Description">Description</textarea>
                      <br><br>

                      <br><br>
                    </div>
                    <editquestion v-if="Object.keys(this.tabloadform).length === 0"></editquestion>
                    <div  v-for="tabloadform in tabloadform" v-else>
                        <editquestion :titlequest="tabloadform.titlequest" :typequest="tabloadform.typequest" :reponse="tabloadform.reponse" ></editquestion>
                    </div>
                    <button class="ui right floated button"><i class="save icon"></i></button>
                    <input type="button" class="ui right floated classic button" value="Nouvelle question" @click="newquest">
                    <br><br>
                    <br><br>
                  </form>
               </div>`,
    methods:{
        save: function(){
            this.$parent.$data.newtab = this.$parent.$data.tabloadform
        },
        newquest: function(){
            this.$emit('ajtquest')
        }
    }
};

new Vue ({
    el: '#app' ,
    components: { navbar, formspage, editformspage },
    data: {
        curentpage: "formulaire",
        formu: "active",
        modif: "",
        upco: "",

        title: "titre d'un formulaire",
        description: "descriptionx formulaire",

        question:{
            0:{
                id: 0,
                title: "Le premier questionnaire",
                description: "Ici sera la description du premier questionnaire séléctionné par l'utilisateur"
            },
            1:{
                id: 1,
                title: "Le second questionnaire",
                description: "Ici sera la description du second questionnaire séléctionné par l'utilisateur"
            },
            2:{
                id: 2,
                title: "Le troisième questionnaire",
                description: "Ici sera la description du troisième questionnaire séléctionné par l'utilisateur"
            }
        },
        idasupprimer: -1,
        tabloadform:{
            0:{
                id: 0,
                titlequest:"Une première question a choix ouvert chargée",
                typequest:"QO"
            },
            1:{
                id: 1,
                titlequest:"Une seconde question a choix multiple chargée",
                typequest:'QM',
                reponse:{
                    0: "Ceci est une prémière réponse",
                    1: "Ceci est une seconde réponse"
                }
            }
        },
        newtab: {}


    },
    methods: {
        formulaire: function(){
            this.formu="active",
            this.modif="",
            this.upco="",
            this.curentpage="formulaire"
        },
        modification: function(){
            this.upco = " " ,
            this.formu = " " ,
            this.modif = "active",
            this.curentpage = "modification"
        },
        upcoming: function(){
            this.formu=" ",
            this.modif=" ",
            this.upco="active",
            this.curentpage="upcoming"
        },
        suppression: function(){
            delete this.question.idasupprimer;

        },
        tab: function(){
            console.log(Object.keys(this.tabloadform).length === 0)
        },
        ajtquest: function (){
            this.tabloadform.push({'Object.keys(this.tabloadform).length': {id:Object.keys(this.tabloadform).length} })
        }
    }
})
