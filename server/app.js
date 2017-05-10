"use strict"

let express = require('express');
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

app.use(express.static(__dirname + "/../client"));

app.get("/sports", (req, res) => {
  let sports = mongoUtil.sports();
  sports.find().toArray((err, docs) => {
    console.log(JSON.stringify(docs));
    let sportNames = docs.map((sport) => sport.name);
    res.json(sportNames);
  });
});

app.get('/sports/:name', (req, res) => {
  let sportName = req.params.name;
  console.log('Sport name: ', sportName);

  let sport = {
    "name": "Cycling",
    "goldMedals": [{
      "division": "Men's Sprint",
      "country": "UK",
      "year": 2012
    }, {
      "division": "Women's Sprint",
      "country": "Australia",
      "year": 2012
    }]
  };
  res.json(sport);
});

app.listen(8181, () => console.log("Listening on 8181"));
