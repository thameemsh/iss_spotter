/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json',(error, response, body) => {
 
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null,ip);
  });
};




const fetchCoordsByIP = function(ip,callback) {
  request(`https://freegeoip.app/json/${ip}`,(error, response, body) => {
 
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates: ${body}`), null);
      return;
    }
    const {latitude,longitude} = JSON.parse(body);

    callback(null,{latitude,longitude});
  });
};

const fetchISSFlyOverTimes = function(coords,callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,(error, response, body) => {
 
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Fly Over Times: ${body}`), null);
      return;
    }
    const flyOverTimes = JSON.parse(body).response;
    
    callback(null,flyOverTimes);
  });
};



const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
      if (error) {
        console.log("It didn't work! Couldn't retrieve IP\n" , error);
        return;
      }
    
      // console.log('It worked! Returned IP:' , ip);
    
      fetchCoordsByIP(ip, (error, coordinates) => {
        if (error) {
          console.log("It didn't work! Couldn't retrieve Fly Over Times\n" , error);
          return;
        }
        // console.log('It worked! Returned Coordinates:' , coordinates);
    
        fetchISSFlyOverTimes(coordinates, (error, flyOverTimes) => {
          if (error) {
            console.log("It didn't work!" , error);
            return;
          }
          return callback(null,flyOverTimes);
        });
      });
    });
}


module.exports = { nextISSTimesForMyLocation  };