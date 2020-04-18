// write your code here
let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";
let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
let apikey = "41745d4e1b63d5f8653e46a51bfe8b21";
let units = "metric";
let currentyCity;
let lat;
let lon;

function formatDate() {
  let date = new Date();
  let sentence = "Last updated: ";
  switch (date.getDay()) {
    case 0:
      sentence += "Sunday, ";
      break;
    case 1:
      sentence += "Monday, ";
      break;
    case 2:
      sentence += "Tuesday, ";
      break;
    case 3:
      sentence += "Wednesday, ";
      break;
    case 4:
      sentence += "Thursday, ";
      break;
    case 5:
      sentence += "Friday, ";
      break;
    case 6:
      sentence += "Saturday, ";
      break;
    default:
  }

  switch (date.getMonth()) {
    case 0:
      sentence += "January ";
      break;
    case 1:
      sentence += "February ";
      break;
    case 2:
      sentence += "March ";
      break;
    case 3:
      sentence += "April ";
      break;
    case 4:
      sentence += "May ";
      break;
    case 5:
      sentence += "June ";
      break;
    case 6:
      sentence += "July ";
      break;
    case 7:
      sentence += "August ";
      break;
    case 8:
      sentence += "September ";
      break;
    case 9:
      sentence += "October ";
      break;
    case 10:
      sentence += "November ";
      break;
    case 11:
      sentence += "December ";
      break;
    default:
  }

  sentence +=
    date.getDate() + " " + date.getFullYear() + " - " + date.getHours() + ":";

  if (date.getMinutes() < 10) {
    sentence += "0" + date.getMinutes();
  } else {
    sentence += date.getMinutes();
  }

  return sentence;
}

function handleSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#searchField").value;
  city = city.trim().toLowerCase();

  handleCity(city);
}

function handleCity(city) {
  axios
    .get(weatherUrl, {
      params: {
        q: city,
        units: units,
        appid: apikey,
      },
    })
    .then(function (response) {
      // handle success
      lat = response.data.coord.lat;
      lon = response.data.coord.lon;
      console.log(response.data);
      editAppData(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      alert("An error has occurred. 😣 Please try again.");
    })
    .then(function () {
      // always executed
      axios
        .get(forecastUrl, {
          params: {
            q: city,
            units: units,
            appid: apikey,
          },
        })
        .then(function (response) {
          // handle success
          editForecast(response.data.list);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          alert("An error has occurred. 😣 Please try again.");
        });
    });
}

function handleLocation(latitude, longitude) {
  axios
    .get(weatherUrl, {
      params: {
        lat: latitude,
        lon: longitude,
        units: units,
        appid: apikey,
      },
    })
    .then(function (response) {
      // handle success
      currentCity = response.data.name;
      editAppData(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      alert("An error has occurred. 😣 Please try again.");
    })
    .then(function () {
      // always executed
      axios
        .get(forecastUrl, {
          params: {
            lat: latitude,
            lon: longitude,
            units: units,
            appid: apikey,
          },
        })
        .then(function (response) {
          // handle success
          editForecast(response.data.list);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          alert("An error has occurred. 😣 Please try again.");
        });
    });
}

function editAppData(data) {
  let cityInHTML = document.querySelector(".currentCity");
  cityInHTML.innerHTML = data.name + ", " + data.sys.country;

  let city = document.querySelector("#city");
  city.innerHTML = data.name;

  let sunriseHTML = document.querySelector("#sunrise");
  sunriseHTML.innerHTML =
    '<i class="fas fa-arrow-up"></i><i class="fas fa-sun"></i> Sunrise is at ' +
    handleSunEvents(data.sys.sunrise);

  let sunsetHTML = document.querySelector("#sunset");
  sunsetHTML.innerHTML =
    '<i class="fas fa-arrow-down"></i><i class="fas fa-sun"></i> Sunset is at ' +
    handleSunEvents(data.sys.sunset);

  let div = document.querySelector("#weatherConditionsWrapper");
  document.querySelector("#currentConditionsWrapper").remove();
  let newDiv = document.createElement("div");
  newDiv.id = "currentConditionsWrapper";
  div.appendChild(newDiv);

  for (let i = 0; i <= data.weather.length - 1; i++) {
    handleWeatherConditions(data.weather[i]);
  }

  handleCurrentTemps(data.main);
  handleWind(data.wind);
}

function editForecast(data) {
  let tempUnit;
  if (units == "metric") {
    tempUnit = " ºC";
  } else {
    tempUnit = " ºF";
  }

  let query = 7;

  for (let i = 1; i <= 5; i++) {
    let date = document.querySelector("#day" + i);
    date.innerHTML = handleForecastDay(data[query].dt);

    let image = document.querySelector("#iconDay" + i);
    image.src =
      "http://openweathermap.org/img/wn/" +
      data[query].weather[0].icon +
      ".png";
    image.alt = data[query].weather[0].description;

    let desc = document.querySelector(".day" + i + "desc");
    desc.innerHTML = data[query].weather[0].description;

    let temp = document.querySelector(".day" + i + "temp");
    temp.innerHTML = data[query].main.temp.toFixed(1) + tempUnit;

    query += 8;
  }
}

function handleUnit() {
  if (unitButton.classList.contains("metric")) {
    units = "imperial";
    unitButton.innerHTML = "(Want to see the temperatures in metric units?)";
    unitButton.classList.remove("metric");
    unitButton.classList.add("imperial");
  } else if (unitButton.classList.contains("imperial")) {
    units = "metric";
    unitButton.innerHTML = "(Want to see the temperatures in imperial units?)";
    unitButton.classList.remove("imperial");
    unitButton.classList.add("metric");
  }

  handleLocation(lat, lon);
}

function handleWind(data) {
  let windUnit;
  if (units == "metric") {
    windUnit = " m/s";
  } else {
    windUnit = " mph";
  }

  let wind = document.querySelector("#wind");
  wind.innerHTML = data.speed.toFixed(1) + windUnit;

  let degrees = document.querySelector("#degrees");
  if (data.deg) {
    degrees.innerHTML = " at " + data.deg.toFixed(1) + " degrees.";
  } else {
    degrees.innerHTML = ".";
  }
}

function handleSunEvents(timeInUnix) {
  let date = new Date(timeInUnix * 1000);
  let sentence = date.getHours() + ":";

  if (date.getMinutes() < 10) {
    sentence += "0" + date.getMinutes();
  } else {
    sentence += date.getMinutes();
  }
  return sentence;
}

function handlePosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;

  handleLocation(lat, lon);
}

function handleWeatherConditions(data) {
  let fatherDiv = document.querySelector("#currentConditionsWrapper");

  let elementDiv = document.createElement("div");
  elementDiv.classList.add("weatherConditions");

  let image = document.createElement("img");
  image.id = "icon";
  image.src = "http://openweathermap.org/img/wn/" + data.icon + "@2x.png";
  elementDiv.appendChild(image);

  let description = document.createElement("div");
  description.id = "description";
  description.innerHTML = data.description;
  elementDiv.appendChild(description);

  fatherDiv.appendChild(elementDiv);
}

function handleCurrentTemps(data) {
  let tempUnit;
  if (units == "metric") {
    tempUnit = " ºC";
  } else {
    tempUnit = " ºF";
  }

  let currentDayMin = document.querySelector(".currentDayMin");
  currentDayMin.innerHTML = data.temp_min.toFixed(1) + tempUnit;

  let currentDayMax = document.querySelector(".currentDayMax");
  currentDayMax.innerHTML = data.temp_max.toFixed(1) + tempUnit;

  let currentDayRealFeel = document.querySelector(".currentDayRealFeel");
  currentDayRealFeel.innerHTML = data.feels_like.toFixed(1) + tempUnit;
}

function handleForecastDay(timeInUnix) {
  let date = new Date(timeInUnix * 1000);
  let sentence = date.getDate() + "-";

  switch (date.getMonth()) {
    case 0:
      sentence += "Jan-";
      break;
    case 1:
      sentence += "Feb-";
      break;
    case 2:
      sentence += "Mar-";
      break;
    case 3:
      sentence += "Apr-";
      break;
    case 4:
      sentence += "May-";
      break;
    case 5:
      sentence += "Jun-";
      break;
    case 6:
      sentence += "Jul-";
      break;
    case 7:
      sentence += "Aug-";
      break;
    case 8:
      sentence += "Sep-";
      break;
    case 9:
      sentence += "Oct-";
      break;
    case 10:
      sentence += "Nov-";
      break;
    case 11:
      sentence += "Dec-";
      break;
    default:
  }

  return (sentence += date.getFullYear());
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

window.onload = function () {
  this.handleCity("lisboa");
};

let date = document.querySelector("#date");
date.innerHTML = formatDate();

let search = document.getElementById("search-form");
search.addEventListener("submit", handleSearch);

let unitButton = document.querySelector("#unitButton");
unitButton.addEventListener("click", handleUnit);

let locationButton = document.querySelector("#locationButton");
locationButton.addEventListener("click", getLocation);
