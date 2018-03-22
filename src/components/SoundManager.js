

class SoundManager {

    constructor() {

        this.context;
        this.loaded = false;
        this.sounds = {};
        
        
        window.addEventListener('load', this.init.bind(this), false);

    }

    init(){

        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.loaded = true;
        }
        catch (e) {
            this.loaded = false;
            console.warn('SoundManager : Web Audio API is not supported in this browser');
        }

    }

    play(name, offset) {
        if(!offset) var offset = 0;
        // Fix up prefixing
        this.buffers[name].start(offset);
    }
    

    load(name, url) {

        if(!this.loaded) console.warn("SoundManager : Cannot load sound, context is not initialized"); return;

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
            context.decodeAudioData(request.response, (response) => {
                this.buffers[name] = {
                    buffer: response,
                    source: this.context.createBufferSource()
                }

                this.buffers[name].source.connect(context.destination);       // connect the source to the context's destination (the speakers)
            }, () => {
                console.warn("SoundManager : Error during loading")
            });
        }
        request.send();
    }

}