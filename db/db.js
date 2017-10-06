var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

exports.connect = (url, done) => {
    if (state.db) {
        return done();
    }

    MongoClient.connect(url, (err, database) => {
        if (err) {
            return done(err);
        }
        state.db = database;
        done();
    })
}

exports.get = () =>{
    return state.db;
}