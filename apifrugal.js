// L'application requiert l'utilisation du module Express.
// La variable express nous permettra d'utiliser les fonctionnalités du module Express.  
let express = require('express'); 
let bodyparser = require('body-parser');

// Nous définissons ici les paramètres du serveur.
let hostname = 'localhost'; 
let port = 3000; 

// La variable mongoose nous permettra d'utiliser les fonctionnalités du module mongoose
let mongoose = require('mongoose');
// Ces options sont recommandées par mLab pour une connexion à la base
let options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } };

// URL de notre base
let urlmongo = "mongodb://userfrugal:passwordfrugal1@ds127115.mlab.com:27115/restfrugaldb";

// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function() {
    console.log('Connexion à la base OK');
});

// Nous créons un objet de type Express.
let app = express(); 

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// Afin de faciliter le routage (les URLs que nous souhaitons prendre en charge dans notre API)
// C'est à partir de cet objet myRouter que nous allons implémenter les méthodes
let myRouter = express.Router();
// Pour que l'application utilise notre routeur
app.use(myRouter);

// Route pour la page d'accueil
myRouter.route('/')
.all(function(req, res){
    res.json({message: "Bienvenue sur notre Frugal API", methode: req.method});
});

myRouter.route('/piscines')
// Méthode GET
.get(function(req, res){
    res.json({
        message: "Liste toutes les piscines de Lille Métropole",
        ville: req.query.ville,
        nbResultats: req.query.maxresultat,
        methode: req.method
    });
})
// Méthode POST
.post(function(req, res){
    res.json({
        message : "Ajoute une nouvelle piscine à la liste", 
        nom: req.body.nom, 
        ville: req.body.ville, 
        taille: req.body.taille,
        methode: req.method
    });
})
// Méthode PUT
.put(function(req, res){
    res.json({message: "Mise à jour des informations d'une piscine dans la liste", methode: req.method});
})
// Méthode DELETE
.delete(function(req, res){
    res.json({message: "Suppression d'une piscine dans la liste", methode: req.method});
});

myRouter.route('/piscines/:piscine_id')
.get(function(req, res) {
    res.json({message: "Vous souhaitez accéder aux informations de l'API n°" + req.params.piscine_id});
})
.put(function(req, res){
    res.json({message: "Vous souhaitez modifier les informations de la piscine n°" + req.params.piscine_id});
})
.delete(function(req, res){
    res.json({message: "Vous souhaitez supprimer la piscine n°" + req.params.piscine_id});
});




// Démarrer le serveur 
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port+"\n"); 
});