// This package calculates the time between now and another date/time
const countdown = require('countdown');

/**
 * Responds to user input form submit button click
 * Processes initial data, calls apiCalls function and updateUI function
 * @param {click event} event User presses submit button on form
 */
export async function submitted(event) {
    // Prevents page reloading when button is clicked
    event.preventDefault();

    // Initialize error and result fields
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = "";
    document.getElementById('forecast-card-container').innerHTML = "<div class='text-center'>Loading</div>";
    document.getElementById('result').innerHTML = "";
    document.getElementById('location-image-container').innerHTML = "";
    document.getElementById('forecast-title').innerHTML = "";

    // City
    const city = document.getElementById('city').value;
    if (city == "") {
        errorMessage.innerHTML = "Please enter a city";
        return;
    }

    // Start date
    const startDate = document.getElementById('start-date').value;
    if (startDate == "") {
        errorMessage.innerHTML = "Please enter a start date";
        return;
    }

    // End date
    // Not required, will just give full forecast results if left blank
    const endDate = document.getElementById('end-date').value;
    if (endDate == "") {
        errorMessage.innerHTML = "Please enter a end date";
        return;
    }

    const timeUntilTrip = getTimeUntilDate(startDate);
    const timeUntilReturn = getTimeUntilDate(endDate);

    const tripDuration = timeUntilReturn - timeUntilTrip;
    if (tripDuration < 0) {
        errorMessage.innerHTML = "End date can't be before start date";
        return;
    }

    // For temperature, wind speed and precipitation amount
    const units = "M";

    // Initialize bigData object with user's input and calculations above
    let bigData = {};
    bigData["userData"] = { city, startDate, endDate, timeUntilTrip, timeUntilReturn, tripDuration, units };
    console.log(bigData);

    // Calls the API function, then updates the UI if all connections succeeded
    bigData = await Client.apiCalls(bigData);
    // If connections didn't succeed, null is returned, so checking for that
    if (bigData != null) {
        Client.updateUI(bigData);

        // Add all data to local storage
        localStorage.setItem('bigData', JSON.stringify(bigData));
    }
}

export function getTimeUntilDate(date) {
    const todayMilliseconds = (new Date()).setHours(1);
    const dateMilliseconds = (new Date(date)).setHours(1);
    const timeUntilDate = countdown(todayMilliseconds, dateMilliseconds, countdown.DAYS).days;
    return timeUntilDate;
}
