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
     * Get and set volume
     */
    set volume(volume) {
      this.gain.gain.value = Math.max(0, volume);
    }

    get volume(){
      return this.gain.gain.value;
    }
    

    /**
     * Initialize the audio context when HTML Dom is loaded
     */
    init(){
      this.supported = true;
      try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.gain = this.context.createGain();
        this.gain.connect(this.context.destination);
        this.loaded = true;
        this.dispatch("load")
      }
      catch (e) {
        this.supported = false;
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
     * Stop a sound object from his name
     */
    stop(){

    }

    /**
     * Load a sound
     * @param {String} name 
     * @param {String} url
     * @param {Object} args 
     */
    load(name, url, args = {}) {
      if( !this.supported ) return false;
      if( this.sounds[name] ){
        console.warn("A sound with name \""+name+"\" already exist.");
        return; 
      }
      var sound = new Sound(this, name, url, args);
        
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
