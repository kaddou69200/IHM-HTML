
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
                  <input type="button" class="mini ui inverted violet button" name="modifcation" value="Modifcation" @click="newform">
                  <input type="button" class="mini ui inverted violet button" name="reponse" value="Répondre" @click="subject"><br/><br/>
                </div>
</div>`,
    methods:{
        suppression: function(){
            this.$parent.$parent.$data.idasupprimer=this.id ;
            this.$emit('suppression')
        },
        subject: function(){
            this.$emit('subject')
        },
        newform: function(){
            this.$parent.$parent.$data.curentpage="newform"
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
                    <shortformspage  @subject="subject" @suppression="suppression" :idasupprimer="idasupprimer" :title="question.title" :description="question.description" :id="question.id" ></shortformspage>
                </div>
                <input  type="button" class="ui inverted violet button" value="Nouveau formulaire" >
                <br><br>
</div>`,
    methods:{
        suppression: function(){
            this.$emit('suppression')
        },

        subject: function(){
            this.$emit('subject')
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
    props:  {
        count: Number
    },

    methods:{
        enlv: function(){
            return this.$parent.$parent.$data.count --
        },
        increment: function () {
           return this.$parent.$parent.$data.count ++
        }
    },
    template: `<div>
                    <input type="text" :value="count">
                    <div class="circular ui icon buttons">
                      <button class="ui negative button" @click="enlv">-</button>
                      <button class="ui positive button" @click="increment">+</button>
                    </div>
               </div>`,

};

let editquestion = {
    components: { editopenquestion, editclosedquestion },
    props: {
        titlequest: {type: String, default: "titre de votre question"},
        typequest: {type: String, default: 'QO'    },
        reponse: {type: Object, default: function(){ return } },
        newtab: Object,
        count: Number

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

                    <editopenquestion v-if="typequest === 'QO' " :newtab="newtab" :count="count"></editopenquestion>
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

let qunique = {
    props:{
        title: String,
        reponse: Object
    },
    template: `<div>
                 <h2 class="ui center aligned header">{{ title }}</h2>
                 <div  v-for="reponse in reponse" class="ui radio checkbox">
                    <input  type="radio" :id="reponse.id" :name="reponse"><label for="reponse.id">{{ reponse.rep }}</label>
                 </div>
                 <br><br> 
             </div>`
};

let qmultiple = {
    props:{
        reponse: Object,
        title: String
    },
    template: `<div>
                 <h2 class="ui center aligned header">{{ title }}</h2>
                 <div class="ui checkbox" v-for="reponse in reponse">
                    <input type="checkbox"><label>{{ reponse.rep }}</label>
                </div>
                <br><br> 
             </div>`
};

let qouverte = {
    props:{
        title: String,
        nbmot: Number
    },
    template: `<div>
                 <h2 class="ui center aligned header">{{ title }}</h2>
                 <div 
                      <input class="ui violet inverted button" type="text" v-for="nbmot in nbmot" row=3>
                  </div>
                 <br><br>
             </div>`

};

let subjectpage = {
    components:{ qouverte, qmultiple, qunique },
    props:{
        notreformulaire: Object
    },
    template: `<div>
            <div v-for="notreformulaire in notreformulaire" class="ui center aligned header">
                    <qouverte v-if="notreformulaire.typequest ==='QO'" :title="notreformulaire.titlequest" :nbmot="notreformulaire.nbmot"></qouverte>
                    <qmultiple v-if="notreformulaire.typequest ==='QM'" :title="notreformulaire.titlequest" :reponse="notreformulaire.reponse"></qmultiple>
                    <qunique v-if="notreformulaire.typequest ==='QU'" :title="notreformulaire.titlequest" :reponse="notreformulaire.reponse"></qunique>
               </div>
               </div>`

};

new Vue ({
    el: '#app' ,
    components: { navbar, formspage, editformspage, subjectpage },
    data: {
        curentpage: "formulaire",
        formu: "active",
        modif: "",
        count: 1,
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
        newtab: {},
        notreformulaire: {
            0:{
                id:0,
                titlequest: "Voici une question ouverte",
                typequest: "QO",
                nbmot:10

            },
            1:{
                id:1,
                titlequest: "Voici une question à choix multiple",
                typequest: "QM",
                reponse:{
                    0: { id: 0,
                        rep:"une premiere reponse"},
                    1: { id: 1,
                        rep:"une seconde reponse"},
                }
            },
            2:{
                id:2,
                titlequest: "Voici une seconde question ouverte",
                typequest: "QO",
                nbmot:5
            },
            3:{
                id:3,
                titlequest: "Voici une question à choix unique",
                typequest: "QU",
                reponse:{
                    0: { id: 0,
                        rep:"une premiere reponse"},
                    1: { id: 1,
                        rep:"une seconde reponse"},
                }
            },
            4:{
                id:4,
                titlequest: "Voici une seconde question à choix multiple",
                typequest: "QM",
                reponse:{
                    0: { id: 0,
                        rep:"une premiere reponse"},
                    1: { id: 1,
                        rep:"une seconde reponse"},
                }
            }
        }


    },
    methods: {
        formulaire: function(){
            this.formu="active";
            this.modif="";
            this.upco="";
            this.curentpage="formulaire"
        },
        modification: function(){
            this.upco = " " ;
            this.formu = " " ;
            this.modif = "active";
            this.curentpage = "modification"
        },
        upcoming: function(){
            this.formu=" ";
            this.modif=" ";
            this.upco="active";
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
        },
        subject: function(){
            this.curentpage = "subject";
        }
    }
})
