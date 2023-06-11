/**
 * Updates the UI elements
 * @param {object} bigData data acquired so far from user and APIs
 */
export function updateUI(bigData) {

    // Countdown display
    let messageEnd;
    if (bigData.userData.timeUntilTrip == 0) {
        messageEnd = "is today! Are you ready to go?";
    } else if (bigData.userData.timeUntilTrip == 1) {
        messageEnd = "is tomorrow! Are you packed?";
    } else {
        messageEnd = `is coming up in ${bigData.userData.timeUntilTrip} days!`;
    }
    document.getElementById('result').innerHTML = `You want to go to ${bigData.userData.city}?`;
    document.getElementById('forecast-title').innerHTML = "Here is the forecast for your trip:";

    // Image of the location
    const locationImage = document.createElement('img');
    locationImage.src = bigData.photo;
    locationImage.alt = `Photo taken in ${bigData.userData.city}`;
    locationImage.height = 225;
    locationImage.width = 300;
    const imageContainer = document.getElementById('location-image-container');

    // Clears previous image (if any) and adds new one
    // Multiple images will pile up if not cleared
    imageContainer.innerHTML = "";

    // Create document fragment to add to true DOM all at once
    // This is better performance, each add to DOM has a cost
    let fragment = document.createDocumentFragment();
    fragment.append(locationImage);
    fragment = document.createDocumentFragment();

    // Make a card with message if user leaves today but it's already 
    // tomorrow's date at destination so no forecast available
    if (bigData.departFinishedAtDestination) {
        // Create the card div, data will append to this
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = "<h3>Today's date in your local time is already finished at the destination, so no forecast for today.</h3>";
        fragment.append(forecastCard);
    }
    if (bigData.returnFinishedAtDestination) {
        const forecastCardContainer = document.getElementById('forecast-card-container');
        forecastCardContainer.innerHTML = "";
        forecastCardContainer.append(fragment);
        return;
    }
    const forecasts = bigData.forecastData;

    // Create a forecast card for each day in the trip
    for (const forecast of forecasts) {
        const forecastCard = Client.createForecastCard(forecast, bigData.userData.units);

        // Append the card to the fragment for now, leave the DOM alone
        fragment.append(forecastCard);
    }

    // Clear any old data from the card container and add new cards to true DOM
    const forecastCardContainer = document.getElementById('forecast-card-container');
    forecastCardContainer.innerHTML = "";
    forecastCardContainer.append(fragment);
}
