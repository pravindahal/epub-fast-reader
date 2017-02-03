'use strict';

const fs = require('fs');
const EPub = require('epub');
const html2text = require('html-to-text');
const trim = require('trim');

const textToSpeech = require('./mactts');
const leftPad = require('./leftpad');

const TYPE_STRING = 1;
const TYPE_PROMISE = 2;

var args = process.argv.slice(2);
if (args.length == 0) {
    //console.log("Expecting path of input file as argument");
    process.exit();
}
var epubfile = args[0];
var epubpath = require('path').dirname(epubfile);

//console.log(epubfile)

var epub = new EPub(epubfile);

new Promise( (resolve, reject) => {
    var allVals = [];
    epub.on("end", () => {
        /*allVals.push(new Promise( (res, rej) => {
            res(epub.metadata.title);
        }));*/
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

            var filename = folder + "/" + leftPad(i, allVals.length);
            var cmdCreateDir = `mkdir -p "${folder}"`;
            console.log(cmdCreateDir);
            textToSpeech(text, filename).then( () => {
                //console.log(filename + " - start");
            }).then( () => {
                //console.log(filename + " - stop");
            });
            /*var paragraphs = text.split(/\r?\n\n/);
            paragraphs.forEach( (paragraph, j) => {
                if (paragraph === undefined) {
                    return true; //i.e. continue
                }
                var filename = folder + "/" + leftPad(i, allVals.length) + "_" + leftPad(j, paragraphs.length) + ".aiff";
                //console.log(filename + " - start");
                textToSpeech(paragraph, filename).then( () => {
                    //console.log(filename + " - start");
                }).then( () => {
                    //console.log(filename + " - stop");
                });
            });*/
        });
    });
});
