# epub2audio

A tool to convert epub to audiobook using OS X tts command line application.

## usage

    bin/epub2audio "/path/to/epub" > bookgen.sh
    # after that step, you should find the text files in output/[BookTitle] directory
    # open the text files in an editor and remove the parts you don't want in the generated audio
    # you can also delete the files you don't want to be processed
    # then run the following
    ./bookgen.sh

## todo

* Save files by chapter names
