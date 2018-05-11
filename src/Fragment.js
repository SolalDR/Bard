import Clock from "./utils/Clock.js"
import Action from "./Action.js"
import SpeechRecognition from "./components/SpeechRecognition.js"
import SoundManager from "./components/SoundManager.js"
import AlertManager from "./components/AlertManager.js";
import Event from "./utils/Event.js";
import AsyncScriptLoad from "./utils/AsyncScriptLoad.js";

/**
 * Represent a fragment of history
 */

class Fragment extends Event {
	
  static build(name, protos, params = {}) {
    return new function() {

      var fragment = new Fragment();
      fragment.prototype = Object.create(Fragment.prototype);

      
      for(var i in protos){
        fragment.__proto__[i] = protos[i];
      }
      
      if( params.id ) fragment.id = params.id;
      if( params.children ) fragment.childrenLinks = params.children

      return fragment;

    };
  }

	constructor(){
		super();
		this.id = null;
		this.type = "Fragment";
		this.eventsList = ["action:add", "action:execute", "action:remove", "element:add", "element:remove", "start", "beforeLeave", "leave"];
		this.book = null;
		this.clock = new Clock();
		this.elements = [];
		this.actions = {};
		this.children = [];
		this.childrenLinks = [];
		this.speechRecognition = null;
	}

	/**
	 * Overrided method. Create the first render and add element to Scene
	 */
	afterStart(){
		this.render();
		this.time = 0;
		this.dispatch("start", {})
	}

	/**
	 * @override 
	 * Raf 
	 */
	beforeRender(){
		this.raf = requestAnimationFrame( this.render.bind(this) );
		this.clock.update();
	}

	/**
	 * @override 
	 * Post raf 
	 */
	afterRender(preventDefault){
		this.book.scene.render();
		if( preventDefault !== true ){
			for(var i=0; i<this.elements.length; i++){
				if( this.elements[i].render) {
					this.elements[i].render(this.clock);
				}
			}
		}
		
	}

	/**
	 * Add a speech recognition, the speechRecognition will be automatically passed to Text 
	 */
	addSpeechRecognition() {
		if( !this.book.speechRecognition ) this.book.speechRecognition = new SpeechRecognition();
		this.speechRecognition = this.book.speechRecognition;
		if(!this.speechRecognition.loaded) {
			AlertManager.error("La reconnaissance vocale ne fonctionne pas sur ce navigateur. Privilégiez un navigateur comme Google Chrome.")
		}
	}

	/**
	 * Add SoundManager
	 */
	addSoundManager() {
		if( !this.book.soundManager ) this.book.soundManager = new SoundManager();
		this.soundManager = this.book.soundManager;
	}

	/**
	 * Add action to the fragment context
	 * @param name String: The action's name
	 * @param procedure Function : The Function to launched
	 * @return boolean : Return true if action has been add
	 */
	addAction(name, procedure, args = {}){
		var action = new Action(name, this, procedure, args); 
		if( !this.actions[action.name] ){
			this.actions[action.name] = action;
			this.dispatch("action:add", { action: action })
			return; 
		}
		console.warn(`Action cannot be add. You need to remove action with name \"${action.name}\" first.`);
		return this.actions[action.name]; 
	}

	/**
	 * Remove action from name
	 * @param name string : The action's name
	 * @return boolean : Return true if action has been deleted
	 */
	removeAction(name){
		if( this.actions[name] ){
			this.dispatch("action:remove", { action: this.actions[name] })
			this.actions[name] = null; 
			return true; 
		}
		return false; 
	}


	/**
	 * Run action 
	 * @param name string
	 */
	executeAction(name){
		if( this.actions[name] ) {
			this.actions[name].execute();
			this.dispatch("action:execute", { action: this.actions[name] })
		} else {
			console.warn(`Action with name "${name}" doesn't exist.`);
		}
	}


	/**
	 * If possible, add a new element to Fragment
	 * @param element Element
	 */
	addElement(element){
		element.fragment = this;
		this.elements.push(element);
		element.onAttachToFragment();
		this.dispatch("element:add", { element: element })
		return element;
	}

	/**
	 * if possible hide and remove an element
	 * @param element Element
	 */
	removeElement(element){
		console.log("Element remove", element.name)
		if( this.elements.indexOf(element) >= 0) {
			if( element.hide ) element.hide();
			this.dispatch("element:remove", { element: element });
			this.elements.splice(this.elements.indexOf(element), 1)
		}
	}

	stop() {
		console.log("------- Stop Fragment process -------");

		this.elements.forEach(element => {
			if( element.hide ) element.hide();
		})
		this.elements = [];

		console.log("Stop raf");
		cancelAnimationFrame(this.raf);
	}

	runChild(i) {
		if( this.children[i] ){
			this.book.currentFragment = this.children[i];
		}
	}
}


export default Fragment;
