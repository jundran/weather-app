import fetchWeather from "./scripts/fetch.js"
import renderWeather from "./scripts/render.js"
import './styles/index.sass'

// Top level variables needed to keep same units or location when changing the other
let location = 'london'
let units = 'metric'

document.querySelector('.toggle #metric').onclick = handleClick
document.querySelector('.toggle #imperial').onclick = handleClick
document.querySelector('form').onsubmit = handleSubmit

doFetch()

function handleSubmit(e) {
  e.preventDefault()
  location = e.target.location.value.trim()
  if(!location) return
  else doFetch()
}

async function doFetch(showLoading = true) {
  const statusMessage = document.querySelector('.status-message')
  if(showLoading) {
    document.querySelector('h1').textContent = 'Weather'
    document.querySelector('main').classList.add('hidden')
    statusMessage.textContent = 'LOADING...'
    statusMessage.classList.remove('hidden')
  }

  const res = await fetchWeather(location, units)
  if(res instanceof Error) {
    const message = res.message.charAt(0).toUpperCase() + res.message.slice(1)
    statusMessage.classList.remove('hidden')
    return statusMessage.textContent = message
  }
  else renderWeather(res, units)
}

function handleClick(e) {
  if(e.target.classList.contains('active')) return

  const fill = document.querySelector('.toggle .fill')
  if(e.target.textContent === 'Metric') {
    fill.classList.remove('right')
    toggleActiveButton()
    units = 'metric'
    doFetch(false)
  }
  else {
    fill.classList.add('right')
    toggleActiveButton()
    units = 'imperial'
    doFetch(false)
  }
}

function toggleActiveButton() {
  // metric is default active in HTML
  document.querySelector('.toggle #metric').classList.toggle('active')
  document.querySelector('.toggle #imperial').classList.toggle('active')
}
