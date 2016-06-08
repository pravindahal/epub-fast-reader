'use strict';

const watson = require('watson-developer-cloud');
const fs = require('fs');
const EPub = require('epub');
const html2text = require('html-to-text');

const textToSpeech = (text, filename) => {
    return new Promise( (resolve, reject) => {
        new Promise( (res, rej) => {
          fs.readFile('credentials.json', 'utf8', (err, credentials) => {
            if (err) rej(err);
            credentials = JSON.parse(credentials);
            res(credentials.credentials);
          });
        }).then( (credentials) => {
          return new Promise( (res, rej) => {
            let tts = watson.text_to_speech(credentials);
            let params = {
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

// pad a number based on the maximum i.e. if max is 123, pad 1 to 001
const pad = (n, max, z) => {
    var width = Math.ceil(Math.log10(max)); // get number of digits
    n = n + ''; //stringify
    z = z || '0'; // default padding string is 0
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const TYPE_STRING = 1;
const TYPE_PROMISE = 2;

var epubfile = 'Metamorphosis-jackson.epub';

var epub = new EPub(epubfile);

new Promise( (resolve, reject) => {
    var allVals = [];
    epub.on("end", () => {
        allVals.push(new Promise( (res, rej) => {
            res(epub.metadata.title);
        }));
        epub.flow.forEach( (chapter) => {
            allVals.push(new Promise( (res, rej) => {
                res(chapter.title);
            }));
            allVals.push(new Promise( (res, rej) => {
                epub.getChapter(chapter.id, (error, text) => {
                    if (error) rej(error);
                    res(text);
                });
            }));
        });
        resolve(allVals);
    });
    epub.parse();
}).then( (allVals) => {
    allVals.forEach( (v, i) => {
        v.then( (text) => {
            var paragraphs = html2text.fromString(text).split(/\r?\n\n/);
            paragraphs.forEach( (paragraph, j) => {
                var filename = "" + pad(i, allVals.length) + "_" + pad(j, paragraphs.length) + ".wav";
                console.log(filename + " - start");
                textToSpeech(paragraph, filename).then( () => {
                    console.log(filename + " - start");
                }).then( () => {
                    console.log(filename + " - stop");
                });
            });
        });
    });
});
