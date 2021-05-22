const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tea8a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));
db.on('connected', console.log.bind(console, 'DB connection established'));

const Schema = mongoose.Schema;


const ServerSchema = new Schema({
    guild_id: String,
    triggers: [{
        trigger: String,
        response: String
    }]
});

const ServerModel = mongoose.model('servers', ServerSchema);

module.exports.ServerModel = ServerModel;