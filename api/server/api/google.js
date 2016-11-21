/* Code from Google https://developers.google.com/apps-script/guides/rest/quickstart/nodejs */
/*jshint esversion: 6, node: true*/
'use strict';
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const Config = require('../../config');
const Path = require('path');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/script-nodejs-quickstart.json
const SCOPES = Config.get('/script/scopes');
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'script-nodejs-quickstart.json';

module.exports = function CallGoogleAPI(message, responseCallback) {

  const client_secret = 'client_secret.json';
  const homePath = Path.join(process.env.HOME, client_secret);

  // Load client secrets from a local file.
  fs.readFile(homePath, function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return false;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Apps Script Execution API.
    authorize(JSON.parse(content), callAppsScript, message, responseCallback);
  });
};




/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, params, responseCallback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      return getNewToken(oauth2Client, callback, params, responseCallback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      return callback(oauth2Client, params, responseCallback);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, params, responseCallback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {

    console.log(`Thank you for the code: ${code}`);

    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      return callback(oauth2Client, params, responseCallback);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function callAppsScript(auth, message, responseCallback) {
  //var scriptId = '1fgV29YtkNgoA__bACMMzfX7d68tnWekEUy6ZSA-dF7bUGtAAmG2NDL7C';
  const scriptId = Config.get('/script/id');
  const functionName = Config.get('/script/functionName');
  var script = google.script('v1');

  // Make the API request. The request object is included here as 'resource'.
  script.scripts.run({
    auth: auth,
    resource: {
      function: functionName,
      parameters: [
        message
      ]
    },
    scriptId: scriptId
  }, function(err, resp) {
    if (err) {
      // The API encountered a problem before the script started executing.
      console.log('The API returned an error: ' + err);
      return responseCallback(err);
    }
    if (resp.error) {
      // The API executed, but the script returned an error.

      // Extract the first (and only) set of error details. The values of this
      // object are the script's 'errorMessage' and 'errorType', and an array
      // of stack trace elements.
      var error = resp.error.details[0];
      console.log('Script error message: ' + error.errorMessage);
      console.log('Script error stacktrace:');

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start executing.
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          console.log('\t%s: %s', trace.function, trace.lineNumber);
        }
      }

      responseCallback(resp.error);
    } else {
      // The structure of the result will depend upon what the Apps Script
      // function returns. Here, the function returns an Apps Script Object
      // with String keys and values, and so the result is treated as a
      // Node.js object (folderSet).
      // var folderSet = resp.response.result;
      // if (Object.keys(folderSet).length === 0) {
      //   console.log('No folders returned!');
      // } else {
      //   console.log('Folders under your root folder:');
      //   Object.keys(folderSet).forEach(function(id){
      //     console.log('\t%s (%s)', folderSet[id], id);
      //   });
      // }
      console.log(resp.response.result);
      const responseArray = JSON.parse(resp.response.result);
      var result = responseArray
      .filter(p => p[0] !== '')
      .map(p => { return {date:p[0], msg:p[1] };});

      //result.forEach(p => console.log(`${p.date} : ${p.msg}`));
      responseCallback(null, result);
    }

  });
}
