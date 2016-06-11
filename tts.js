const watson = require('watson-developer-cloud');
const fs = require('fs');

const textToSpeech = (text, filename) => {
    return new Promise( (resolve, reject) => {
        console.log('starting...');
        new Promise( (res, rej) => {
          fs.readFile('credentials.json', 'utf8', (err, credentials) => {
            console.log('opened file...');
            if (err) rej(err);
            console.log('reading it...');
            credentials = JSON.parse(credentials);
            res(credentials.credentials);
          });
        }).then( (credentials) => {
          console.log('read it...');
          return new Promise( (res, rej) => {
            var tts = watson.text_to_speech(credentials);
            var params = {
              text: text,
              accept: 'audio/wav'
            };
            res({tts: tts, params: params});
          });
        }).then( (tts) => {
          return new Promise( (res, rej) => {
            tts.tts.synthesize(tts.params).pipe(fs.createWriteStream(filename));
            res();
          });
        }).then( () => {
          resolve();
        }).catch( (err) => {
          reject(err);
        });
    });
};

module.exports = textToSpeech;