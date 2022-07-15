let currentLocation = {};

// asynch function that takes in a zip code and returns weatherData object
const getWeather = async function(zip) {
  try {
    const responseZip = await fetch('https://api.openweathermap.org/geo/1.0/zip?zip=' + zip + '&appid=9de13ef9384a0e318ad0117952be0449', {mode: 'cors'});
    const coordData = await responseZip.json();
    const lat = coordData.lat;
    const lon = coordData.lon;
    const responseWeather = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=9de13ef9384a0e318ad0117952be0449&units=imperial', {mode: 'cors'});
    const weatherData = await responseWeather.json();
    return weatherData;

  } catch(error) {
    return error;
  }

}

// Constructor function that takes in data object and refines
// to specific data
const Weather = function(data) {
  this.name = data.name;
  this.description = data.weather[0].main;
  this.temp = data.main.temp;
  this.temp_max = data.main.temp_max;
  this.temp_min = data.main.temp_min;
  this.humidity = data.main.humidity;
  this.wind = data.wind.speed;
  this.sunrise = data.sys.sunrise;
  this.sunset = data.sys.sunset;
  this.unit = 'F';
}

// Function that takes user location input and calls other functions
// to create new object
const addLocation = function() {
  let input = document.querySelector('input');
  let location = input.value;

  let locationData = getWeather(location);

  locationData.catch(function() {
    const weatherCont = document.getElementById('weatherCont');
    weatherCont.innerHTML = '';
    const body = document.querySelector('body');

    const err = document.createElement('div');
    err.setAttribute('id', 'err');
    err.innerText = 'Loading Location';
    weatherCont.appendChild(err);
    body.appendChild(weatherCont);
  }());

  locationData.then(function(result) {
    let refinedData = new Weather(result);
    addWeatherToDOM(refinedData);
  })
}

// Function that creates/appends DOM elements for each data point
const addWeatherToDOM = function(data) {
  currentLocation = data;

  const weatherCont = document.getElementById('weatherCont');
  weatherCont.innerHTML = '';
  const body = document.querySelector('body');

  const name = document.createElement('div');
  name.setAttribute('id','name');
  name.innerHTML = '<b>City</b> ' + data.name;

  const description = document.createElement('div');
  description.setAttribute('id','description');
  description.innerHTML = '<b>Conditions</b> ' + data.description;

  const picture = document.createElement('img');
  picture.setAttribute('id', 'picture');
  if (data.description === 'Clear') {
    picture.src = 'https://lh3.googleusercontent.com/CnHg3skxcIhFKh5oE_ZV61x-a-tqWKIWC04a4hWkmQymuBRGlp3Kgnr_d3bEj-jgvPZAM1kh4nkpALUr0bDaUJdzPQ=w640-h400-e365-rj-sc0x00ffffff';
  } else if (data.description === 'Clouds') {
    picture.src = 'https://s7d2.scene7.com/is/image/TWCNews/clouds_jpg_jpg-2';
  } else if (data.description === 'Rain') {
    picture.src = 'https://www.godubrovnik.com/wp-content/uploads/rainy-day.jpg';
  } else if (data.description === 'Snow') {
    picture.src = 'https://s.hdnux.com/photos/01/25/51/72/22453933/3/rawImage.jpg';
  }


  const temp = document.createElement('div');
  temp.setAttribute('id','temp');
  if (data.unit === "F") {
    data.temp = Math.round(data.temp);
    temp.innerHTML = '<b>Temperature</b> ' + data.temp + ' °F';
  } else if (data.unit === "C") {
    data.temp = Math.round(data.temp);
    temp.innerHTML = '<b>Temperature</b> ' + data.temp + ' °C';
  }


  const temp_min = document.createElement('div');
  temp_min.setAttribute('id','temp_min');
  if (data.unit === "F") {
    data.temp_min = Math.round(data.temp_min);
    temp_min.innerHTML = '<b>Low</b> ' + data.temp_min + ' °F';
  } else if (data.unit === "C") {
    data.temp_min = Math.round(data.temp_min);
    temp_min.innerHTML = '<b>Low</b> ' + data.temp_min + ' °C';
  }

  const temp_max = document.createElement('div');
  temp_max.setAttribute('id','temp_max');
  if (data.unit === "F") {
    data.temp_max = Math.round(data.temp_max);
    temp_max.innerHTML = '<b>High</b> ' + data.temp_max + ' °F';
  } else if (data.unit === "C") {
    data.temp_max = Math.round(data.temp_max);
    temp_max.innerHTML = '<b>High</b> ' + data.temp_max + ' °C';
  }

  const humidity = document.createElement('div');
  humidity.setAttribute('id','humidity');
  humidity.innerHTML = '<b>Humidity</b> ' + data.humidity + '%';

  const wind = document.createElement('div');
  wind.setAttribute('id','wind');
  data.wind = Math.round(data.wind);
  wind.innerHTML = '<b>Wind</b> ' + data.wind + ' mph';

  const sunrise = document.createElement('div');
  sunrise.setAttribute('id','sunrise');
  if(typeof(data.sunrise) === 'string') {
    sunrise.innerHTML = '<b>Sunrise</b> ' + data.sunrise + ' AM';
  } else {
    let rise = new Date(data.sunrise * 1000);
    let riseHours = rise.getHours();
    let riseMin = "0" + rise.getMinutes();
    let riseTime = riseHours + ':' + riseMin.substr(-2);
    data.sunrise = riseTime;
    sunrise.innerHTML = '<b>Sunrise</b> ' + data.sunrise + ' AM';
  }


  const sunset = document.createElement('div');
  sunset.setAttribute('id','sunset');
  if(typeof(data.sunset) === 'string') {
    sunset.innerHTML = '<b>Sunset</b> ' + data.sunset + ' PM';
  } else {
    let set = new Date(data.sunset * 1000);
    let setHours = set.getHours();
    let setMin = "0" + set.getMinutes();
    let setTime = setHours + ':' + setMin.substr(-2);
    data.sunset = setTime;
    sunset.innerHTML = '<b>Sunset</b> ' + data.sunset + ' PM';
  }


  weatherCont.append(name, description, picture, temp, temp_min,
    temp_max, humidity, wind, sunrise, sunset);
  body.appendChild(weatherCont);


}

const changeTemp = function(unit) {
  if (unit === 'C' && currentLocation.unit !== unit) {
    currentLocation.temp = Math.round((currentLocation.temp - 32) * (5 / 9));
    currentLocation.temp_min = Math.round((currentLocation.temp_min - 32) * (5 / 9));
    currentLocation.temp_max = Math.round((currentLocation.temp_max - 32) * (5 / 9));
    currentLocation.unit = 'C';
    addWeatherToDOM(currentLocation);
  } else if (unit === 'F' && currentLocation.unit !== unit) {
    currentLocation.temp = Math.round((currentLocation.temp * (9 / 5)) + 32);
    currentLocation.temp_min = Math.round((currentLocation.temp_min * (9 / 5)) + 32);
    currentLocation.temp_max = Math.round((currentLocation.temp_max * (9 / 5)) + 32);
    currentLocation.unit = 'F';
    addWeatherToDOM(currentLocation);
  }
}



const button = document.querySelector('button');
button.addEventListener('click', function(event) {
  const locationInput = document.getElementById('location');
  if (locationInput.validity.valueMissing) {
    locationInput.setCustomValidity('Please enter a location.');
    locationInput.reportValidity();
  } else if (locationInput.validity.patternMismatch) {
    locationInput.setCustomValidity('Please enter 5 digit zip code.');
    locationInput.reportValidity();
  } else {
    addLocation();
  }
});

const f = document.getElementById('F');
f.addEventListener('click', function() {
  changeTemp('F');
});

const c = document.getElementById('C');
c.addEventListener('click', function() {
  changeTemp('C');
})





