import Event from "./../utils/Event.js"
import { POINT_CONVERSION_HYBRID } from "constants";
import * as Effects from "./SoundEffects.js";

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
  constructor(manager, name, arg, params = {}) {
    super()
    this.manager = manager;
    this.eventsList = ["start", "pause", "stop", "load", "resume"]
    this.buffer = null;
    this.loaded = false;
    this.loop = params.loop ? true : false;
    this.gain = this.manager.context.createGain();
    
    if( params.effect ) {
      this.effect = Effects[params.effect]
      this.effectIntensity = params.effectIntensity ? params.effectIntensity : 50;
    }
    if( arg.constructor.name == "AudioBuffer" ) {
      this.init(arg, params);
    } else {
      this.load(arg, params);
    }
  }

  /**
   * Launch XHR Request to load an audio file
   * @param {String} url 
   * @param {Object} args 
   */
  load(url, args){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    
    // Decode asynchronously
    request.onload = () => {
      this.manager.context.decodeAudioData(request.response, (response) => {
        this.init(response, args);
      }, () => {
        console.warn("SoundManager : Error during loading")
      });
    }
    request.send();
  }

  /**
   * Init buffer and effects
   * @param {AudioBuffer} buffer 
   * @param {Object} args 
   */
  init(buffer, args){
    this.buffer = buffer;
    this.dispatch("load");
    this.loaded = true;

    if( this.effect ){
      this.effectNode = this.manager.context.createWaveShaper();
      this.effectNode.curve = this.effect(this.effectIntensity);
      this.effectNode.oversample = '4x';
    }

    if( args.volume >= 0 ) this.volume = args.volume;
  }

  /**
   * Get and set volume
   * @param {Int} volume
   */
  set volume(volume){
    this.gain.gain.value = volume;
  }

  get volume(){
    return this.gain.gain.value;
  }

  /**
   * Start the buffer
   */
  start() {
    this.dispatch("start");
    if( this.source ) this.stop();
    this.source = this.manager.context.createBufferSource()
    this.source.loop = this.loop;
    this.source.buffer = this.buffer
    
    this.gain.connect(this.manager.gain);
    if( this.effect ){
      this.source.connect(this.effectNode);
      this.effectNode.connect(this.gain);
    } else {
      this.source.connect(this.gain);
    }
    this.source.start(0);
  }

  /**
   * Pause 
   */
  pause() {
    this.dispatch("pause");
    this.source.playbackRate.value = 0.000000001;
  }

  /**
   * Play
   */
  play() {
    this.dispatch("resume");
    this.source.playbackRate.value = 1;
  }
  resume(){ this.play(); }

  /**
   * Stop
   */
  stop() {
    this.dispatch("stop");
    if( this.effectNode ){
      this.source.disconnect(this.effectNode);
    } else {
      this.source.disconnect(this.gain);
    }
    
    this.source = null;
  }
}

export default Sound;
