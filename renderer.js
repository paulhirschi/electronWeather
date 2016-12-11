// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const path = require('path')
const axios = require('axios')
const {shell} = require('electron')



const weatherData = document.querySelector('#cityName')
const currentWeather = document.querySelector('#currenlty')

// navigator.geolocation.getCurrentPosition(function(position) {
//   console.log('lat ' + position.coords.latitute, 'long ' + position.coords.longitute)
// })
document.querySelector('footer button').addEventListener('click', e => {
  shell.openExternal('https://darksky.net/poweredby/')
})

document.querySelector('#getWeatherForm input[type=submit]').addEventListener('click', e => {
  let zipCode = document.querySelector('#getZipCode').value
  getWeather(zipCode)
  document.querySelector('#getZipCode').value = ''
})

document.querySelector('#getZipCode').addEventListener('keypress', e => {
  let zipCode = document.querySelector('#getZipCode').value;
  if(e.keyCode === 13) {
    getWeather(zipCode)
    document.querySelector('#getZipCode').value = ''
  }
})

const getWeather = (z) => {
  const weatherKey = 'd5fa9956b1479e39be9d902b9e28c6b3'
  const geoLocateKey = 'AIzaSyCaa2x2QvuVU2dGJ-lgLOOR5lSEz-TV0gQ'
  const geoLocateApiBase = `https://maps.googleapis.com/maps/api/geocode/json?address=${z}&key=${geoLocateKey}`

  axios.get(geoLocateApiBase)
  .then(res => {
    const geoLocateData = res.data.results[0]
    let lat = geoLocateData.geometry.location.lat
    let long = geoLocateData.geometry.location.lng
    const weatherApiBase = `https://api.darksky.net/forecast/${weatherKey}/${lat},${long}`
    weatherData.innerHTML = geoLocateData.address_components[1].long_name
    axios.get(weatherApiBase)
      .then(res => {
        const weatherData = res.data
        const icon = weatherData.currently.icon
        document.querySelector('.currently h1').innerHTML = Math.round(weatherData.currently.temperature) + ' &#8457;'
        document.querySelector('.currently img').src = path.join(__dirname, `img/${icon}.svg`)
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
}

getWeather('84302')

