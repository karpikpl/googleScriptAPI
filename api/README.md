# About

hapi API project that proxies calls to Google Apps Script API

## Usage

Start node server and call
```bash
curl http://localhost:8080/api?message=bla%20bla%20bla
```

## About
Build using https://github.com/jedireza/generator-hapi-style template

## Google integration
Follow guide from https://developers.google.com/apps-script/guides/rest/quickstart/target-script

That is:
* Create a google apps script with test method that we want to call
* Deploy script as API executable

### Sample script
```javascript
function myFunction(msg) {
  var activeSheet = SpreadsheetApp.openById('1Pj3w1NkYumx0xs4sGzKpYd7hbyKf_OUc_a9n4d0g3_8').getSheetByName("Sheet1");
  var range = activeSheet.getRange(1, 1, 100, 2);  
  var data = range.getValues();

  for(var i=0; i<data.length; i++) {
    if(data[i][0] == ''){
      data[i][0] = new Date();
      data[i][1] = msg || 'No message provided :(';

      range.setValues(data);
      return JSON.stringify(data);
    }
  }
}
```

Follow the guide from https://developers.google.com/apps-script/guides/rest/quickstart/nodejs

That is:
* Turn on the Google Apps Script Execution API
* Save `client_secret.json` in your home directory
* Update `config.js`:
```javascript
script: {
    id: '1fgV29YtkNgoA__bACMMzfX7d68tnWekEUy6ZSA-dF7bUGtAAmG2NDL7C',
    functionName: 'myFunction',
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets'
    ],
},
```

## License

MIT
