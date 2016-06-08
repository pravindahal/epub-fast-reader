'use strict';

const watson = require('watson-developer-cloud');
const fs = require('fs');
const EPub = require('epub');
const html2text = require('html-to-text');
const trim = require('trim');

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

var args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Expecting path of input file as argument");
    process.exit();
}
var epubfile = args[0];
var epubpath = require('path').dirname(epubfile);

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
        resolve([epub.metadata.title, allVals]);
    });
    epub.parse();
}).then( (data) => {
    var title = data[0];
    var allVals = data[1];
    var dirname = "output/" + title;
    return new Promise( (resolve, reject) => {
        fs.mkdir(dirname, (err) => {
            resolve([dirname, allVals]);
        });
    });
}).then( (data) => {
    var folder = data[0];
    var allVals = data[1];
    allVals.forEach( (v, i) => {
        v.then( (html) => {
            if (html === undefined) {
                return;
            }
            var text = trim(html2text.fromString(html));
            if (text == '') {
                return;
            }
            var paragraphs = text.split(/\r?\n\n/);
            paragraphs.forEach( (paragraph, j) => {
                if (paragraph === undefined) {
                    return true; //i.e. continue
                }
                var filename = folder + "/" + pad(i, allVals.length) + "_" + pad(j, paragraphs.length) + ".wav";
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
