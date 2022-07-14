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
    console.log(error);
  }
}

// Constructor function that takes in data object and refines
// to specific data
const Weather = function(data) {
  this.name = data.name;
  this.description = data.weather[0].description;
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
  locationData.then(function(result) {
    let refinedData = new Weather(result);
    addWeatherToDOM(refinedData);
  })
}

// Function that creates/appends DOM elements for each data point
const addWeatherToDOM = function(data) {
  console.log(data);
  currentLocation = data;
  console.log(currentLocation);

  const weatherCont = document.getElementById('weatherCont');
  weatherCont.innerHTML = '';
  const body = document.querySelector('body');

  const name = document.createElement('div');
  name.setAttribute('id','name');
  name.innerText = 'City: ' + data.name;

  const description = document.createElement('div');
  description.setAttribute('id','description');
  description.innerText = 'Conditions: ' + data.description;

  const temp = document.createElement('div');
  temp.setAttribute('id','temp');
  if (data.unit === "F") {
    data.temp = Math.round(data.temp);
    temp.innerText = 'Temperature: ' + data.temp + ' °F';
  } else {
    data.temp = Math.round(data.temp);
    temp.innerText = 'Temperature: ' + data.temp + ' °C';
  }


  const temp_min = document.createElement('div');
  temp_min.setAttribute('id','temp_min');
  temp_min.innerText = 'Low: ' + data.temp_min + ' °F';

  const temp_max = document.createElement('div');
  temp_max.setAttribute('id','temp_max');
  temp_max.innerText = 'High: ' + data.temp_max + ' °F';

  const humidity = document.createElement('div');
  humidity.setAttribute('id','humidity');
  humidity.innerText = 'Humidity: ' + data.humidity + '%';

  const wind = document.createElement('div');
  wind.setAttribute('id','wind');
  data.wind = Math.round(data.wind);
  wind.innerText = 'Wind: ' + data.wind + ' mph';

  const sunrise = document.createElement('div');
  sunrise.setAttribute('id','sunrise');
  let rise = new Date(data.sunrise * 1000);
  let riseHours = rise.getHours();
  let riseMin = "0" + rise.getMinutes();
  let riseTime = riseHours + ':' + riseMin.substr(-2);
  data.sunrise = riseTime;
  sunrise.innerText = 'Sunrise: ' + data.sunrise + ' AM';

  const sunset = document.createElement('div');
  sunset.setAttribute('id','sunset');
  let set = new Date(data.sunset * 1000);
  let setHours = set.getHours();
  let setMin = "0" + set.getMinutes();
  let setTime = setHours + ':' + setMin.substr(-2);
  data.sunset = setTime;
  sunset.innerText = 'Sunset: ' + data.sunset + ' PM';

  weatherCont.append(name, description, temp, temp_min,
    temp_max, humidity, wind, sunrise, sunset);
  body.appendChild(weatherCont);

}

const changeTemp = function(unit) {
  if (unit === currentLocation.unit) {
    console.log('');
  } else if (unit === 'C' && currentLocation.unit !== unit) {
    currentLocation.temp = Math.round((currentLocation.temp - 32) * (5 / 9));
    currentLocation.unit = 'C';
    addWeatherToDOM(currentLocation);
    console.log('C');
  } /*else if (unit === 'F' && currentLocation.unit !== unit) {
    currentLocation.temp = Math.round((currentLocation.temp * (9 / 5)) + 32);
    currentLocation.unit = 'F';
    addWeatherToDOM(currentLocation);
    console.log('F');
  }*/
}


const button = document.querySelector('button');
button.addEventListener('click', addLocation);

const f = document.getElementById('F');
f.addEventListener('click', changeTemp('F'));

const c = document.getElementById('C');
c.onclick = changeTemp('C');




