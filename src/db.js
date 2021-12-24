const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tea8a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));
db.on('connected', console.log.bind(console, 'DB connection established'));

const Schema = mongoose.Schema;


const ServerSchema = new Schema({
    guild_id: String,
    prefix: { type: String, default: '~' },
    triggers: [{
        trigger: String,
        response: String,
        whole_word_match: { type: Boolean, default: true }
    }],
    mee6_rank: {
        toggle: { type: Boolean, default: false },
        announce_ch_id: String,
        announce_message: String,
        role_id: String,
        top_user_id: String
    },
    repeats: [{
        ch_id: String,
        secs: Number,
        it_cnt: Number,
        creation_time: Date,
        text: String
    }]
});

const ServerModel = mongoose.model('servers', ServerSchema);

module.exports.ServerModel = ServerModel;