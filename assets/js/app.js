var lat;
var long;
var apiKey = "42289ea57481ffa0e2b1aa22ae9c2d55";

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
getLocation();

