

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


// five day forecast
function forecast() {
  // clear previous forecast cards in deck
  clearChildren();
  // loop to dynamically generate each forecast card within deck
  for (var i = 4; i < data.list.length; i += 8) {
    var div1 = document.createElement("div");
    div1.className = "card bg-light";
    document.querySelector(".card-deck").appendChild(div1);
    var div2 = document.createElement("div");
    div2.className = "card-body";
    div1.appendChild(div2);
    var text1 = document.createElement("h5");
    text1.className = "card-title";
    text1.textContent = `${data.list[i].dt_txt.slice(5, 7)}/${data.list[i].dt_txt.slice(8, 10)}/${data.list[i].dt_txt.slice(0, 4)}`;
    div2.appendChild(text1);
    var icon = document.createElement("h3");
    var iconNumber = data.list[i].weather[0].icon
    icon.className = weatherIcon[iconNumber];
    div2.appendChild(icon);
    var text2 = document.createElement("h6");
    text2.className = "text-muted";
    text2.textContent = `Temp: ${data.list[i].main.temp.toFixed(1)} ºF`;
    div2.appendChild(text2);
    var text3 = document.createElement("h6");
    text3.className = "text-muted";
    text3.textContent = `Humidity: ${data.list[i].main.humidity}%`;
    div2.appendChild(text3);
  }

// show weather information
document.querySelector("#current-weather-column").classList.remove("d-none");
// clear children of search button and generate search icon
clearSearchButton();
var searchIcon = document.createElement("i");
searchIcon.className = "fas fa-search";
searchBtn.appendChild(searchIcon);
}


// icons equivalent to openweathermap icon codes
var weatherIcon = {
  "01d": "fas fa-sun",
  "01n": "fas fa-sun",
  "02d": "fas fa-cloud-sun",
  "02n": "fas fa-cloud-sun",
  "03d": "fas fa-cloud",
  "03n": "fas fa-cloud",
  "04d": "fas fa-cloud",
  "04n": "fas fa-cloud",
  "09d": "fas fa-cloud-rain",
  "09n": "fas fa-cloud-rain",
  "10d": "fas fa-cloud-showers-heavy",
  "10n": "fas fa-cloud-showers-heavy",
  "11d": "fas fa-bolt",
  "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake",
  "13n": "fas fa-snowflake",
  "50d": "fas fa-smog",
  "50n": "fas fa-smog",
}


// images equivalent to openweathermap icon codes
var weatherImg = {
  "01d": "sunny",
  "01n": "night-clear",
  "02d": "clouds",
  "02n": "night-clouds",
  "03d": "cloudy",
  "03n": "cloudy",
  "04d": "cloudy",
  "04n": "cloudy",
  "09d": "drizzle",
  "09n": "night-rain",
  "10d": "rain",
  "10n": "night-rain",
  "11d": "thunder",
  "11n": "thunder",
  "13d": "snow",
  "13n": "snow",
  "50d": "smog",
  "50n": "smog",
}

// searching weather by city
var searchBtn = document.querySelector("#search-button");
var citySearch = document.querySelector("#search-bar");
var city = "";

