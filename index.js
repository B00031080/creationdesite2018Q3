const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("jeux");

    const app = express();
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.get("/game", function (req, res) {
        res.render('game', {});
    } );

    app.post("/gameresult", function (req, res) {
        let numberUser1 = parseInt(req.body.numberUser1);
        let numberUser2 = parseInt(req.body.numberUser2);
        let numberComputer = parseInt(Math.random()*100);
        let winningUser = (Math.abs(numberUser1 - numberComputer)<Math.abs(numberUser2 - numberComputer))?"User 1":"User 2";
        dbo.collection("parties").insertOne({player1:numberUser1,player2:numberUser2, computer:numberComputer}, function(err, result) {
            res.render('gameresult', {numberUser1, numberUser2, numberComputer, winningUser});
        });
    } );

    app.get('/result', function (req, res) {
        dbo.collection("parties").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.render('result', {result:result});
          });
    });


    app.get('/', function (req, res) {
        res.render('home', {maintenant: (new Date()).toLocaleTimeString(), students: [{name:"Marie","sex":"female"},{"name":"Joseph","sex":"male", honors:true},{"name":"Pierre","sex":"male"}]});
    });

    app.get('/produits/:category', function (req, res) {
        let products = [];
        if(req.params.category === "mobile"){
            products = [{title:"iPhone X", description:"Cool and expensive"},{title:"Samsung S9", description:"Cool and less expensive"},{title:"OnePlus 6", description:"Cheap"}]
        } else if(req.params.category === "cheese"){
            products = [{title:"Compté", description:"Savoureux"},{title:"Emmental", description:"Fondant"},{title:"Camembert", description:"Odorant"}]
        }

        res.render('produit', {products:products});
    });

    app.get('/mapage', (req, res) => res.send('Tu ne devrais pas être là!!!'));
    app.use(express.static('client'));

    app.listen(3000, () => console.log('Example app listening on port 3000!'));

});