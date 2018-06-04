import annyang from 'annyang'
import Levenshtein from "./../utils/Levenshtein.js"


/**
 * Allow to recognize speech and execute actions
 */
class SpeechRecognition {
  
  constructor(args) {
    if( !args ) var args = {}
    this.commands = args.commands ? args.commands : [];
    this.api = annyang; 
      
      if (this.api) {
      // Let's define a command. 
      this.api.setLanguage('fr-FR')

      window.annyang = this.api

      this.api.addCallback('result', (phrases) => {
        for(var i=0; i<phrases.length; i++){
          for(var j=0; j<this.commands.length; j++){
            if( phrases[i].match(this.commands[j].command) && this.commands[i].callback && !this.commands[i].exact) {
              this.commands[i].callback.call(this)
            }
          }
        }
      })

      annyang.addCallback('error', function(e) {
        console.warn('SpeechRecognition : There was an error in Annyang!', e);
      });

      // Start listening. 
      this.api.start({ autoRestart: true, continuous: false });
    }
  }

  get loaded() {
    return this.api ? true : false;
  }

  /**
   * Remove all the commands
   */
  removeCommands() {
    if(!this.loaded) return;
    this.commands = [];
    this.api.removeCommands();
  }

  /**
   * Add a new command
   * @param {String} command 
   * @param {Function} callback 
   * @param {Boolean} exact 
   */
  addCommand(command, callback, exact = false) {
    if(!this.loaded) return;

    var commands = {};
    
    commands[command] = callback;
    
    this.commands.push({
      command: command,
      callback: callback,
      exact: exact
    });

    this.api.addCommands(commands)
  }
}

export default SpeechRecognition;
