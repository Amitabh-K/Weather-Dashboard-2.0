

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

// current weather

function currentWeather() {

  // retrieving longitude and latitude for subject city
  lat = data.coord.lat
  long = data.coord.lon
  // overwrite current conditions
  document.querySelector("#city").textContent = `${data.name} (${moment().format("MMM Do, YYYY")})`;
  document.querySelector("#temp").textContent = `Temperature: ${data.main.temp.toFixed(1)} ºF`;
  document.querySelector("#humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.querySelector("#wind-speed").textContent = `Wind Speed: ${data.wind.speed} MPH`;
  // jumbotron image change ( image to be added later)
  var currentIcon = data.weather[0].icon;
  document.querySelector(".jumbotron").setAttribute("style", `background-image: url("./assets/images/${weatherImg[currentIcon]}.jpg")`);
  // call UVindex ajax
  UVindexUrl = `${baseUrl}uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;
  ajaxCall(UVindexUrl);
}



// uv inex function

function UVindex() {
  var button = document.querySelector("#uv-button");
  // set colors of button depending on UV-index
  if (data.value < 3) {
    button.className = "btn btn-success btn-lg";
  }
  else if (data.value >= 3 && data.value < 6) {
    button.className = "btn btn-warning btn-lg";
  }
  else if (data.value >= 6 && data.value < 8) {
    button.className = "btn btn-orange btn-lg";
  }
  else if (data.value >= 8 && data.value < 11) {
    button.className = "btn btn-danger btn-lg";
  }
  else if (data.value >= 11) {
    button.className = "btn btn-purple btn-lg";
  }
  button.textContent = data.value;
  // call forecast ajax
  forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  ajaxCall(forecastUrl);
}
