const fs = require('fs');
const exec = require('child_process').exec;
const uuid = require('node-uuid');

const textToSpeech = (text, filepath, filename) => {
    return new Promise( (resolve, reject) => {
        const tmpFilePath = filepath + '.txt';
        fs.writeFile(tmpFilePath, text, function (err) {
            if (err) reject();
            const aiffFilename = filename + '.aiff';
            const mp3Filename = filename + '.mp3';
            const cmdFindFile = `ls "${tmpFilePath}"`;
            const cmdTextToSpeech = 'say -v Alex -o "' + aiffFilename + '" -f "'+ tmpFilePath +'"';
            const cmdDeleteText = 'unlink "' + tmpFilePath + '"';
            const cmdAiffToMp3 = 'avconv -i "' + aiffFilename + '" "' + mp3Filename + '"';
            const cmdDeleteAiff = 'unlink "' + aiffFilename + '"';
            console.log(cmdFindFile + ' && ' + cmdTextToSpeech + ' && ' + cmdDeleteText + ' && ' + cmdAiffToMp3 + ' && ' + cmdDeleteAiff);
        });
    });
};

module.exports = textToSpeech;
