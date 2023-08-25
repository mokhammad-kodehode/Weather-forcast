const apiKey = "61a7207d514a4a119aa151602230206";

// Selecting DOM elements

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
const feelsLike = document.getElementById("feel");

// Function to update the current time and day

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

// Function to handle hourly weather data

function hourlyWeatherData(data) {
  // Extract hourly data for the first day

  const hourlyData = data.forecast.forecastday[0].hour;
  const currentHour = new Date().getHours();

  // Filter data for the remaining hours of the day
  const nextHours = hourlyData.filter((hourData) => {
    const hour = parseInt(hourData.time.split(" ")[1].split(":")[0]);
    return hour >= currentHour && hour < 24;
  });

  // Clear the hourly list before adding new elements
  const hourlyList = document.getElementById("hourlyList");
  hourlyList.innerHTML = "";

  // Create list items for each hour's data
  nextHours.forEach((hourData) => {
    const time = Math.floor(
      parseInt(hourData.time.split(" ")[1].split(":")[0])
    );
    const tempC = hourData.temp_c;
    const condIcon = hourData.condition.icon;

    const listItem = document.createElement("li");
    listItem.classList.add("hourlyBox");

    const timeParagraph = document.createElement("p");
    if (time === currentHour) {
      timeParagraph.textContent = "NOW";
    } else {
      timeParagraph.textContent = hourData.time.split(" ")[1];
    }
    listItem.appendChild(timeParagraph);

    const imageIcon = document.createElement("img");
    imageIcon.setAttribute("src", condIcon);
    listItem.appendChild(imageIcon);

    const tempParagraph = document.createElement("p");
    tempParagraph.textContent = `${tempC}°C`;
    listItem.appendChild(tempParagraph);

    hourlyList.appendChild(listItem);
  });
}

// Function to handle dayly weather data
function daylyWeatherData(data) {
  const daylyData = data.forecast.forecastday; // Получаем массив данных по дням
  const currentDay = new Date().getDate();

  // Filter data for the next 3 days
  const nextDays = daylyData.filter((dayData) => {
    const day = new Date(dayData.date).getDate();
    return day >= currentDay && day < currentDay + 3;
  });

  // Clear the daily list before adding new elements
  const daylyList = document.getElementById("daylyList");
  daylyList.innerHTML = "";

  // Create list items for each day's data
  nextDays.forEach((dayData) => {
    const tempC = dayData.day.avgtemp_c;
    const condIcon = dayData.day.condition.icon;
    const date = new Date(dayData.date).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    const listItem = document.createElement("li");
    listItem.classList.add("daylyBox");

    const dateParagraph = document.createElement("p");
    dateParagraph.textContent = date;
    listItem.appendChild(dateParagraph);

    const imageIcon = document.createElement("img");
    imageIcon.setAttribute("src", condIcon);
    listItem.appendChild(imageIcon);

    const tempParagraph = document.createElement("p");
    tempParagraph.textContent = `${tempC}°C`;
    listItem.appendChild(tempParagraph);

    daylyList.appendChild(listItem);
  });
}

// Function to fetch weather data by city

function getWeatherByCity(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&hour=1-24`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      daylyWeatherData(data);
      hourlyWeatherData(data);
      updateWeatherData(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to update weather data in the UI
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
  const currentFells = data.current.feelslike_c;

  const formattedTime = new Date(localTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Updating UI elements with weather data

  feelsLike.textContent = `${currentFells}°`;
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
  temperature.innerHTML = `${currentTemp} <span>°C</span>`;
  weatherDescription.textContent = conditionText;
}

// Fetch weather data for initial city (Stavanger)
getWeatherByCity("Stavanger");

// Add event listener for form submission

inputSearch.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value;
  getWeatherByCity(city);
});
