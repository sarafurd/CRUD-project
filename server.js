const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 8000

app.use(cors())

const anime = {
    "inuyasha": {
        "mainChars": {
            "Inuyasha": "Half-Dog Yokai",
            "Kagome": "Girl from another world",
            "Sango": "Demon Slayer",
            "Miroku": "Monk",
            "Shippo": "Yoki-fox"
        }
    },
    "fruit basket": {
        "mainChars": {
            "Shigure Soma": "Dog Spirit",
            "Tohru Honda": "main character",
            "Yuki Soma": "Rat Spirit",
            "Kyo Soma": "Cat Spirit"
        }
    },
    "sailor moon": {
        "mainChars": {
            "Usagi Tsukino": "Sailor Moon",
            "Ami Mizuno": "Sailor Mercury",
            "Rei Hino": "Sailor Mars",
            "Makoto Kino": "Sailor Jupiter",
            "Minako Aino": "Sailor Venus",
            "Mamoru Chiba": "Tuxedo Mask"
        }
    },
    "fairy tail": {
        "mainChars": {
            "Gray Fullbuster": "Ice Mage",
            "Lucy Heartfilia": "Celestial Spirit Mage",
            "Natsu Dragneel": "Dragon Slayer",
            "Happy": "Funny Blue Cat",
            "Ezra Scarlet": "Requip Magic",
            "Charles": "Boring white Cat",
            "Wendy Marvell": "Wind Demon Slayer"

        }

    }

}

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/api/:animeName', (request, response) => {
    const animesName = request.params.animeName.toLowerCase()
    if (anime[animesName]) {
        response.json(anime[animesName])
    } else {
        response.json(anime['fruit basket'])
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`The server is running on port ${PORT}! You better go catch it!`)
})