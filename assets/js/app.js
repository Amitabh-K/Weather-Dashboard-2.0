

// user’s current location with window.navigator.geolocation.

function getLocation() {
  window.navigator.geolocation.getCurrentPosition(function (position) {
    document.querySelector("#loading-column").classList.remove("d-none");
    long = position.coords.longitude;
    lat = position.coords.latitude;
    console.log("Latitude: " + lat + " Longitude " + long)
    // currentWeather ajax call
    currentWeatherUrl = `${baseUrl}weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
    ajaxCall(currentWeatherUrl);
  })
}
//calling geolocation
getLocation();

//run AJAX call
var lat;
var long;
var apiKey = "42289ea57481ffa0e2b1aa22ae9c2d55";
var baseUrl = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/"
var currentWeatherUrl;
var UVindexUrl;
var forecastUrl;

// data stored the ajaxCall response

var data;
// fill in  current location

function ajaxCall(x) {
  $.ajax({
    url: x,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    data = response;
    if (data.coord) {
      console.log("current weather call");
      currentWeather();
    }
    else if (data.lat) {
      console.log("UV index call");
      UVindex();
    }
    else if (data.cod) {
      console.log("forecast call");
      forecast();
    }
  });
}