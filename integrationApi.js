/*
* BigPanda integration APIs
*
*/


// Express library
let express = require('express');

// Request library to help with calling external APIs
let requestLib = require("request");


/*
 *
 * Helper function to get a location key from searching an AccuWeather location.
 * Pass in the AccuWeather API Key and a search query (e.g. a city) and in the return response
 * will be a locationKey that can be used to get current conditions.
 *
 */
async function searchAccuWeatherLocations(req, res, next) {
	// Use request to call the AccuWeather text search API
	let getResponse = await requestLib.get({
		"headers": {
			"content-type": "application/json",
			"Authorization": req.access_token
		},
		"url": "https://dataservice.accuweather.com/locations/v1/search",
		"body": JSON.stringify({
			"apikey": req.body.accuWeatherApiKey,  // AccuWeather API Key
			"q": req.body.q  // The text query to search
			"language": req.body.language,
			"details": req.body.details,
			"offset": req.body.offset,
			"alias": req.body.alias
		})
	}, (error, responseBody) => {
		if(error) {
			console.log(`Error searching location information. Status: ${error.status}. Message: ${error.message}`);
			return next(error);
		}

		let response = JSON.parse(responseBody.body);
		console.log(`Location information found for ${q}.`);
		return res.status(200).json({ "locationKey": response.Key });
	});
}


/*
 *
 * Helper function to get current conditions for a specific AccuWeather location. Using the accuWeatherLocationKey from
 * the searchAccuWeatherLocations() function as well as the accuWeatherApiKey, we can get the current conditions.
 * That information will be returned and put into the Big Panda alert.
 *
 */
async function getCurrentConditions(req, res, next, accuWeatherLocationKey) {
	// Use request to call the AccuWeather GET Current Conditions API
	let getResponse = await requestLib.get({
		"headers": {
			"content-type": "application/json",
			"Authorization": req.access_token
		},
		"url": `https://dataservice.accuweather.com/currentconditions/v1/${accuWeatherLocationKey}`,
		"body": JSON.stringify({
			"apikey": req.body.accuWeatherApiKey,  // AccuWeather API Key
			"language": req.body.language,
			"details": req.body.details
		})
	}, (error, responseBody) => {
		if(error) {
			console.log(`Error getting current conditions for ${req.body.locationKey}. Status: ${error.status}. Message: ${error.message}`);
			return next(error);
		}

		let response = JSON.parse(responseBody.body);
		console.log(`Current conditions found for $req.body.locationKey}`);
		return res.status(200).send(response.body); // returns the current conditions
	});
}


/*
*
* API that posts a Big Panda alert into the dashboard. After getting a location key from AccuWeather search and then getting
* current conditions for that location, that information is then sent as an alert to the Big Panda dashboard.
*
*/
exports.postBigPandaAlert = async function postBigPandaAlert(req, res, next) {
	// First get the locationKey 
	try {
		let accuWeatherLocationKey = await searchAccuWeatherLocations(req, res, next);
	} catch (error) {
		if (error) {
			console.log(`Error searching location information. Status: ${error.status}. Message: ${error.message}`);
			return next(error);
		}
	}

	// Using the locationKey, get the currentConditions for that location
	try {
		let currentConditions = await getCurrentConditions(req, res, next, accuWeatherLocationKey);
	} catch (error) {
		if (error) {
			console.log(`Error getting current conditions for ${req.body.locationKey}. Status: ${error.status}. Message: ${error.message}`);
			return next(error);
		}
	}


	// Use request to call the Big Panda POST Alerts API
	await requestLib.post({
		"headers": {
			"content-type": "application/json",
			"Authorization": req.access_token
		},
		"url": "https://api.bigpanda.io/data/v2/alerts",
		"body": JSON.stringify({
			"app_key": req.body.panda_app_key,  //Big Panda App Key
			"status": req.body.status,
			"host": req.body.host,
			"timestamp": req.body.timestamp,
			"check": req.body.check,
			"description": req.body.description,
			"cluster": req.body.cluster,
			// additional attributes (the information from the currentConditions)
			"LocalObservationDateTime": currentConditions.LocalObservationDateTime,
			"WeatherText": currentConditions.WeatherText,
			"Temperature.Metric.Value": currentConditions.Temperature.Metric.Value,
			"Temperature.Metric.Unit": currentConditions.Temperature.Metric.Unit,
			"Wind.Speed": currentConditions.Wind.Speed,
			"Visibility": currentConditions.Visibility,
			"CloudCover": currentConditions.CloudCover,
			"PrecipitationSummary.Past3Hours": currentConditions.PrecipitationSummary.Past3Hours,
			"MobileLink": currentConditions.MobileLink,
			"Link": currentConditions.Link
		})
	}, (error, responseBody) => {
		if(error) {
			console.log(`Error posting Big Panda alert. Status: ${error.status}. Message: ${error.message}`);
			return next(error);
		}

		let response = JSON.parse(responseBody.body);
		console.log("Successfully posted Big Panda alert!");
		return res.status(201).send();
	});
}
