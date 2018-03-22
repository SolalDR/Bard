import Event from "./../utils/Event.js"
import Sound from "./Sound.js"


/**
 * Manage all the sounds of a fragment
 */
class SoundManager extends Event {


    /**
     * @constructor
     */
    constructor() {
        super()
        
        this.context;
        this.loaded = false;
        this.sounds = {};
        this.eventsList = ["load"]
    
        this.init();
    }


    /**
     * Initialize the audio context when HTML Dom is loaded
     */
    init(){
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.loaded = true;
            this.dispatch("load")
        }
        catch (e) {
            this.loaded = false;
            console.warn('SoundManager : Web Audio API is not supported in this browser');
        }

    }


    /**
     * Play an object Sound from his name
     * @param {string} name : Name of the sound
     * @param {int} offset : Offset for start 
     */
    play(name, offset) {
        if(!offset) var offset = 0;
        this.sounds[name].start(offset);
    }

    
    /**
     * Load a sound
     * @param {String} name 
     * @param {String} url
     * @param {Object} args 
     */
    load(name, url, args) {
        if(!args) var args = {};

        var sound = new Sound(this, name, url);
        if (args.autoplay) {
            sound.on("load", function(){
                this.start();
            })
        }

        this.sounds[name] = sound;
        
        return sound;
    }
    
}

export default SoundManager