import Event from "./../utils/Event.js"

/**
 * Represent a single sound
 */
class Sound extends Event {


    /**
     * @constructor
     * @param {SoundManager} manager 
     * @param {String} name 
     * @param {String} url 
     */
    constructor(manager, name, url) {
        super()
        this.manager = manager;
        this.eventsList = ["start", "pause", "stop", "load", "resume"]
        this.buffer = null;
        this.loaded = false;

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
            this.manager.context.decodeAudioData(request.response, (response) => {
                this.buffer = response;
                this.source = this.manager.context.createBufferSource()
                this.source.buffer = this.buffer
                this.source.connect(this.manager.context.destination);       // connect the source to the context's destination (the speakers)
                this.dispatch("load");
                this.loaded = true;
            }, () => {
                console.warn("SoundManager : Error during loading")
            });
        }
        request.send();
    }


    /**
     * Start the buffer
     */
    start() {
        this.dispatch("start");
        console.log(this.source)
        this.source.start(0)
    }


    /**
     * Pause 
     */
    pause() {
        this.dispatch("pause");
    }


    /**
     * Stop
     */
    stop() {
        this.dispatch("stop");
    }


    /**
     * 
     */
    resume() {
        this.dispatch("resume");
    }

}

export default Sound;