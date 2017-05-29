# AutoDAW

An ambitious project to enable computer-aided music production. The idea is
simple: a computer generates the melody, harmony, drums, etc. (i.e, a MIDI file)
via a trained recurrent neural network. Then a human creates the synthesizers
for each track via a web interface.

## Running

Setting it up is simple. Just use ```yarn``` and ```webpack```.

    $ yarn install
    $ webpack

Then start your favorite HTTP server and view it in a browser.

    $ cd dist/
    $ python -m http.server 8080
    $ chromium localhost:8080

## Progress

**Synthesizers**: 25% - basic functionality is there, a framework is
in place. Just need to add more synthesizer functionality.

**Neural network**: 0% - Not started.
