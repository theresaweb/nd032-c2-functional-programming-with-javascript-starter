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
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.query.rover}/photos?earth_date=2020-10-15&api_key=${process.env.API_KEY}`
    //console.log('url',url)
    try {
        let photos = await fetch(url)
            .then(res => res.json())
        res.send({ photos })
    } catch (err) {
        console.log('error in api: marsphotos error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
