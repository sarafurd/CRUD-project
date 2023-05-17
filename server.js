const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const PORT = 4000;
require('dotenv').config();

let db;
const dbConnectionStr = process.env.DB_STRING;
const dbName = 'anime';

const connectToDb = async() => {
    const client = await MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true });
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
};

connectToDb().then(() => {
    app.listen(process.env.PORT || PORT, () => {
        console.log(`The server is running on port ${PORT}! You better go catch it!`);
    });
}).catch((error) => {
    console.error('Error connecting to database:', error);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (request, response) => {
    db.collection('animes')
        .find()
        .sort({ likes: -1 })
        .toArray()
        .then(data => {
            response.render('index.ejs', { info: data });
        })
        .catch(error => console.error(error));
});

app.post('/addAnime', (request, response) => {
    const anime = {
        animeName: request.body.animeName,
        desc: request.body.desc,
        id: request.body.id
    };

    db.collection('animes')
        .insertOne(anime)
        .then(result => {
            console.log('Anime Added');
            response.redirect('/');
        })
        .catch(error => console.error(error));
});

app.delete('/deleteAnime/:animeId', (req, res) => {
    const animeId = req.params.animeId;
    if (!animeId) {
        return res.status(400).json({ error: 'Missing animeId parameter' });
    }

    // Convert the animeId string to an ObjectId
    const objectId = new ObjectId(animeId);

    db.collection('animes')
        .deleteOne({ _id: objectId })
        .then(result => {
            console.log('Anime Deleted');
            res.json({ message: 'Anime deleted successfully' });
        })
        .catch(error => console.error(error));
});

app.put('/updateAnime/:animeId', (req, res) => {
    const animeId = req.params.animeId;
    const newAnimeName = req.body.animeName;
    const newDesc = req.body.desc;

    console.log('animeId:', animeId);
    console.log('newAnimeName:', newAnimeName);
    console.log('newDesc:', newDesc);

    // Convert the animeId string to an ObjectId
    const objectId = new ObjectId(animeId);

    console.log('objectId:', objectId);

    // Perform the update operation based on the converted objectId
    db.collection('animes')
        .updateOne({ _id: objectId }, { $set: { animeName: newAnimeName, desc: newDesc } })
        .then(result => {
            console.log('Anime Updated');
            res.json({ success: true, message: 'Anime updated successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ success: false, message: 'Failed to update anime' });
        });
});