// L'application requiert l'utilisation du module Express.
// La variable express nous permettra d'utiliser les fonctionnalités du module Express.  
let express = require('express'); 
let bodyparser = require('body-parser');

// Nous définissons ici les paramètres du serveur.
let hostname = 'localhost'; 
let port = 3000; 

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