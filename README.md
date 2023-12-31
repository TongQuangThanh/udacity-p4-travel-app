# Travel Weather App - Final Project for Udacity's Front End Web Design Nanodegree

## Description
This project takes a user's destination location and travel dates to return a weather forecast for their trip. There are 3 APIs used:

* [Geonames API](http://www.geonames.org/) - gets latitude and longitude for location
* [Weatherbit API](https://www.weatherbit.io/) - gets weather forecast for the latitude and longitude
* [Pixabay API](https://pixabay.com/)  - gets photo for the location

Local server running on *Node* and *Express* is used.

## Prerequisite
This project runs on a local server. It uses *Node*. If you don't have *Node* already installed on your machine, you can download it [**here**](https://nodejs.org/en/download/).

You must have an API key for each of the 3 APIs above.

After you get your API keys, make a file called *.env* in the project root folder. File should contain:

```
geonames={your username here}
weatherbit={your key here}
pixabay={your key here}
```
There is an included file called *.env-sample*. You may add your keys to this template file, then change its name to *.env*

## Installation
If *Node* is installed, then you can use the *Node Package Manager (npm)* to install the packages needed to run this program. In the terminal, use this command:

```
npm install
```
When those packages have installed, use the following commands to run the development server, build the production, and start the express server, respectively. Note that *dev* runs *webpack-dev-server* and has hot-loading enabled.

```
npm run dev
npm run build
npm run start
```

## Using the App

The server is set to **port 8081**. Start the server with the command in the previous section.

To load the page, set your browser's address bar to:

```
http://localhost:8081/
```

* **City (required)** - The city where you'll travel to, for example:

```
Hanoi
```

* **Start date (required)** - You can choose any date from today until 15 days from now. The weather forecast API has a limit of 16 days, so if your trip departs after this, please check back closer to your start date.
* **End date (required)** - You can enter any date on or after your start date. The limit for the weather forecast is 15 days from today (16 days including today). If your end date is later than that, the forecast won't show those days over 15 from today.

Press the **Submit** button when all data have been entered.

The app returns an image for the destination location.

The app returns a forecast card for each date of the trip, up until a maximum of 15 days after today. Each card contains the following information:

* date
* icon for the weather condition
* text for the weather condition
* high temperature
* low temperature
* relative humidity
* chance of precipitation
* precipitation amount
* snow amount
* wind speed
* wind direction in degrees

The app uses the browser's local storage to save the last set of data that was entered, including the trip destination, photo and weather forecast. This information should load when you come back to the page. It can be overwritten with a new set of data if you enter new values and press the **Submit** button again. If you want to clear the storage and start fresh, click the **Clear Saved Data** button, which will clear local storage and reload the page.

