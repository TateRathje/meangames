"use strict";

if (process.env.NODE_ENV !== 'production') {
    require('@glimpse/glimpse').init();
}

let express = require('express');
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

app.use(express.static(__dirname + "/../client"));

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

app.get("/sports", (req, res) => {
  let sports = mongoUtil.sports();
  sports.find().toArray((err, docs) => {
    if (err) {
      res.sendStatus(400);
    }
    console.log(JSON.stringify(docs));
    let sportNames = docs.map((sport) => sport.name);
    res.json(sportNames);
  });
});

app.get('/sports/:name', (req, res) => {
  let sportName = req.params.name;
  let sports = mongoUtil.sports();
  sports.find({name: sportName}).limit(1).next((err, doc) => {
    if (err) {
      res.sendStatus(400);
    }
    console.log('Sport doc: ', doc);
    res.json(doc);
  });
});

app.post('/sports/:name/medals', jsonParser, (req, res) => {
  let sportName = req.params.name;
  let newMedal = req.body.medal || {};

  if (!newMedal.division || !newMedal.year || !newMedal.country) {
    res.sendStatus(400);
  }

  let sports = mongoUtil.sports();
  let query = {name: sportName};
  let update = {$push: {goldMedals: newMedal}};

  sports.findOneAndUpdate(query, update, (err) => {
    if (err) {
      res.sendStatus(400);
    }
    res.sendStatus(201);
  });
});

app.listen(8181, () => console.log("Listening on 8181"));
