const fetch = require('node-fetch');

/**
 * Calls the 3 APIs, adds their output to bigData object
 * @param {object} bigData data acquired so far from user and APIs
 */
export async function apiCalls(bigData) {

    // Error message DOM element and message for failure to connect
    const errorMessage = document.getElementById('error-message');
    const serverError = "Couldn't connect to server. Try again later.";

    // Calls the Geonames API, checks result for failure to connect
    // or user input city not returning any matches
    // Assigns result to cityData key in bigData object
    const geoNamesData = await callServer('getGeolocation', bigData);
    if (geoNamesData == null) {
        errorMessage.innerHTML = serverError;
        return null;
    } else if (geoNamesData.geonames.length == 0) {
        errorMessage.innerHTML = `The lookup service can't find ${bigData.userData.city}. Please check the spelling and try again.`;
        return null
    }
    bigData["cityData"] = Client.extractCityData(geoNamesData);

    // Calls the Weatherbit API, checks result for failure to connect
    // Assigns result to forecastData key in bigData object
    const weatherBitData = await callServer('get-weather', bigData);
    if (weatherBitData == null) {
        errorMessage.innerHTML = serverError;
        return null;
    }
    bigData["forecastData"] = Client.extractForecastData(weatherBitData, bigData);

    // Calls the Pixabay API, checks result for failure to connect
    // Assigns result URL to photo key in bigData object
    const photoData = await callServer('get-photo', bigData);
    if (photoData == null) {
        errorMessage.innerHTML = serverError;
        return null
    }
    bigData["photo"] = Client.extractMostLikedPhoto(photoData);
    bigData["photoData"] = photoData;

    // Calls the store data route to store bigData in server variable
    const storeMessage = await callServer('store-data', bigData);

    // Return modified bigData object
    return bigData;
}

/**
 * Calls the server side routes
 * @param {string} url Contains the route to server
 * @param {object} bigData data acquired so far from user and APIs
 */
export async function callServer(url, bigData) {
    try {
        const response = await fetch(`http://localhost:8081/${url}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // Body data type must match "Content-Type" header        
            body: JSON.stringify(bigData)
        })
        // Return null if server route was not found
        if (!response.ok) {
            console.error(`Error connecting to http://localhost:8081/${url}. Response status ${response.status}`);
            return null;
        }
        const responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
        // Return null if can't connect to server at all (eg. it's turned off)
    } catch (error) {
        console.error(`Error connecting to server: ${error}`);
        return null;
    }
}
