document.getElementById('go').addEventListener('click', async () => {
  const city      = document.getElementById('city').value
  const weather   = document.getElementById('weather').value

  const coords = await fetch(`https://geocode.xyz/${city},US?json=1`).then(response => response.json())
  const latitude  = coords.latt
  const longitude = coords.longt

  const metadata = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`).then(response => response.json())
  console.log(metadata)

  const link = metadata.properties.forecast

  const forecast = await fetch(link).then(response => response.json())

  const period = deliverVerdict(forecast.properties.periods, weather)

  if (period !== "") {
    const ISO = parseISOString(period.startTime)
    // const startTime = ISO8601.substring(5, 10)
    // const month = startTime.substring(0, 2)
    // const day = startTime.substring(3, 5)
    // const date = month + "/" + day
    const hours = ISO.getHours() % 12;
    let mins  = ISO.getMinutes()
    if (mins < 10) mins = '0' + mins
    const time = `${hours}:${mins}`
    const date = ISO.toDateString().substring(4, 10)
    document.getElementById('return').innerHTML =
      `😇 It will <b>${weather}</b> in <b>${city}</b> at <b>${time} PST</b> on <b>${period.name}</b>, <b>${date}</b>! 😇
      <br><br>
      Here's some more information about <b>${city}</b> on <b>${period.name}</b>!
      <br>
      <b>Detailed forecast</b>: ${period.detailedForecast}
      <br>
      <b>Temperature</b>: ${period.temperature + "°" + period.temperatureUnit}`
  } else {
    document.getElementById('return').innerHTML =
      `😥 It doesn't look like it will <b>${weather}</b> in <b>${city}</b> in the next two weeks. 😥
      <br>
      (At least, that's what the "experts" say.)`
  }
})

function deliverVerdict(periods, weather) {
  for (const period of periods) {
    if (period.detailedForecast.indexOf(weather) !== -1) {
      return period
    }
  }
  return ""
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}