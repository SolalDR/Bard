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

			var commands = {};
			commands['observe le ciel étoilé'] = function() { console.log("Hello") };
			this.api.addCommands()

			this.api.addCallback('result', (phrases) => {
				for(var i=0; i<phrases.length; i++){
					for(var j=0; j<this.commands.length; j++){
						console.log(phrases[i], Levenshtein(phrases[i], this.commands[j].command), this.commands[j].command)
					}
				}
				console.log(phrases)
				console.log('ok')
			})

			// Add our commands to annyang 
			this.api.addCommands(this.commands);

			// Start listening. 
			this.api.start();
		}
	}

	get loaded() {
		return this.api ? true : false;
	}

	removeCommands() {
		this.commands = [];
		this.api.removeCommands();
	}

	addCommand(command, callback) {
		var commands = {};
		
		commands[command] = callback;
		
		this.commands.push({
			command: command,
			callback: callback
		})

		this.api.addCommands(commands)
	}
}

export default SpeechRecognition;