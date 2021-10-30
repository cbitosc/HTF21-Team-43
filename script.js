const iconElement = document.querySelector('.weather-icon');
const locationIcon = document.querySelector('.location-icon');
const tempElement = document.querySelector('.temp-value p');
const descElement = document.querySelector('.temp-desc p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
let input = document.getElementById('search');
let city = "";
let latitude = 0.0;
let longitude = 0.0;
let t = '';
input.addEventListener('keyup',function(event)
{
    if(event.keyCode===13){
        event.preventDefault();

        city=input.value
        getSearchWeather(city)
        // console.log(city)
    }
})

const weather = {};

weather.temprature = {
    unit:"celsius"
}

const KELVIN = 273;
const key = '450b99213febdd305b2f970e31fc1c20';

if("geolocation" in navigator)
{
    navigator.geolocation.getCurrentPosition(setPosition,shoerr);
}
else{
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = '<p>Browser doesnot support geolocation</p>';
}


function setPosition(position)
{
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    getWeather(latitude,longitude);
    airPollution(latitude,longitude);
}

locationIcon.addEventListener('click',function(event){
    // setPosition(position);
    navigator.geolocation.getCurrentPosition(setPosition,shoerr);
    getWeather(latitude,longitude);
    document.getElementById('search').value = '';
});

function shoerr(error)
{
    notificationElement.style.display='block';
    notificationElement.innerHTML=error.message;
}

function getSearchWeather(city)
{
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    fetch(api)
    .then(function(response)
    {
        let data = response.json();
        return data;
    })
    .then(function(data){
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        weather.temprature.value = Math.floor(data.main.temp -KELVIN);
        weather.description=data.weather[0].description;
        // weather.iconId = data.weather[0].icon;
        let icon = data.weather[0].icon;
        document.getElementById("weather-contain").style.backgroundImage ='url(http://openweathermap.org/img/wn/'+icon+'@2x.png)'
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function()
    {
        document.getElementById('search').value = '';
        airPollution(latitude,longitude);
        displayWeather();
    })
}

function getWeather(latitude,longitude)
{
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`
    fetch(api)
    .then(function(response)
    {
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temprature.value = Math.floor(data.main.temp -KELVIN);
        weather.description=data.weather[0].description;
        let icon = data.weather[0].icon;
        document.getElementById("weather-contain").style.backgroundImage ='url(http://openweathermap.org/img/wn/'+icon+'@2x.png)'
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function()
    {
        airPollution(latitude,longitude);
        displayWeather();
    })

}

function airPollution(latitude,longitude)
{
    let api = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${latitude}&lon=${longitude}&start=${1606223802}&end=${1606482999}&appid=${key}`;
    fetch(api)
    .then(function (response) {
        let data = response.json();
        return data;
    })
    .then(function (data) {
        t+=`<thead><tr><td>Gas</td><td>Pollution level</td></tr></thead><tbody>`;
        for (let key in data.list[0].components)
        {
            t+=`<tr scope="row">`;
            t+=`<td>${key.toUpperCase()}</td>`;
            t+=`<td>${data.list[0].components[key]} μg/m3</td>`;
            t+=`</tr>`;
        }
        t+=`</tbody>`;
        
    })
    .then(function () {
        displayWeather();
    })
}

function displayWeather()
{
    document.getElementById("table").innerHTML = t;
    t = '';
    tempElement.innerHTML = `${weather.temprature.value}<sup>o</sup><span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`;
}