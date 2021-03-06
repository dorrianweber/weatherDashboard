var searchError = $(".search-error");

var currentTime = moment().format("MM/DD/YY");
var cityName = "";
var cityLat = "";
var cityLon = "";

// What happens when the user click on the search button?
$("#searchBtn").click(function (){

    // Sets cityName variable to whatever the user types in the search bar
    cityName = $("input").val();

    // API call for current weather
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=575fa6288040420c3c839c30a54f62de')

    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        console.log(data);

        // Displays an error message if user types an invalid city name
        if (data.cod === "404") {
            searchError.empty();
            searchError.append($("<h5>").text("Please enter a valid city name."));
        }
        
        else {
            // Adds city to list of searched cities
            $("#city-search").append($("<button>").text(cityName + ", " + data.sys.country).addClass("city-list row").attr('id', 'searchedCity'));

            // Updates header for current weather section
            $("#today-city-date").text(cityName + ", " + data.sys.country + " " + currentTime);

            // Adds icon for current weather conditions
            var iconCode = data.weather[0].icon;

            var weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png");

            $("#today-city-date").append(weatherIcon);

            // Populates current temperature
            $("#temp").text("Temperature: " + data.main.temp + "\u00B0" + "F");

            // Populates current humidity
            $("#humidity").text("Humidity: " + data.main.humidity + "%");

            // Populates current wind speed
            $("#wind").text("Wind Speed: " + data.wind.speed + " mph");

            cityLat = data.coord.lat;
            cityLon = data.coord.lon;

            // Second API call for more information needed for 5-day forecast
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&exclude=minutely&appid=575fa6288040420c3c839c30a54f62de')

            .then(function (response) {
                return response.json();
            })
            .then(function (forecast) {
                console.log(forecast);

                // Populates current UV Index

                var uvIcon = $("<div>").addClass("uvInfo").text(forecast.daily[0].uvi);

                // Conditional to set appropriate color for UV intensity
                if (parseInt(forecast.daily[0].uvi) < 3) {
                    uvIcon.css("background-color", "green");
                    uvIcon.css("color", "white");
                }

                else if (parseInt(forecast.daily[0].uvi) >= 3 && parseInt(forecast.daily[0].uvi) < 6) {
                    uvIcon.css("background-color", "yellow");
                }

                else if (parseInt(forecast.daily[0].uvi) >= 6 && parseInt(forecast.daily[0].uvi) < 8) {
                    uvIcon.css("background-color", "orange");
                    uvIcon.css("color", "white");
                }

                else if (parseInt(forecast.daily[0].uvi) >= 8 && parseInt(forecast.daily[0].uvi) < 11) {
                    uvIcon.css("background-color", "red");
                    uvIcon.css("color", "white");
                }
                
                else {
                    uvIcon.css("background-color", "purple");
                    uvIcon.css("color", "white");
                }
                
                $("#uvArea").empty();

                $("#uvArea").append(uvIcon);
                
                // Adds UV Index & daily forecast data to object in local storage
                data = {
                    ...data,
                    uvi: forecast.daily[0].uvi,
                    daily: forecast.daily
                };

                // Saves weather data for city in local storage
                localStorage.setItem(cityName, JSON.stringify(data));

                // Clears forecast section before adding cards
                $("#forecast").empty();

                // This for-loop adds a card with weather data for the next 5 days in the forecast section
                for (var i = 1; i < 6; i++) {
                    var forecastCard = $("<div>").addClass("card col");

                    $("#forecast").append(forecastCard);

                    var iconCode = forecast.daily[i].weather[0].icon;

                    var forecastIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png");

                    var forecastDate = $("<h4>").text(moment().add(i, 'days').format("MM/DD/YY"));
                    
                    var forecastHigh = $("<p>").text("High: " + forecast.daily[i].temp.max + "\u00B0" + "F");

                    var forecastLow = $("<p>").text("Low: " + forecast.daily[i].temp.min + "\u00B0" + "F");

                    var forecastHumidity = $("<p>").text("Humidity: " + forecast.daily[i].humidity + "%");

                    forecastCard.append(forecastDate, forecastIcon, forecastHigh, forecastLow, forecastHumidity);
                };
            });
        };
    });
});

// What happens when the user clicks on a city that you have already searched for?
$("body").on("click", ".city-list", function(){

    var searchedCity = $(this).text().split(",")[0];
    var cityData = JSON.parse(localStorage.getItem(searchedCity));

    // Current weather section...
    
    // Updates header
    $("#today-city-date").text(cityData.name + ", " + cityData.sys.country + " " + currentTime);

    // Adds icon for current weather conditions
    var iconCode = cityData.weather[0].icon;

    var weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png");

    $("#today-city-date").append(weatherIcon);

    // Populates current temperature
    $("#temp").text("Temperature: " + cityData.main.temp + "\u00B0" + "F");

    // Populates current humidity
    $("#humidity").text("Humidity: " + cityData.main.humidity + "%");

    // Populates current wind speed
    $("#wind").text("Wind Speed: " + cityData.wind.speed + " mph");

    // Populates current UV Index

    var uvIcon = $("<div>").addClass("uvInfo").text(cityData.daily[0].uvi);

    // Conditional to set appropriate color for UV intensity
    if (parseInt(cityData.daily[0].uvi) < 3) {
        uvIcon.css("background-color", "green");
        uvIcon.css("color", "white");
    }

    else if (parseInt(cityData.daily[0].uvi) >= 3 && parseInt(cityData.daily[0].uvi) < 6) {
        uvIcon.css("background-color", "yellow");
    }

    else if (parseInt(cityData.daily[0].uvi) >= 6 && parseInt(cityData.daily[0].uvi) < 8) {
        uvIcon.css("background-color", "orange");
        uvIcon.css("color", "white");
    }

    else if (parseInt(cityData.daily[0].uvi) >= 8 && parseInt(cityData.daily[0].uvi) < 11) {
        uvIcon.css("background-color", "red");
        uvIcon.css("color", "white");
    }
    
    else {
        uvIcon.css("background-color", "purple");
        uvIcon.css("color", "white");
    }
    
    $("#uvArea").empty();

    $("#uvArea").append(uvIcon);

    // .................................................................................................

    // Forecast section...

    // Clears forecast section before adding cards
    $("#forecast").empty();

    // This for-loop adds a card with weather data for the next 5 days in the forecast section
    for (var i = 1; i < 6; i++) {
        var forecastCard = $("<div>").addClass("card col");

        $("#forecast").append(forecastCard);
        
        var iconCode = cityData.daily[i].weather[0].icon;

        var forecastIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png");

        var forecastDate = $("<h4>").text(moment().add(i, 'days').format("MM/DD/YY"));
                    
        var forecastHigh = $("<p>").text("High: " + cityData.daily[i].temp.max + "\u00B0" + "F");

        var forecastLow = $("<p>").text("Low: " + cityData.daily[i].temp.min + "\u00B0" + "F");

        var forecastHumidity = $("<p>").text("Humidity: " + cityData.daily[i].humidity + "%");

        forecastCard.append(forecastDate, forecastIcon, forecastHigh, forecastLow, forecastHumidity);
    }

});