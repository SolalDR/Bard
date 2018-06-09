import Event from "./utils/Event.js"

/**
 * Represent a part of a Fragment.
 * Element is abstract
 * @param actions [Action]
 * @param loaded boolean
 * @abstract
 */
class Element extends Event {

	/**
	 * Define the possible type for object extending Element
	 */
	static get AVAILABLES_TYPES() { return ["text", "image", "sound", "obj3D", "obj2D", "svg", "ui-utils"]; }

  /**
   * Generate a random name
   * @returns {string}
   */
	static randomName() {
		return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 14);
	}

	/**
	 * @constructor
	 * @param {Object} params
	 */
	constructor(params){
		super();
    this.afterElement = params.afterElement ? params.afterElement : null;
    this.fragment; // Lateinit accessible after initialisation with Fragment.addElement()
    this.actions = {};
    this.autoDisplay = true;
		this.loaded = false;
		this.anims = [];
		this._type = null;
		if( params.name ){
			this.name = params.name ? params.name : null;
		}
	}

	
	/**
	 * Get and set type by checking available type
	 */
	set type(type) {
		if( Element.AVAILABLES_TYPES.indexOf(type) >= 0 ){
			this._type = type;
		} else {
			console.warn(`Element: This type "${type}" is not available for Element`);
		}
	}

	get type(){
		return this._type;
	}

	/************* ACTIONS *************/

	/**
	 * Register a new action
	 * @todo
	 * @param {String} name 
	 * @param {Action} Action 
	 * @param {Boolean} force 
	 */
	registerAction(name, action, force = false){
		if( this.actions[name] && !force ){
			console.warn("Element: Cannot override this action, use force=true to override");
			return; 
		}
		this.actions[name] = action.bind(this)
	}

	/**
	 * Delete an action with his name
	 * @param {String} name 
	 */
	deleteAction(name){
		this.actions[name] = null;
	}

	/**
	 * Execute an action with his name
	 * @param {String} name  
	 * @param {Object} params : Params passed to the action callback 
	 */
	execute(name, params){
		if( this.actions[name] ){
			this.actions[name].call(this, params);
		}
	}


	/************* Callbacks *************/

	onAttachToFragment() {}

}

export default Element;
