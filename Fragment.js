import Clock from "./utils/Clock.js"
import Action from "./Action.js"
import SpeechRecognition from "./components/SpeechRecognition.js"
import AlertManager from "./components/AlertManager.js";
import Event from "./utils/Event.js";

/**
 * Represent a fragment of history
 */

class Fragment extends Event {
	
	constructor(){
		super();
		this.eventsList = ["action:add", "action:execute", "action:remove", "element:add", "element:remove", "start"]
		this.book = null;
		this.clock = new Clock();
		this.elements = [];
		this.actions = {};
		this.speechRecognition = null;
	}

	/**
	 * Overrided method. Create the first render and add element to Scene
	 */
	start(){
		this.render();
		this.time = 0;
		this.dispatch("start", {})
	}

	/**
	 * @override 
	 * Raf 
	 */
	render(){
		this.raf = requestAnimationFrame( this.render.bind(this) );
		this.clock.update();
	}

	/**
	 * @override 
	 * Post raf 
	 */
	postRender(preventDefault){

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
		this.speechRecognition = new SpeechRecognition();
		if(!this.speechRecognition.loaded) {
			AlertManager.error("La reconnaissance vocale ne fonctionne pas sur ce navigateur. Privilégiez un navigateur comme Google Chrome.")
		}
	}

	/**
	 * Add action to the fragment context
	 * @param name String: The action's name
	 * @param procedure Function : The Function to launched
	 * @return boolean : Return true if action has been add
	 */
	addAction(name, procedure){
		var action = new Action(name, this, procedure); 
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
		if( this.elements.indexOf(element) >= 0) {
			
			element.hide();
			this.dispatch("element:remove", { element: element })
			for(var i=0; i<this.elements.length; i++){
				this.elements.splice(i, 1);
			}
		}
	}

}


export default Fragment;