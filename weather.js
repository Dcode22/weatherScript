/* This script adds a new HTML element at the top of the page to display local weather.
It uses an IP data API to get the current user's location information, and uses 
that information to retrieve the user's local weather from a weather API. That weather 
information is then displayed in the new element in the form of a 
sentence describing the current conditions. The weather element changes colors at night time.
*/

let weatherBar;
let weatherText;


function createWeatherBar() {
    weatherBar = document.createElement("div");
    weatherText = document.createTextNode("Loading local weather..."); 
    weatherBar.appendChild(weatherText);
    document.body.prepend(weatherBar);
    weatherBar.style.cssText = `
        width: 100%; 
        padding: 3px;
        height: fit-content; 
        background-color: skyblue; 
        color: navy;
        display: flex;
        justify-content: center;
        align-items: center;`;
}



function getUserData() {
    return fetch("https://api.ipdata.co?api-key=d29702f09636765b7f879ef3cd09ffd6b466d3721c0d1b4bc2c56953")
    .then(res => {
        if (res.ok != true) {
            console.log("ipdata call not Successful")
            alert("There was an issue loading weather, try back later")
        }
        return res.json()
    })
}


function getWeatherConditions(userData) {
    return fetch(`https://api.weatherbit.io/v2.0/current?lat=${userData["latitude"]}&lon=${userData["longitude"]}&key=259bdac304a04c8a9e6f05a3afb73b10`)
    .then(res => {
        if (res.ok != true) {
            console.log("Weather call not Successful")
            alert("There was an issue loading the weather, try back later");
        }
        return res.json()
    })
    .then(data => {
        weatherData = data["data"][0]; 
        return [userData, weatherData]  
    })
}


function formatTime(time){
    if (time.substring(0,2) < 13) {
        time += "am"
    } else {
        time = (time.substring(0,2) - 12) + time.substring(2) + "pm";
    }
    return time;
}


function editWeatherBar(userData, weatherData) {
    let weathDesc = weatherData["weather"]["description"].toLowerCase();
    let temp = weatherData["temp"];
    let windDirection = weatherData["wind_cdir_full"];
    let windSpeed = weatherData["wind_spd"];
    let time = formatTime(userData["time_zone"]["current_time"].substring(11,16))
    let city = userData["city"];
    let country = userData["country_code"];
    
    weatherText.nodeValue =`Weather: At ${time} it is ${temp} degrees celcius, ${weathDesc}, with ${windDirection} winds at ${windSpeed}km/h in ${city}, ${country}.`;
            
    let icon = weatherData["weather"]["icon"]
    if (icon.charAt(icon.length -1) === "n") {
        weatherBar.style.backgroundColor = "navy";
        weatherBar.style.color = "yellow";
    } 

}


createWeatherBar();
getUserData()
.then(userData => {
    getWeatherConditions(userData)
    .then(allData => {
        let userData = allData[0];
        let weatherData = allData[1];
        editWeatherBar(userData, weatherData)
    })
})