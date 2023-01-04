import * as assets from '../assets/index.js'

export default function renderWeather(json, units) {
  document.querySelector('.status-message').classList.add('hidden')
  document.querySelector('main').classList.remove('hidden')
  document.querySelector('h1').textContent = `${json.name}, ${json.sys.country}`

  // Weather
  conditionIcon(json.weather[0].icon)
  temp(json.main.temp, '.temp', units)
  condition(json.weather[0].description)
  temp(json.main.feels_like, '.feels-like .value', units)
  temp(json.main.temp_max, '.max .value', units)
  temp(json.main.temp_min, '.min .value', units)
  wind(json.wind, units)

  // Detail
  windGust(json.wind.gust, units)
  humidity(json.main.humidity)
  pressure(json.main.pressure)
  sunTime(json.sys.sunrise, json.timezone, 'sunrise')
  sunTime(json.sys.sunset, json.timezone, 'sunset')
  timeZone(json.timezone)
  coords(json.coord.lon, json.coord.lat)
}

function coords(lon, lat) {
  const lonDirection = lon < 0 ? '° W' : '° E'
  const latDirection = lat < 0 ? '° S' : '° N'
  const text = `${lon}${lonDirection} / ${lat}${latDirection}`
  document.querySelector('.detail .coords td').textContent = text
}

function condition(condition) {
  document.querySelector('.weather .condition').textContent =
    condition.charAt(0).toUpperCase() + condition.slice(1)
}

function conditionIcon(icon) {
  const conditionImage = document.querySelector('.condition-image')
  conditionImage.src = 'https://openweathermap.org/img/wn/ICON@2x.png'.replace('ICON', icon)
}

function humidity(humidity) {
  document.querySelector('.detail .humidity td').textContent = `${humidity}%`
}

function pressure(pressure) {
  document.querySelector('.detail .pressure td').textContent = `${pressure} hPa`
}

function sunTime(sunTime, weatherLocationOffset, className) {
  /*
    sunTime is UTC seconds(unix time) but toLocaleTimeString() will format to local time.
    App should show sunrise / sunset as local for the weather location,
    so need to add local time zone offset and weather location offset to sunTime
  */
  const userLocalOffset = new Date().getTimezoneOffset() * 60 // seconds
  // Javascript uses milliseconds: seconds * 1000
  const date = new Date((sunTime + userLocalOffset + weatherLocationOffset) * 1000)
  const time = date.toLocaleTimeString()
  document.querySelector(`.detail .${className} td`).textContent = time
}

function temp(temp, className, units) {
  document.querySelector(`.weather ${className}`).textContent =
    temp + (units === 'metric' ? '°C' : '°F')
}

function timeZone(timezone) {
  const zone = (timezone / 60 / 60).toString()
  const text = `UTC ${zone >= 0 ? `+ ${zone}` : zone.replace('-', '- ')}`
  document.querySelector('.detail .timezone td').textContent = text
}

function getDirection(deg) {
  let direction = 'N'
       if(deg >=  45-22 && deg <=  45+22) direction = 'NE'
  else if(deg >=  90-22 && deg <=  90+22) direction = 'E'
  else if(deg >= 135-22 && deg <= 135+22) direction = 'SE'
  else if(deg >= 180-22 && deg <= 180+22) direction = 'S'
  else if(deg >= 225-22 && deg <= 225+22) direction = 'SW'
  else if(deg >= 270-22 && deg <= 270+22) direction = 'W'
  else if(deg >= 315-22 && deg <= 315+22) direction = 'NW'
  return direction
}

function wind(wind, units) {
  const direction = getDirection(wind.deg)
  const windEl = document.querySelector('.weather .wind')
  windEl.querySelector('.speed').textContent = getSpeedString(wind.speed, units)
  windEl.querySelector('.arrow').src = assets[direction]
  windEl.querySelector('.arrow').title = `Wind blowing from ${direction} ${wind.deg}°`
  windEl.querySelector('.direction').textContent = `from ${direction}`
}

function windGust(speed, units) {
  document.querySelector('.detail .wind-gust td').textContent = getSpeedString(speed, units)
}

function getSpeedString(speed, units) {
  if(!speed) return 'None'
  // Metres per second to km/h or already in mph if imperial
  const correctSpeed = units === 'metric' ? (speed * 60 * 60 / 1000).toFixed(2) : speed
  return `${correctSpeed} ${units === 'metric' ? 'km/h' : 'mph'}`
}
