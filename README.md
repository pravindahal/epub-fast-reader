# epub-to-audio

A tool to convert epub to audiobook using IBM watson Text to Speech API.

## setup

For instructions on how to get the service credentials, click [here](https://github.com/watson-developer-cloud/node-sdk#getting-the-service-credentials). When you have your service credentials, copy the credentials.json-dist to credentials.json and edit the file to add username and password.

IBM Watson Text to Speect API supports 1 million characters per month for free. From a random internet source, an average book has 500,000 characters. So, you will be able to convert 2 books per month for free.

## usage

node . "/path/to/epub"

## TODO

* Save files by chapter names
* Option to compress/convert the files to flac/mp3
* Refactoring
