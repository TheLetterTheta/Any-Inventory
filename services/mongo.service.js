var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/any-inventory';

function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}

function getAllInventories(db, callback, notFoundCallback) {
    var cursor = db.collection('inventory').find({},{name: 1, quantity: 1, lastModifiedDate: 1});
    cursor.toArray(function(err, doc){
        assert.equal(err, null);
        
        if(doc != null && doc.length !== 0){
            callback(doc)
        }else{
            notFoundCallback();
        }

    });
}

function addInventory(db, inventory, callback, errorCallback){
    var promise = db.collection('inventory').save(
        {
            name: inventory.name, 
            quantity: inventory.quantity, 
            template: inventory.template,
            lastModifiedDate: new Date()
        });
    promise.then((item) =>{
        var doc = item.ops[0];
        callback(doc);
    },(error)=>{
        errorCallback(error);
    });
}

function getInventory(db, id, success, notFound){
    var cursor = db.collection('inventory').find({_id: ObjectId(id)});
    cursor.toArray(function(err, doc){
        assert.equal(err, null);

        if(doc != null && doc.length != 0){
            success(doc[0]);
        }else{
            notFound();
        }
    });
}

function updateItemInventory(db, inventoryId, items, callback, errorCallback){
    var promise = db.collection('inventory').update(
        {_id: ObjectId(inventoryId)},
        {$set : {items : items,
                quantity: items.length}});
    promise.then(() => {
        callback();
    },(err) => {
        errorCallback(err);
    })
}

function removeInventory(db, inventoryId, callback, errorCallback){
    var promise = db.collection('inventory').remove(
        {_id : ObjectId(inventoryId)});
    promise.then(() => {
        callback();
    },
    (err) => {
        errorCallback(err);
    });
}

class mongoService{
    getAllInventories(callback, notFoundCallback){
        MongoClient.connect(url, function(err, db){
            assert.equal(err, null);
            return getAllInventories(db, callback, notFoundCallback);
        });
    }
    addInventory(inventory,callback,errorCallback){
        MongoClient.connect(url, function(err, db){
            assert.equal(err, null);
            return addInventory(db,inventory,callback, errorCallback)
        });
    }
    getInventory(id, success, notFound){
        MongoClient.connect(url, function(err, db){
            assert.equal(err, null);
            return getInventory(db, id, success, notFound);
        })
    }
    updateItemInventory(inventoryId, items, callback, errorCallback){
        MongoClient.connect(url, function(err, db){
            assert.equal(err, null);
            return updateItemInventory(db, inventoryId, items, callback, errorCallback);
        });
    }
    removeInventory(inventoryId, callback, errorCallback){
        MongoClient.connect(url, function(err, db){
            assert.equal(err, null);
            return removeInventory(db, inventoryId, callback, errorCallback);
        });
    }
}

exports.mongoService = new mongoService();