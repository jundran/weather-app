export default async function fetchWeather(location, units) {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather')
  url.searchParams.append('q', location)
  url.searchParams.append('units', units)
  url.searchParams.append('appid', 'c83c5a6f08198340c3ab35401cd2129f')

  const data = getFromLocalStorage(url)
  if(data) return data

  return fetch(url)
  .then(res => res.json())
  .then(json => {
    if(json.cod !== 200) throw Error(json.message)
    saveToLocalStorage(url, json)
    return json
  })
  .catch(error => error)
}

function saveToLocalStorage(url, json) {
  try {
    json.createdAt = Date.now()
    localStorage.setItem(url, JSON.stringify(json))
  } catch (error) {
    console.log('Local storage unavailable. ' + error)
  }
}

function getFromLocalStorage(url) {
  try {
    const data = JSON.parse(localStorage.getItem(url))
    if(!data) return null

    // 10 minute expiry
    if(Date.now() - data.createdAt > 10 * 60 * 1000) return null
    else return data
  } catch (error) {
    console.log('Local storage unavailable. ' + error)
    return null
  }
}
