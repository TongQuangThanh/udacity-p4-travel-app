/**
 * Extracts only 4 pieces of information from GeoNames API data
 * @param {object} geoNameData Data returned from GeoNames API
 */
export function extractCityData(geoNamesData) {
    const longitude = geoNamesData.geonames[0].lng
    const latitude = geoNamesData.geonames[0].lat
    const country = geoNamesData.geonames[0].countryName
    const population = geoNamesData.geonames[0].population

    return { latitude, longitude, country, population }
}

/**
 * Extracts only desired forecast information from larger Weather bit API data
 * @param {object} weatherBitData Data returned from Weather bit API
 * @param {integer} timeUntilTrip Number of days until trip start date
 * @param {integer} timeUntilReturn Number of days until trip end date
 */
export function extractForecastData(weatherBitData, bigData) {

    // An array to hold objects each representing 1 day of forecast data
    const forecastData = []

    // Define these here just to shorten the references to them
    let timeUntilTrip = bigData.userData.timeUntilTrip
    let timeUntilReturn = bigData.userData.timeUntilReturn
    const startDate = bigData.userData.startDate

    // Checks if there is a mismatch between local time of user and local time 
    // at destination, adjusts dates accordingly
    bigData["departFinishedAtDestination"] = false
    bigData["returnFinishedAtDestination"] = false
    if (!(startDate == weatherBitData.data[timeUntilTrip].valid_date)) {
        // If start date matches the next element in the forecast array, 
        // then current local date is 1 day behind user's date, and should
        // start at next element in the array
        if (startDate == weatherBitData.data[timeUntilTrip + 1].valid_date) {
            timeUntilTrip += 1
            timeUntilReturn += 1
            // Otherwise current local date must be 1 date after user's date
        } else {
            if (timeUntilTrip > 0) {
                timeUntilTrip -= 1
            } else {
                // User leaves today but today's date is finished
                // at destination
                bigData.departFinishedAtDestination = true
            }
            if (timeUntilReturn > 0) {
                timeUntilReturn -= 1
            } else {
                // User returns today but today's date is finished
                // at destination
                bigData.returnFinishedAtDestination = true
            }
        }
    }

    // counter max is 15 because API currently returns max 16 days data
    let lastForecastDay = 15
    if (timeUntilReturn < 15) {
        lastForecastDay = timeUntilReturn
    }
    // Grab the weather information out of larger data 
    for (let i = timeUntilTrip; i <= lastForecastDay; i++) {
        const date = weatherBitData.data[i].valid_date
        const windSpeed = weatherBitData.data[i].wind_spd
        const windDirection = weatherBitData.data[i].wind_dir
        const highTemperature = weatherBitData.data[i].high_temp
        const lowTemperature = weatherBitData.data[i].low_temp
        const chancePrecipitation = weatherBitData.data[i].pop
        const precipitation = weatherBitData.data[i].precip
        const snow = weatherBitData.data[i].snow
        const humidity = weatherBitData.data[i].rh
        const description = weatherBitData.data[i].weather.description
        const icon = weatherBitData.data[i].weather.icon

        // Add an object containing all extracted weather information for this 
        // day to the array above
        forecastData.push({ date, windSpeed, windDirection, highTemperature, lowTemperature, chancePrecipitation, precipitation, snow, humidity, description, icon })
    }
    return forecastData
}

