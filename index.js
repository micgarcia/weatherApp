const getWeather = async function(zip) {
  try {
    const responseZip = await fetch('https://api.openweathermap.org/geo/1.0/zip?zip=' + zip + '&appid=9de13ef9384a0e318ad0117952be0449', {mode: 'cors'});
    const coordData = await responseZip.json();
    const lat = coordData.lat;
    const lon = coordData.lon;
    const responseWeather = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=9de13ef9384a0e318ad0117952be0449', {mode: 'cors'});
    const weatherData = await responseWeather.json();
    return weatherData;

  } catch(error) {
    console.log(error);
  }
}


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
}


let woodland = getWeather('95695');
woodland.then(function(result) {
  console.log(result);
  const woodData = new Weather(result);
  console.log(woodData);
})

const addLocation = function() {
  let input = document.querySelector('input');
  let location = input.value;

  let locationData =
}

const button = document.querySelector('button');
button.addEventListener('click', addLocation);




