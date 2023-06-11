// Dotenv package allows environment variables to protect API keys
const dotenv = require('dotenv')
dotenv.config()

// .env file
// geonames=tongquangthanh1994
// weatherbit=a9d99dbe44ec4ead9f2b5ec9da72a171
// pixabay=37194223-f0c50a500d547057d390fba6a

// Set URL pieces for 3 APIs
const GEONAMES_ROOT = "http://api.geonames.org/wikipediaSearchJSON?q="
const GEONAMES_KEY_URL = `&username=${process.env.geonames}`
const GEONAMES_PARAMS = "&maxRows=1"

const WEATHERBIT_ROOT = "https://api.weatherbit.io/v2.0/forecast/daily?"
const WEATHERBIT_KEY_URL = `&key=${process.env.weatherbit}`
const WEATHERBIT_PARAMS = "&units="

const PIXABAY_ROOT = "https://pixabay.com/api/?q="
const PIXABAY_KEY_URL = `&key=${process.env.pixabay}`
const PIXABAY_PARAMS = "&image_type=photo&orientation=horizontal&safesearch=true&per_page=100"

// Initialise object that will store all user/API data on server side
const bigData = []

// All required server boilerplate
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()

app.use(cors())
app.use(express.static('dist'))

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json())

// This is for testing server endpoints with Jest and Supertest packages
module.exports = app

// Serves the main page to browser
app.get('/', (req, res) => res.sendFile('dist/index.html'))

// Endpoint for the GeoNames API
app.post('/getGeolocation', getGeolocation)

async function getGeolocation(req, res) {
    const city = req.body.userData.city
    const GeoNamesURL = GEONAMES_ROOT + city + GEONAMES_KEY_URL + GEONAMES_PARAMS;
    try {
        const response = await fetch(GeoNamesURL)
        // Checks for failed data transfer from API, returns null
        if (!response.ok) {
            console.error(`Error connecting to GeoNames API. Response status ${response.status}`)
            res.send(null)
        }
        const responseJSON = await response.json()
        res.send(responseJSON)
        // If failed connection to API, return null
    } catch (error) {
        console.error(`Error connecting to server: ${error}`)
        res.send(null)
    }
}

// Endpoint for the Weatherbit API
app.post('/get-weather', callWeather)

async function callWeather(req, res) {
    const latitude = req.body.cityData.latitude
    const longitude = req.body.cityData.longitude
    const locationURL = `lat=${latitude}&lon=${longitude}`
    const units = req.body.userData.units
    const weatherbitURL = WEATHERBIT_ROOT + locationURL + WEATHERBIT_KEY_URL + WEATHERBIT_PARAMS + units
    try {
        const response = await fetch(weatherbitURL)
        // Checks for failed data transfer from API, returns null
        if (!response.ok) {
            console.error(`Error connecting to Weatherbit API. Response status ${response.status}`)
            res.send(null)
        }
        const responseJSON = await response.json()
        res.send(responseJSON)
        // If failed connection to API, return null
    } catch (error) {
        console.error(`Error connecting to server: ${error}`)
        res.send(null)
    }
}

// Endpoint for the Pixabay API
app.post('/get-photo', callPhoto)

async function callPhoto(req, res) {
    const city = req.body.userData.city
    let pixabayURL = PIXABAY_ROOT + city + PIXABAY_KEY_URL + PIXABAY_PARAMS
    try {
        let response = await fetch(pixabayURL)
        // Checks for failed data transfer from API, returns null
        if (!response.ok) {
            console.error(`Error connecting to Pixabay API. Response status ${response.status}`)
            res.send(null)
        }
        let responseJSON = await response.json()

        // If no photo was returned for city, get one for the country instead
        if (responseJSON.total == 0) {
            const country = req.body.cityData.country
            pixabayURL = PIXABAY_ROOT + country + PIXABAY_KEY_URL + PIXABAY_PARAMS
            response = await fetch(pixabayURL)
            // Checks for failed data transfer from API, returns null
            if (!response.ok) {
                console.error(`Error connecting to Pixabay. Response status ${response.status}`)
                res.send(null)
            }
            responseJSON = await response.json()
        }

        res.send(responseJSON)
        // If failed connection to API, return null
    } catch (error) {
        console.error(`Error connecting to server: ${error}`)
        res.send(null)
    }
}

// Endpoint for the data storage route
app.post('/store-data', storeData)

function storeData(req, res) {
    bigData.push(req.body);
    res.send({ message: "Data received and stored" });
}


// Designates what port the app will listen to for incoming requests
const port = 8081;
app.listen(port, () => console.log(`Travel weather app listening on port ${port}!`));

