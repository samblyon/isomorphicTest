var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var url = 'mongodb://localhost:27017/guruSam'

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully!");
  getUsersAndFruits(db);
  // dbSeed(db);
});

function getUsersAndFruits(db){
  var result = db.users
  // aggregate([
  //   {
  //     $lookup:
  //       {
  //         from: "users",
  //         localField: "name",
  //         foreignField: "fruit",
  //         as: "user_fruit"
  //       }
  //   }
  // ]);
  console.log(result)
}

function eatIfYummy(db){
  var collectionName = 'fruit';
  var updateParams = {
    $set: {eaten: false},
    $currentDate: {lastModified: true}
  }
  updateDoc(collectionName, {}, updateParams, db, function(){
    find(collectionName, db, function(){
      db.close();
    });
  })
  var condition = {'ripe.yummy': true};
  updateParams = {
    $set: {eaten: true},
    $currentDate: {lastModified: true}
  }
  updateDoc(collectionName, condition, updateParams, db, function(){
    find(collectionName, db, function(){
      db.close();
    });
  })
}

function wipe(db){
  var collectionName = 'fruit';
  var condition = {};
  removeDocs(db, collectionName, condition, function(){
    console.log("removed " + collectionName + " docs");
  });
  collectionName = 'users';
  removeDocs(db, collectionName, condition, function(){
    console.log("removed " + collectionName + " docs");
  });
}

function seedUsers(db){
  var collectionName = 'users'
  var users = ["guru", "sam", "travis"].map(function(username){
    var fruit = ["apple", "pear", "banana"];
    var user = {
      name: username,
      fruit: fruit[Math.round(Math.random() * 2)]
    }
    return user;
  });
  insert(collectionName, users, db, function(){
    find(collectionName, db, function(){
      db.close();
    });
  });
}

function seedFruit(db){
  var collectionName = 'fruit'
  var fruits = ["apple", "pear", "banana"].map(function(fruitName){
    var fruit = {
      name: fruitName,
      ripe: {
        yummy: false
      }
    }
    return fruit;
  });
  insert(collectionName, fruits, db, function(){
    find(collectionName, db, function(){
      db.close();
    });
  });
}

function dbSeed(db){
  wipe(db);
  seedFruit(db);
  seedUsers(db);
}

function insert(collectionName, documents, db, callback) {
  var collection = db.collection(collectionName);

  collection.insertMany(documents, function(err, result) {
    assert.equal(err, null);
    assert.equal(documents.length, result.result.n);
    assert.equal(documents.length, result.ops.length);
    console.log("inserted docs!");
    console.log(result);
    callback(result);
  })
}

function find(collectionName, db, callback) {
  var collection = db.collection(collectionName);
  collection.find({}).toArray(function(err, docs){
    assert.equal(err, null);
    console.log("found...");
    console.log(docs);
    callback(docs);
  })
}

function removeDocs(db, collectionName, condition, callback){
  var collection = db.collection(collectionName);
  collection.deleteMany(condition, function(err, results){
    // console.log(results);
    callback(results);
  });
}

function updateDoc(collectionName, condition, updateParams, db, callback){
  db.collection(collectionName).updateMany(
    condition,
    updateParams,
    function(err, results){
      console.log(results);
      callback();
    }
  );
}
