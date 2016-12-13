// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const {shell} = require('electron')

const weatherData = document.querySelector('#cityName')
const currentWeather = document.querySelector('#currenlty')

document.querySelector('footer button').addEventListener('click', e => {
  shell.openExternal('https://darksky.net/poweredby/')
})

document.querySelector('#getZipCode').addEventListener('keypress', e => {
  let zipCode = document.querySelector('#getZipCode').value;
  if (e.keyCode === 13) {
    getWeather(zipCode)
    document.querySelector('#getZipCode').value = ''
  }
})

const timerE = document.querySelector('#loading')
var setTimer
const timer = () => {
  setTimer = setTimeout(() => {
    timerE.style.visibility = 'hidden'
    clearTimeout(timerE)
    document.querySelector('#getZipCode').focus()
  }, 1000)
}
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const weeklyForecast = (d) => {
  for (var i = d.length - 1; i >= 0; i--) {
    let e = document.querySelector(`.weather${i}`)
    e.innerHTML = ''
    let z = d[i]
    let date = new Date(z.time * 1000)
    let day = days[date.getDay()]
    let eDay = document.createElement('P')
    let eDayText = document.createTextNode(day)
    eDay.appendChild(eDayText)
    e.appendChild(eDay)
    let eImg = document.createElement('IMG')
    let icon = z.icon
    const dark = '-dark'
    eImg.src = path.join(__dirname, `img/${icon}${dark}.svg`)
    e.appendChild(eImg)
    let eTemp = document.createElement('H3')
    let eTempMax = document.createElement('SPAN')
    let eTempMaxText = document.createTextNode(Math.round(z.temperatureMax))
    eTempMax.appendChild(eTempMaxText)
    eTemp.appendChild(eTempMax)
    let sep = document.createElement('SPAN')
    let sepText = document.createTextNode(' | ')
    sep.appendChild(sepText)
    eTemp.appendChild(sep)
    let eTempMin = document.createElement('SPAN')
    let eTempMinText = document.createTextNode(Math.round(z.temperatureMin))
    eTempMin.appendChild(eTempMinText)
    eTemp.appendChild(eTempMin)
    e.appendChild(eTemp)
    timer()
  }
}

const getWeather = (z) => {
  const weatherKey = 'd5fa9956b1479e39be9d902b9e28c6b3'
  const geoLocateKey = 'AIzaSyCaa2x2QvuVU2dGJ-lgLOOR5lSEz-TV0gQ'
  const geoLocateApiBase = `https://maps.googleapis.com/maps/api/geocode/json?address=${z}&key=${geoLocateKey}`

  axios.get(geoLocateApiBase)
    .then(res => {
      timerE.style.visibility = 'visible'
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
          weeklyForecast(weatherData.daily.data)
            // weatherData.daily.data.map(getWeather())
        })
        .catch(err => {
          console.log(err)
          timer()
        })
    })
    .catch(err => {
      console.log(err)
      timer()
    })
}

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function(msg) {
//         console.log('almost ', msg);
//   }, function(err) {
//         console.log('near almost ', err);
//   });
// } else {
//   error('not supported');
// }

getWeather('84037')
