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
            const aiffFilename = filename2;
            const cmdFindFile = `ls "${tmpFilePath2}"`;
            const cmdTextToSpeech = 'say --quality 64 --file-format=m4bf -v Alex -o "' + aiffFilename + '" -f "'+ tmpFilePath2 +'"';
            console.log(cmdFindFile + ' && ' + cmdTextToSpeech);
        });
    });
};

module.exports = textToSpeech;
