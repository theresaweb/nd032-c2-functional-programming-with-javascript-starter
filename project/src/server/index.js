require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')


const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/marsphotos', async (req, res) => {
    const today = new Date().toISOString().slice(0,10)
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos?earth_date=2020-10-15&api_key=${process.env.API_KEY}`
    try {
        let photos = await fetch(url)
            .then(res => res.json())
        res.send({ photos })
    } catch (err) {
        console.log('error in api: marsphotos error:', err);
    }
})
// example API call
// app.get('/apod', async (req, res) => {
//   console.log('get apod')
//     try {
//         let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ image })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
