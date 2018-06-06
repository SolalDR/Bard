import Clock from "./utils/Clock.js"
import Action from "./Action.js"
import SpeechRecognition from "./components/SpeechRecognition.js"
import SoundManager from "./components/SoundManager.js"
import Event from "./utils/Event.js";
import AsyncScriptLoad from "./utils/AsyncScriptLoad.js";

/**
 * Represent a fragment of history
 */

class Fragment extends Event {
	
  /**
   * Static method to construct a new fragment
   * Don't used it anymore, use ES6 Syntax instead
   * @param {String} name
   * @param {Object} protos : A prototype to defined the object
   * @param {Object} params : Defined children
   */
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

  /**
   * @constructor
   */
	constructor(){
		super();

		// Attributes 
		this.id = null;
		this.type = "Fragment";
		this.eventsList = ["action:add", "action:execute", "action:remove", "element:add", "element:remove", "start", "load", "beforeLeave", "stop"];
		this.book = null;

		// Components
		this.clock = null; // Setup when starting
		this.elements = [];
		this.actions = {};
		this.children = [];
    this.childrenLinks = [];
    this.clickables = [];
		this.speechRecognition = null;

    // actions pipeline 
    this.pipeline = { actions: [], current: 0, custom: false }

		// States
		this.loaded = false;
    this.started = false;
    this.startCallback = this.start.bind(this)
  }
  
  set customPipeline(pipeline) {
    this.pipeline.custom = true; 
    this.pipeline.actions = pipeline; 
  }

  get customPipeline() {
    return this.pipeline.actions;
  }

  get currentAction() {
    return this.pipeline.actions[this.pipeline.current];
  }
  
  set currentAction(arg) {
    if( arg.constructor.name === "String" ) arg = this.pipeline.actions.indexOf(arg);
    if( !isNaN(arg) && arg >= 0 && arg < this.pipeline.actions.length ){
      this.pipeline.current = arg;
    }
  }

  get waitLoad() {
    var array = [];
    this.elements.forEach(element => {
      if( !element.loaded ){
        array.push(element);
      }
    })
    return array;
  }

  /**
   * Alert system
   * @param {String} messageName The message code
   * @param {String} waitingAction Name of waiting action 
   * @param {*} time Timeout before throw the alert
   */
  waitAndAlert(messageName, waitingAction = null, time = 5000) {
    if( !waitingAction ) waitingAction = this.currentAction;

    var timeout = setTimeout((()=>{
      this.book.dispatch("alert", {
        name : messageName
      });
    }), time)

    this.on("action:execute", (event)=>{
      if( waitingAction === event.action.name ) {
        clearTimeout(timeout)
      }
    })
  }
  
  /**
   * Forward to the next pipeline checkpoint (execute current action is "executeBefore" is true)
   * @param {Boolean} executeBefore 
   * @return {Boolean} | Return false if cannot increment current actions 
   */
  next(executeBefore = false) {
    if( executeBefore ){ this.executeAction() }
    if(this.pipeline.actions[this.pipeline.current + 1]){
      this.pipeline.current++;
      return true;
    }
    return false;
  }

  /**
   * Go back to previous pipeline action
   * @return {Boolean}
   */
  previous() {
    if(this.pipeline.actions[this.pipeline.current - 1]){
      this.pipeline.current--;      
      return true;
    }
    return false;
  }

  /**
   * Test if all elements are loaded, if true dispatch load event
   * @returns boolean
   */
	isLoad() {
    if( this.loaded ) return true; 
    var load = true;
		this.elements.forEach(e => { 
			if(!e.loaded) {
        load = false;
      }
    });

    if( !load ) return false;
    this.loaded = true;
		this.dispatch("load");
		return true;
  }
  
  /**
   * @private
   * @param {Array} intersects 
   */
  onClick(intersects){
    for(var i=0; i<intersects.length; i++){
      for(var j=0; j<this.elements.length; j++){
        if(this.elements[j].clickable && intersects[i].object.name == "bb-"+this.elements[j].name){
          this.elements[j].dispatch("click");
        }
      }
    }
  }

  /**
   * Return element by his name
   * @param {String} name 
   */
  getElement(name = null){
    for(var i=0; i<this.elements.length; i++){
      if( this.elements[i].name == name){
        return this.elements[i];
      }
    }
  }

  /**
   * Hide all elements, cancel raf & dispatch stop event
   */
	stop() {
    if(this.onClickBind) this.book.scene.off("click", this.onClickBind);
		this.elements.forEach(element => { if( element.hide ) element.hide(); })
		this.elements = [];
		cancelAnimationFrame(this.raf);
		this.dispatch("stop");
	}

  /**
   * If fragment is loaded, start the fragment  
   */
	start() {
    console.log("----- Fragment: Try to start");
		if( !this.isLoad() ){
      console.log("----- Fragment: Not loaded yet, return");
			return; 
    }
    this.onClickBind = this.onClick.bind(this);
    this.book.scene.on("click", this.onClickBind);
    console.log("----- Fragment: Successully Start", this.name)
    this.dispatch("start")
    this.clock = new Clock(false);
    this.clock.start();
    this.time = 0;
    this.render();
	}

	/**
	 * Manage raf & clock
   * Launched before each render  
	 */
	beforeRender(){
		this.raf = requestAnimationFrame( this.render.bind(this) );
		this.clock.update();
	}

	/**
	 * Post raf 
	 */
	afterRender(preventDefault){
		if( preventDefault !== true ){
			for(var i=0; i<this.elements.length; i++){
				if( this.elements[i].render) {
					this.elements[i].render(this.clock);
				}
			}
    }
    
    this.book.scene.render();
	}

	/**
	 * Add a speech recognition
	 */
	addSpeechRecognition() {
		if( !this.book.speechRecognition ) this.book.speechRecognition = new SpeechRecognition();
		this.speechRecognition = this.book.speechRecognition;
		if(!this.speechRecognition.loaded) {
			this.book.dispatch("alert", {
        name : "chrome_exception"
      });
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
      if( !this.pipeline.custom ) this.pipeline.actions.push(action.name);
			this.dispatch("action:add", { action: action })
			return;
		}
		console.warn(`Fragment: Action cannot be add. You need to remove action with name \"${action.name}\" first.`);
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
      if( !this.pipeline.custom ) this.pipeline.actions.splice(this.pipeline.actions.indexOf(name), 1);
			return true; 
		}
		return false; 
	}

	/**
	 * Run action if specify, else run the default actions register in the pipeline
	 * @param name string|null
	 */
	executeAction(name = null, args={}){
    if( !name ) name = this.pipeline.actions[this.pipeline.current];
		if( this.actions[name] ) {
			this.actions[name].execute(args);
			this.dispatch("action:execute", { action: this.actions[name], event: args })
		} else {
			console.warn(`Fragment: Action with name "${name}" doesn't exist.`);
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
    
    if(element.hasEvent("load")) {
			element.on("load", ()=> {
        this.isLoad();
      });
    }
    
    if(element.type === "obj3D" && element.clickable) {
      this.clickables.push(element.name);
    }
		return element;
	}

	/**
	 * if possible hide and remove an element
	 * @param element Element
	 */
	removeElement(element){
		console.log("----- Fragment: Element remove", element.name)
		if( this.elements.indexOf(element) >= 0) {
			if( element.hide ) element.hide();
			this.dispatch("element:remove", { element: element });
			this.elements.splice(this.elements.indexOf(element), 1)
		}
	}

  /**
   * Run a fragment 
   * @param {integer} id
   */
	runChild(id) {
		if( this.children[id] ){
			this.book.currentFragment = this.children[id];
		}
	}
}


export default Fragment;
