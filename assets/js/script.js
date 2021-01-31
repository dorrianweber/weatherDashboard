var searchBtn = $("#searchBtn");
var searchBar = $("input");

var currentTime = moment().format("MM/DD/YY, LT");
var cityName = "";

$(searchBtn).click(function (){

    cityName = searchBar.val();

    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=575fa6288040420c3c839c30a54f62de', {})

    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        localStorage.setItem(cityName, JSON.stringify(data));


        $("#city-search").append($("<h6>").text(cityName).addClass("city-list"));

        $("#today-city-date").text(cityName + ", " + data.sys.country + " " + currentTime);


        $("#temp").text("Temperature: " + data.main.temp + "\u00B0" + "F");
        $("#humidity").text("Humidity: " + data.main.humidity + "%");
        $("#wind").text("Wind Speed: " + data.wind.speed + " mph");
        // $("#uv").text("UV Index: " + data. );
    });

});