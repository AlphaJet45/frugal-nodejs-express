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

// Pour modéliser les données, le framework mongoose utilise des "schémas" ; nous créons donc un modèle de données :
let piscineSchema = mongoose.Schema({
    nom: String,
    adresse: String,
    tel: String,
    description: String
});
let Piscine = mongoose.model('Piscine', piscineSchema);

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
.get(function(req, res){
    // Utilisation de notre schéma Piscine pour interrogation de la base
    Piscine.find(function(err, piscines){
        if (err){
            res.send(err);
        }
        res.json(piscines);
    })
})

.post(function(req, res){
    let piscine = new Piscine();
    piscine.nom = req.body.nom;
    piscine.adresse = req.body.adresse;
    piscine.tel = req.body.tel;
    piscine.description = req.body.description;
    // Nous stockons l'objet en base
    piscine.save(function(err){
        if (err){
            res.send(err);
        }
        res.send({message: "Bravo, la piscine est maintenant stockée en base de données"});
    })
})

myRouter.route('/piscines/:piscine_id')
.get(function(req, res) {
    Piscine.findById(req.params.piscine_id, function(err, piscine){
        if (err){
            res.send(err);
        }
        res.json(piscine);
    });
})

.put(function(req, res){
    Piscine.findById(req.params.piscine_id, function(err, piscine){
        if (err){
            res.send(err);
        }
        // Mise à jour des données de la piscine
        piscine.nom = req.body.nom;
        piscine.adresse = req.body.adresse;
        piscine.tel = req.body.tel;
        piscine.description = req.body.description;
        
        piscine.save(function(err){
            if (err){
                res.send(err);
            }
            res.json({message: "Bravo, mise à jour des données OK"});
        });
    });
})

.delete(function(req, res){
    Piscine.remove({_id: req.params.piscine_id}, function (err, piscine){
        if (err){
            res.send(err);
        }
        res.json({message: "Bravo, piscine supprimée"});
    });
});


// Démarrer le serveur 
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port+"\n"); 
});