// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function(req, res) {
  const dateString = req.params.date // accessing the input which the user gives
  const dateStringRegex = /^[0-9]+$/
  const numbersOnly = dateStringRegex.test(dateString);
  //we used regex /^[0-9]+$/ to test the dateString from the user. If the test returns true, it means the user provided a timestamp and if the test returns false, it means the user provided a date.

  if (!numbersOnly) { // means the user provided a date
    const unixTimestamp = Date.parse(dateString); 
    // If the user provided a valid date, this will return a Unix timestamp and for invalid date it returns NAN
    const utcDate = new Date(unixTimestamp).toUTCString();
    //Once you have the unixTimestamp, you can pass it as a parameter to the Date object to get the actual date.

    unixTimestamp
      ? res.json({ "unix": unixTimestamp, "utc": utcDate })
      : res.json({ error: "Invalid Date" })

    // handled the case where a user may provide an invalid date.
  }

  else { // if the user provided timestamp instead
    const unixTimestamp = parseInt(dateString)
    const actualDate = new Date(unixTimestamp)
    const utcDate = actualDate.toUTCString()
    //.toUTCString() converts date to a more human-readable format

    res.json({ unix: unixTimestamp, utc: utcDate })
  }

});

//Requests with empty date parameter ie /api/ -- it should return current date and UNIX timestamp
app.get("/api/", (req, res) => {
  let date = new Date();
  let UTC = date.toUTCString();
  let UNIX = date.getTime();
  res.json({ unix: UNIX, utc: UTC });
})




// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
