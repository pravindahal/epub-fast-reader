const fs = require('fs');
const exec = require('child_process').exec;
const uuid = require('node-uuid');

const textToSpeech = (text, outputDir, filepath, filename) => {
    return new Promise( (resolve, reject) => {
        const tmpFilePath = filepath + '.txt';
        const tmpFilePath2 = `${outputDir}${filename}.txt`;
        const filename2 = outputDir + filename;
        fs.writeFile(tmpFilePath, text, function (err) {
            if (err) reject();
            const aiffFilename = filename2 + '.aiff';
            const mp3Filename = filename2 + '.mp3';
            const cmdFindFile = `ls "${tmpFilePath2}"`;
            const cmdTextToSpeech = 'say --quality 127 -v Alex -o "' + aiffFilename + '" -f "'+ tmpFilePath2 +'"';
            const cmdDeleteText = 'unlink "' + tmpFilePath2 + '"';
            const cmdAiffToMp3 = 'avconv -i "' + aiffFilename + '" "' + mp3Filename + '"';
            const cmdDeleteAiff = 'unlink "' + aiffFilename + '"';
            console.log(cmdFindFile + ' && ' + cmdTextToSpeech + ' && ' + cmdDeleteText + ' && ' + cmdAiffToMp3 + ' && ' + cmdDeleteAiff);
        });
    });
};

module.exports = textToSpeech;
