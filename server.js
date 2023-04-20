const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

app.use(cors())

const animeWatch = {
    "one piece": {
        "currEpisode": 1032,
        "totalEpisodes": 1059,
        "studios": "Toei Production",
    },
    "urusei yatsura (2022)": {
        "currEpisode": 19,
        "totalEpisodes": 23,
        "studios": "David Production"
    },
    "the ice guy and his cool female colleague": {
        "currEpisode": 3,
        "totalEpisodes": 12,
        "studios": "Zero-G, Liber"
    },
    "endo and kobayashi live! the latest on tsundere villainess lieselotte": {
        "currEpisode": 7,
        "totalEpisode": 12,
        "studios": "Tezuka Productions"
    }

}

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/api/:animeName', (request, response) => {
    const animesName = request.params.animeName.toLowerCase()
    if (animeWatch[animesName]) {
        response.json(animeWatch[animesName])
    } else {
        response.json(animeWatch['endo and kobayashi live! the latest on tsundere villainess lieselotte'])
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`The server is running on port ${PORT}! You better go catch it!`)
})