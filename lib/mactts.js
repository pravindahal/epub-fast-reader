const fs = require('fs');
const exec = require('child_process').exec;
const uuid = require('node-uuid');

const textToSpeech = (text, filename) => {
    return new Promise( (resolve, reject) => {
        const tmpFilePath = '/tmp/epub2audio-text-'+ uuid.v4() +'.txt';
        fs.writeFile(tmpFilePath, text, function (err) {
            if (err) reject();
            const cmd = 'say -v Alex -o "' + filename + '" -f "'+ tmpFilePath +'"';
            console.log(cmd);
            exec(cmd, function callback(error, stdout, stderr) {
                fs.unlinkSync(tmpFilePath);
                resolve();
            });
        });
    });
};

module.exports = textToSpeech;
