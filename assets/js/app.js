$(document).ready(function () {
  console.log("ready!");
  const apiKey = "42289ea57481ffa0e2b1aa22ae9c2d55";
  const apiCall = "https://api.openweathermap.org/data/2.5/";
  var weatherSearches = [];
  var lastSearch;
  var currentWeatherHeaderEl = $("#currentWeatherHeader");
  var currentWeatherTempEl = $("#currentWeatherTemp");
  var currentWeatherHumEl = $("#currentWeatherHum");
  var currentWeatherWindEl = $("#currentWeatherWind");
  var currentWeatherUVEl = $("#currentWeatherUV");
  var forecastWeatherDivEl = $("#forecastWeatherDiv");

  /*
This does not work
  $( "#searchBtn" ).click(function() {
    $( "#searchText" ).empty();
    
  });

  */

  // this function loads the weatherSearches and lastSearch variables
  function loadWeatherSearches() {
      var value = localStorage.getItem("weatherSearches");
      if (value !== null) {
          console.log(value);
          var localWS = JSON.parse(value);
          if (localWS !== null) {
              weatherSearches = localWS;
          }
      }
      var value = localStorage.getItem("lastWeatherSearch");
      if (value !== null) {
          console.log(value);
          lastSearch = value;
      }
  }
  loadWeatherSearches();
  console.log(weatherSearches);

  //if there's a Last Search use it and show the weather for that location, otherwise see if we can find the current location
  if (lastSearch != null) {
      console.log("last search: " + lastSearch);
      //remove the double quotes 
      var lastSearchNoQuotes = lastSearch.replace(/['"]+/g, '');
      console.log(lastSearchNoQuotes);
      getWeather(lastSearchNoQuotes);
  }
  else {
      //if there's no Last Search in the storage, and if we can get the current location then show the weather for the current location.
      navigator.geolocation.getCurrentPosition(function (location) {
          console.log(location);
          console.log(location.coords.latitude);
          console.log(location.coords.longitude);
          getWeatherByCoords(location.coords.longitude, location.coords.latitude);
          console.log(location.coords.accuracy);
      });
  }


  var btnDiv = $("#recentSearches");
  //this function clears the Search buttons area and re load it per updated weatherSearches
  function renderButtons() {
      btnDiv.html("");
      weatherSearches.forEach(element => {
          var btn = $("<button>");
          btn.addClass("btn btn-info mx-3 btn-block");
          btn.html(element);
          btnDiv.append(btn);
          btn.click(function (event) {
            $("#searchText").empty();
              var city = $(this).html();
              console.log("Button Click: " + city);
              getWeather(city);              
          });
      });
  }
  renderButtons();

  //this function retrieves the UV data for the current response/location.
  function getUV(response) {
      //http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
      queryURL = apiCall + "uvi?APPID=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
      console.log(queryURL);
      $.ajax({
          url: queryURL,
          method: "GET"
      }).done(function (response) {
          console.log(response);
          currentWeatherUVEl.html("UV : " + response.value);
      }).fail(function (response) {
          currentWeatherUVEl.html("UV : Failed to retrieve UV");
      });

  }

  //Clears the current weather section.
  function clearWeatherData() {
      currentWeatherHeaderEl.html("City/Date : Loading...");
      currentWeatherTempEl.html("Temperature : ");
      currentWeatherHumEl.html("Humidity : ");
      currentWeatherWindEl.html("Wind Speed : ");
      currentWeatherUVEl.html("UV : ");
  }

  //Creates the url for the icon that is returned in the response.
  function getImagePath(response) {
      return "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
  }

  function renderCard(response, headerEl, TempEl, HumEl, WindEl, headerHtml) {
      headerEl.html(headerHtml);
      var imgPath = getImagePath(response);
      headerEl.append('<img id="currentImg" src="' + imgPath + '" height="42" width="42" />')
      TempEl.html("Temperature : " + Math.round(response.main.temp) + " &#8451");
      HumEl.html("Humidity : " + Math.round(response.main.humidity) + "%");
      WindEl.html("Wind  : " + Math.round(response.wind.speed) + " KPH");
  }

  //Shows the input weather data on the page.
  function showWeatherData(response) {
      renderCard(response, currentWeatherHeaderEl, currentWeatherTempEl, currentWeatherHumEl, currentWeatherWindEl, response.name + " - " + moment().format("ddd, MMM Do, h:mm a") + "");
      getUV(response);
  }

  //Retrieves the current weather data for the input coordinates and then shows the data on the page.
  function getWeatherByCoords(lon, lat) {
      // weather?lat=35&lon=139&appid
      clearWeatherData();
      // &units=imperial
      queryURL = apiCall + "weather?lat=" + lat + "&lon=" + lon + "&units=metric" + "&APPID=" + apiKey;
      console.log(queryURL);
      $.ajax({
          url: queryURL,
          method: "GET"
      }).done(function (response) {
          console.log(response);
          showWeatherData(response);
          getForecast(response.id);

      }).fail(function (response) {
          console.log(response.responseJSON.message);
          $("#searchMsg").html(response.responseJSON.message);
      });
  }

  // Checks if txt exists in the weatherSearches array. this function is case insensitive
  function weatherSearchesInclude(txt) {
      console.log("checking weatherSearches for:" + txt);
      var found = false;
      var lowerTxt = txt.toLowerCase();
      console.log("checking weatherSearches for:" + lowerTxt);
      for (var i = 0; i < weatherSearches.length; i++) {
          console.log(weatherSearches[i].toLowerCase());
          if (weatherSearches[i].toLowerCase() === lowerTxt) {
              console.log("Found");
              found = true;
              break;
          }
          console.log("Not found");
      }
      return found;
  }

  //Retrieves the current weather data for the input city and then shows the data on the page.
  function getWeather(txt) {
      if (txt !== "") {
          clearWeatherData();
          // &units=imperial
          queryURL = apiCall + "weather?q=" + txt + "&units=imperial" + "&APPID=" + apiKey;
          console.log(queryURL);
          $.ajax({
              url: queryURL,
              method: "GET"
          }).done(function (response) {
              console.log(response);
              showWeatherData(response);
              lastSearch = txt;
              localStorage.setItem("lastWeatherSearch", JSON.stringify(lastSearch));
              if (!weatherSearchesInclude(txt)) {
                  weatherSearches.push(txt);
                  weatherSearches.sort();
                  localStorage.setItem("weatherSearches", JSON.stringify(weatherSearches));
                  renderButtons();
              }

              getForecast(response.id);

          }).fail(function (response) {
              console.log(response.responseJSON.message);
              $("#searchMsg").html(response.responseJSON.message);
          });
      }
  }




  




});


 
