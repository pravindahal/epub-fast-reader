const fs = require('fs');
const exec = require('child_process').exec;
const uuid = require('node-uuid');

const textToSpeech = (text, filename) => {
    return new Promise( (resolve, reject) => {
        const tmpFilePath = '/tmp/epub2audio-text-'+ uuid.v4() +'.txt';
        fs.writeFile(tmpFilePath, text, function (err) {
            if (err) reject();
            const aiffFilename = filename + '.aiff';
            const mp3Filename = filename + '.mp3';
            const cmdTextToSpeech = 'say -v Alex -o "' + aiffFilename + '" -f "'+ tmpFilePath +'"';
            console.log(cmdTextToSpeech);
            const cmdDeleteText = 'unlink "' + tmpFilePath + '"';
            console.log(cmdDeleteText);
            const cmdAiffToMp3 = 'avconv -i "' + aiffFilename + '" "' + mp3Filename + '"';
            console.log(cmdAiffToMp3);
            const cmdDeleteAiff = 'unlink "' + aiffFilename + '"';
            console.log(cmdDeleteAiff);
        });
    });
};

module.exports = textToSpeech;
