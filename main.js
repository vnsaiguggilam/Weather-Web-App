const api = {
	key: "336dc39df553a6567e2aadb8201a1717",
	baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

const searchInput = document.querySelector("input");
const form = document.querySelector("form");
const city = document.querySelector(".city");
const temperature = document.querySelector(".temperature");
const weatherImage = document.querySelector(".weather-image");
const weatherCondition = document.querySelector(".weather-condition");
const wind = document.querySelector(".wind");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const humidityText = document.querySelector(".humidity-text");
const cloud = document.querySelector(".cloud");
const cloudy = document.querySelector(".cloudy");

const weatherHeading = document.querySelector(".weather-heading");

const time = document.querySelector(".time");

const now = new Date();

const months = [
	"Jan",
	"Feb",
	"March",
	"Apr",
	"June",
	"July",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec",
];
const weekDay = ["Sun", "Mon", "Tue", "Weds", "Thurs", "Fri", "Sat"];

const month = months[now.getMonth()];
const date = now.getDate();
const day = weekDay[now.getDay()];
const year = now.getFullYear();

let long;
let lat;

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((position) => {
		long = position.coords.longitude;
		lat = position.coords.latitude;

		const apiCurrentLocationUrl = `${api.baseUrl}?lat=${lat}&lon=${long}&units=metric&appid=${api.key}`;
		// console.log(apiCurrentLocationUrl);
	});
}

// Clear data
const clearData = () => {
	weatherHeading.innerText = "";

	city.innerText = "";

	temperature.innerHTML = "";

	weatherImage.style.display = "none";

	weatherCondition.innerText = "";

	// wind weatherData
	wind.innerText = "";
	windSpeed.innerText = "";

	// Humidity data
	humidityText.innerText = "";
	humidity.innerText = "";

	// Cloud data
	cloudy.innerText = "";
	cloud.innerText = "";

	// Time data
	time.innerText = "";
};

const setQuery = (e) => {
	e.preventDefault();
	getWeatherData(searchInput.value);
};

const getLocationWeather = async function () {
	try {
		const currentLocationData = await fetch(
			`${api.baseUrl}?lat=${lat}&lon=${long}&units=metric&appid=${api.key}`
		).then((result) => result.json());
		city.innerText = currentLocationData.name;

		temperature.innerHTML = `<h1>${Math.round(
			currentLocationData.main.temp
		)}<span>&#176;</span>C</h1>`;

		weatherImage.src = `http://openweathermap.org/img/wn/${currentLocationData.weather[0].icon}.png`;

		weatherCondition.innerText = currentLocationData.weather[0].description;

		// wind weatherData
		wind.innerText = "Wind";
		windSpeed.innerText = `${currentLocationData.wind.speed}m/s`;

		// Humidity data
		humidityText.innerText = "Humidity";
		humidity.innerText = `${currentLocationData.main.humidity}%`;

		// Cloud data
		cloudy.innerText = "Cloudy";
		cloud.innerText = `${currentLocationData.clouds.all}%`;

		// time data
		time.innerText = `${day}, ${date} ${month} ${year}`;
	} catch (error) {
		city.innerText = "Could not get your current location";
	}
};

let history = [];
const list_of_previous = document.querySelector("#previous");

const getWeatherData = async function (query) {
	try {
		const rawData = await fetch(
			`${api.baseUrl}?q=${query}&units=metric&appid=${api.key}`
		);
        const weatherData = await rawData.json();
        if (weatherData.cod === "404") throw Error;

		clearData();

        // console.log(weatherData)
        if (weatherData.name) {
            
            if (!history.includes(weatherData.name)) {
                if (history.length < 3) {
                    history.push(weatherData.name);
                    // console.log("doesn't have name")
                    // list_of_previous.appendChild(previous_item);
                    const previous_item = document.createElement("li");
                    // history.map((value) => {
                    previous_item.textContent = weatherData.name;
                    previous_item.setAttribute("id", weatherData.name);
                    previous_item.addEventListener("click", () => {
                        getWeatherData(weatherData.name);
                    });
                    list_of_previous.appendChild(previous_item)
                } else {
                    history.shift();
                    history.push(weatherData.name);
                    list_of_previous.removeChild(list_of_previous.getElementsByTagName('li')[0])
                    const previous_item = document.createElement("li");
                    previous_item.textContent = weatherData.name;
                    previous_item.setAttribute("id", weatherData.name);
                    previous_item.addEventListener("click", () => {
                        getWeatherData(weatherData.name);
                    });
                    list_of_previous.appendChild(previous_item)
                }
                // });
            }
            // previous_items.textContent()
            // console.log(history);
    
            weatherHeading.innerText = "Weather Details";
    
            city.innerText = weatherData.name;
    
            temperature.innerHTML = `<h1>${Math.round(
                weatherData.main?.temp
            )}<span>&#176;</span>C</h1>`;
    
            weatherImage.style.display = "block";
            weatherImage.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    
            weatherCondition.innerText = weatherData.weather[0].description;
    
            // wind weatherData
            wind.innerText = "Wind";
            windSpeed.innerText = `${weatherData.wind.speed}m/s`;
    
            // Humidity data
            humidityText.innerText = "Humidity";
            humidity.innerText = `${weatherData.main.humidity}%`;
    
            // Cloud data
            cloudy.innerText = "Cloudy";
            cloud.innerText = `${weatherData?.clouds.all}%`;
    
            // Time data
            time.innerText = `${day}, ${date} ${month} ${year}`;
        }

	} catch (error) {
		clearData();
		city.innerText = "Location not found";
		weatherHeading.innerText = "Something went wrong";
		// console.log("Opps", error);
	}
};

// window.addEventListener("load", getLocationWeather);

form.addEventListener("submit", setQuery);

