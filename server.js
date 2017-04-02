var mongoService = require('./services/mongo.service').mongoService;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var fs = require("fs");

app.get('/inventory', function (req, res) {
    mongoService.getAllInventories(
        (doc)=>{
            res.status(200);
            res.json(doc);
        }
        ,()=>{
            res.status(404);
            res.send('Not Found')
        });
});

app.post('/inventory', function(req, res){
    if(req.body.name === undefined
        || req.body.quantity === undefined
        || req.body.template === undefined)
    {
        res.status(400);
        res.send("Invalid request body");
    }
    else
    {
        mongoService.addInventory(req.body,
            (doc)=>{
                res.status(201);
                res.json(doc);
            }
            ,(err)=>{
                res.status(500);
                res.send('Internal Server Error');
            });
    }
});

app.get('/inventory/:id', function(req, res){
    var id = req.params.id;
    mongoService.getInventory(id,
        (doc) => {
            res.status(200);
            res.json(doc);
        },
        () => {
            res.status(404);
            res.send('Not Found');
        });
});

app.put('/inventory/:id', function(req, res){
    var id = req.params.id;
    mongoService.updateItemInventory(id, req.body.items,
        () => {
            res.status(204);
            res.send();
        },
        (err) => {
            res.status(500);
            res.send('Internal Server Error');
        });
});

app.delete('/inventory/:id', function(req, res){
    var id = req.params.id;
    mongoService.removeInventory(id, 
        () => {
            res.status(204);
            res.send();
        },
        (err) => {
            res.status(500);
            res.send('Internal Server Error');
        })
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})