const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json')
} 

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
 return request(`https://freegeoip.app/json/${ip}`)
};

const fetchISSFlyOverTimes = function(body) {
  const {latitude,longitude} = JSON.parse(body);
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
  return request(url)
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
          .then(fetchCoordsByIP)
          .then(fetchISSFlyOverTimes)
          .then((data) => {
            const {response} = JSON.parse(data);
            // console.log(data)
            // console.log(response)
            return response; // Doesn't work except for response key word??
          })
}



module.exports = { nextISSTimesForMyLocation }

