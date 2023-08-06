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
  //The colon before date means that it's a variable that stores whatever input the user gives.
  const dateString = req.params.date // accessing the input which the user gives
  const dateStringRegex = /^[0-9]+$/
  const numbersOnly = dateStringRegex.test(dateString);
  //dateStringRegex is a regular expression which contains all the possible strings that contains [0-9].
  //if the string provided by the user(dateString) matches the regular expression(dateStringRegex) then it returns true else false. means for timestamp it returns true and for date it returns fasle.

  if (!numbersOnly) { // means the user provided a date
    const unixTimestamp = Date.parse(dateString); 
    //Date.parse() method is used to convert a date string into a Unix timestamp
    // If the user provided a valid date, this will return a Unix timestamp and for invalid date it returns NAN
    const utcDate = new Date(unixTimestamp).toUTCString();
    //Once you have the unixTimestamp, you can pass it as a parameter to the Date object to get the actual date.
    //The toUTCString() method is useful for getting a standardized, human-readable representation of dates and time

    unixTimestamp
      ? res.json({ "unix": unixTimestamp, "utc": utcDate })
      : res.json({ error: "Invalid Date" })

    // handled the case where a user may provide an invalid date.
  }

  else { // if the user provided timestamp instead
    const unixTimestamp = parseInt(dateString)
    //the user already provided the Unix timestamp. So you just use parseInt() to convert it from a string to a number.
    const actualDate = new Date(unixTimestamp)
    const utcDate = actualDate.toUTCString()
    //.toUTCString() converts date to a more human-readable format

    res.json({ unix: unixTimestamp, utc: utcDate })
  }

});

//Requests with empty date parameter ie /api/ -- it should return current date and UNIX timestamp
app.get("/api/", (req, res) => {
  //for today's date and time
  let date = new Date();
  let UTC = date.toUTCString();
  let UNIX = date.getTime();
  res.json({ unix: UNIX, utc: UTC });
})




// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});