import Event from "./../utils/Event.js"
import Recorder from 'recorder-js';
 
 
class SoundRecorder extends Event {
  constructor(manager){
    super();
    this.eventsList = ["record:start", "record:stop"];
    this.manager = manager;
    this.context = this.manager.context;
    this.isRecording = false;
    this.recorder = new Recorder(this.context, {
      // An array of 255 Numbers
      // You can use this to visualize the audio stream
      // If you use react, check out react-wave-stream
      // onAnalysed: data => console.log(data),
    });
  }

  init(){
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => this.recorder.init(stream))
      .catch(err => console.log('Uh oh... unable to get stream...', err));
  }

  record(){
    this.recorder.start().then(() => this.isRecording = true);
    this.dispatch("record:start");
  }

  stop(){
    this.recorder.stop()
    .then(({blob, buffer}) => {
      var tableauDonnees = this.context.createBuffer(buffer.length, this.context.sampleRate * 2.0, this.context.sampleRate);
      for (var canal = 0; canal < buffer.length; canal++) {
        var tampon = tableauDonnees.getChannelData(canal);
        for (var i = 0; i < buffer[canal].length; i++) {
          tampon[i] =  buffer[canal][i];
        }
      }
      this.dispatch("record:stop", {
        data: buffer,
        buffer: tableauDonnees
      });
    });
  }

  download(file){
    Recorder.download(blob, file); // downloads a .wav file
  }
}


export default SoundRecorder;
