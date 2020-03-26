/*
 * Tests for the integration
 *
 */


process.env.NODE_ENV = 'test';
let server = "http://localhost:3000";

// chai, chaihttp, and mocha libraries to help with testing 
let chai = require('chai');  
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let should = chai.should();

let mocha = require('mocha');  
let describe = mocha.describe;
let it = mocha.it;


let bigPandaAppKey = "ed020d759a19ba90bce0e29f58d18dce";  // The Big Panda App Key
let accuWeatherApiKey = "a34j0eft9ush7we845dav99na1id4";  // The AccuWeather API Key
let access_token = '7d21469210cd99225324c2724fa0ca45';  // Bearer token for authorization


// Positive test case to post a Big Panda alert
describe('PostBigPandaAlertSuccess', () => {
  it('Post a Big Panda alert successfully', async () => {
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": accuWeatherApiKey, // The AccuWeather API Key
        "q": "San Francisco, CA",
        "app_key": bigPandaAppKey, // The Big Panda App Key
        "status": "critical",
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` })
      .end((err, res) => {
        res.should.have.status(201);
        // console.log(res.body);
        done();
      });
  });
});


// Negative test cases
describe('PostBigPandaAlertFailures', () => {
  it('Send an invalid AccuWeather API Key', async () => {
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": 0,  // Invalid AccuWeather API Key
        "q": "San Francisco, CA",
        "app_key": bigPandaAppKey,
        "status": "critical",
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` })
      .end((err, res) => {
        err.should.have.status(400);
        // console.log(err);
        done();
      });
  });

  it('Send an invalid Big Panda App Key', async () => {
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": accuWeatherApiKey,
        "q": "San Francisco, CA",
        "app_key": 0,  // Invalid Big Panda App Key
        "status": "critical",
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` })
      .end((err, res) => {
        err.should.have.status(400);
        // console.log(err);
        done();
      });
  });

  it("Missing 'q' search parameter for getting AccuWeather locationKey", async () => {
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": accuWeatherApiKey,
        "app_key": bigPandaAppKey,
        "status": "critical",
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` })
      .end((err, res) => {
        err.should.have.status(400);
        // console.log(err);
        done();
      });
  });

  it('Missing status parameter for posting a Big Panda alert', async () => {
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": accuWeatherApiKey,
        "q": "San Francisco, CA",
        "app_key": bigPandaAppKey,
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` })
      .end((err, res) => {
        err.should.have.status(400);
        // console.log(err);
        done();
      });
  });

  it('Pass in invalid access_token', async () => {
    let invalid_token = "InvalidToken";  // Invalid token should not allow the API be called
    chai.request(server)
      .post('/v1/integrations/bigPandaAlerts')
      .send({
        "apikey": accuWeatherApiKey,
        "q": "San Francisco, CA",
        "app_key": bigPandaAppKey,
        "status": "critical",
        "description": "Weather alert has changed!"
      })
      .set({ "Content-Type": "application/json", "Authorization": `Bearer ${invalid_token}` })  // Pass in the invalid token
      .end((err, res) => {
        err.should.have.status(401);
        // console.log(err);
        done();
      });
  });
});
