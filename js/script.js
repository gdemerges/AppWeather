$(document).ready(function(){
  'use strict';
  console.log('ready');

  if (navigator.geolocation) {
  console.log('geolocation Ok');
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position.coords.latitude, position.coords.longitude
    );

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
          let href = $(e.target).attr("href");
          let tabs = {
              '#main': ['forecast', displayForecast],
              '#daily': ['forecast/daily', displayForecastDaily],
          };

          getOpenWeatherData(tabs[href][0], position, tabs[href][1]);
      });

    getOpenWeatherData('weather',position, displayWeather);
    // getOpenWeatherData('forecast',position, displayForecast);
});
    } else {
        console.log('geolocation Ko');
    }

  function displayWeather(data) {
      $("#name").text(data.name);
      $("#img-container").html('<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="' + data.weather[0].description + '">');
      $("#temp").text(data.main.temp + '°C');
      $("#description").text(data.weather[0].description);
      $("#wind").text(data.wind.speed + "m/s");
      $("#clouds").text(data.clouds.all);
      $("#pressure").text(data.main.pressure + "hpa");
      $("#humidity").text(data.main.humidity + "%");
      $("#coords").text('[' + data.coord.lat+', ' + data.coord.lon+']');

      let sunrise = moment.unix(data.sys.sunrise);
      $('#sunrise').text(sunrise.format('LT'));
      let sunset = moment.unix(data.sys.sunset);
      $('#sunset').text(sunset.format('LT'));
    }

    function displayForecast(data) {
      let temp = [];
      let precipitations = [];
      let labels = [];

      data.list.forEach(function(e){
        temp.push(e.main.temp);
        precipitations.push(e.rain ? e.rain['3h'] || 0 : 0);
        labels.push(moment.unix(e.dt).format('LT'));
    });

      let mychart = Highcharts.chart('main', {
        title: {
          text: 'Weather forecast'
        },
        xAxis: {
          categories: labels.slice(0, 10)
        },
        yAxis: [
        {
            // Axe primaire(températures)
            labels: {
                format: '{value}°C'
            },

            title: {
                text: "Températures en °C"
            }
        },
        {
            // Axe secondaire(précipitations)
            labels: {
                format:'{vualue}mm'
            },
            title: {
                text: "Précipitations en mm"
            },
            opposite: true
        }],
        series : [{
          name: 'Precipitations',
          type:'column',
          data: precipitations.slice(0, 10),
          yAxis: 1
      },
          {
            name: 'Temperature',
            type: 'spline',
            data: temp.slice(0, 10)
          }]
      });
    }

    function displayForecastDaily(data){
        let temp = [];
        let range = [];
        let precipitations = [];
        let labels = [];

        data.list.forEach(function(e){
          temp.push(e.temp.day);
          range.push([e.temp.min, e.temp.max]);
          precipitations.push(e.rain || 0);
          labels.push(moment.unix(e.dt).format('DD MMM'));
      });

        let mychart = Highcharts.chart('daily', {
          title: {
            text: 'Weather forecast'
          },
          xAxis: {
            categories: labels.slice(0, 8)
          },
          yAxis: [
          {
              // Axe primaire(températures)
              labels: {
                  format: '{value}°C'
              },

              title: {
                  text: "Températures en °C"
              }
          },
          {
              // Axe secondaire(précipitations)
              labels: {
                  format:'{value}mm'
              },
              title: {
                  text: "Précipitations en mm"
              },
              opposite: true
          }],
          series : [{
            name: 'Precipitations',
            type:'column',
            data: precipitations.slice(0, 8),
            yAxis: 1
        },
            {
              name: 'Temperature',
              type: 'spline',
              data: temp.slice(0, 8)
          },
            {
              name: 'Average',
              type: 'arearange',
              data: range
          }],
        });
    }
    function getOpenWeatherData(type, position, callback) {
        // const key = "5fa4fa780f6ff9c62c4cddc893b52a91";

        $.cachax(buildUrl(type, position), //URL
        type,                              //Key pour localStorage
        60,                                     //Durée en minutes
        callback
    );
    function buildUrl(type, position){
        return 'weather.php?type=' + type + '&lat=' +
            position.coords.latitude+ '&lon=' +
            position.coords.longitude;
    }
    // function buildUrl(type, position){
    //   return 'http://api.openweathermap.org/data/2.5/' + type + '?lat='
    //   + position.coords.latitude+'&lon='
    //   + position.coords.longitude+'&cnt=16&units=metric&lang=fr&APPID='+key;
    // }
    }
});
