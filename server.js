var express = require("express");
var request = require("request-promise");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb://sravanthi:password1@ds121415.mlab.com:21415/weatherappdata"
);

var citySchema = new mongoose.Schema({
  name: String
});

var cityModel = new mongoose.model("City", citySchema);

/*var Norfolk = new cityModel({name: 'Norfolk'});
var LasVegas = new cityModel({name: 'LasVegas'});
var Sydney = new cityModel({name : 'Sydney'});


Norfolk.save();
LasVegas.save();
Sydney.save();
*/
//var city = 'Norfolk';

async function getWeather(cities) {
  var weather_data = [];
  for (var city_obj of cities) {
    var city = city_obj.name;
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=05846e6dfa42e2f2c6cd37d12d0677e3`;
    var response_body = await request(url);

    var data_json = JSON.parse(response_body);

    var weather = {
      city: city,
      temp: data_json.main.temp,
      desc: data_json.weather[0].description,
      icon: data_json.weather[0].icon
    };

    weather_data.push(weather);
  }

  return weather_data;
}

app.get("/", function(req, res) {
  cityModel.find({}, function(err, cities) {
    getWeather(cities).then(function(results) {
      var weather_data = { weather_data: results };
      res.render("weatherapp", weather_data);
    });
  });
});

app.post("/", function(req, res) {
  console.log(req.body.city_name);

  var newcity = new cityModel({ name: req.body.city_name });
  newcity.save();
  res.redirect("/");
});

app.listen(8000);
console.log("server started");
