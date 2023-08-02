const apiKey = "61a7207d514a4a119aa151602230206";

const inputSearch = document.getElementById("my-form");
const cityInput = document.getElementById("search-input");
const cityDisplay = document.getElementById("city");
const weatherBox = document.querySelector(".for-waether");
const temperature = document.getElementById("temp");
const weatherDescription = document.getElementById("desc");
const infoBox = document.querySelector(".info-box");
const currentIcon = document.getElementById("icon");
const currentTime = document.getElementById("current-time");
const currentDay = document.getElementById("current-day");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const cloud = document.getElementById("cloud");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const windGust = document.getElementById("windgust");
const uiIndex = document.getElementById("ui-index");

function updateCurrentTime() {
  const currentTime = new Date();
  const currentDay = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
  });
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("current-day").textContent = currentDay;
  document.getElementById("current-time").textContent = formattedTime;
}

updateCurrentTime();

function getWeatherByCity(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      updateWeatherData(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function updateWeatherData(data) {
  const cityName = data.location.name;
  const countryName = data.location.country;
  const currentTemp = data.current.temp_c;
  const conditionText = data.current.condition.text;
  const conditionIcon = data.current.condition.icon;
  const localTime = data.location.localtime;
  const currentWind = data.current.wind_kph;
  const currentHumidity = data.current.humidity;
  const currentCloud = data.current.cloud;
  const currentVisibility = data.current.vis_km;
  const currentPressure = data.current.pressure_mb;
  const currentWindGust = data.current.gust_mph;
  const currentUi = data.current.uv;

  const formattedTime = new Date(localTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  uiIndex.innerHTML = currentUi;
  windGust.textContent = `${currentWindGust} km`;
  pressure.textContent = `${currentPressure} mb`;
  visibility.textContent = `${currentVisibility} km`;
  cloud.textContent = `${currentCloud} %`;
  humidity.textContent = `${currentHumidity} %`;
  wind.textContent = `${currentWind} km`;
  currentTime.textContent = formattedTime;
  currentIcon.setAttribute("src", conditionIcon);
  cityDisplay.textContent = cityName;
  document.getElementById("Country").textContent = countryName;
  currentIcon.innerHTML = conditionIcon;
  temperature.innerHTML = `${currentTemp} <span>℃</span>`;
  weatherDescription.textContent = conditionText;
}

getWeatherByCity("Stavanger");

inputSearch.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value;
  getWeatherByCity(city);
});
