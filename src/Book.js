
import Scene from "./Scene.js"
import Navigator from "./Navigator.js";
import Event from "./utils/Event.js";

/**
 * Represents the all book
 * @param title : String
 * @param author : String
 * @param fragments : [Fragment]
 */

class Book extends Event {

  /**
   * @constructor
   * @param {Object} params 
   */
	constructor(params){
		super();
		this.id = params.id ? params.id : null; 
		this.eventsList = ["fragment:add", "fragment:start", "start", "alert"];
		this.fragments = [];
		this.author = null;
		this.title = null;
    this.debug = params && params.debug === true ? true : false; 
		this.navigator = new Navigator(this);
		this.scene = new Scene(this);
  }
  
  /**
   * Update the current fragment
   * - Stop actual fragment
   * - Update fragment
   * - Start new fragment
   * @param {Fragment} fragment
   */
  set currentFragment(fragment) {
		if( this._currentFragment)
			if( this._currentFragment.stop )
				this._currentFragment.stop();

		this._currentFragment = fragment;
		this._currentFragment.start();
		this.dispatch("fragment:start", fragment);
	}

  /**
   * The current fragment played in scene
   * @return {Fragment}
   */
	get currentFragment() {
		return this._currentFragment;
	}

  /**
   * Add a fragment to book
   * @param {Fragment} fragment 
   */
	addFragment(fragment){
		fragment.book = this;
		this.dispatch("fragment:add", { fragment: fragment });
		this.fragments.push(fragment);
		this.mapChildren(fragment);

		if( this.scene ){
      // Init fragment to register all actions & element and start aynchronous loading
			fragment.init();	
		}
	}

  /**
   * Create links between fragments
   * @param {Fragment} fragment
   */
	mapChildren(fragment) {
		if( fragment.id ) {
			var i = null;
			this.fragments.forEach(f => {
				i = f.childrenLinks.indexOf( fragment.id ); 
				if( i >= 0 ){
					f.children[i] = fragment;
				}
			})
		}
	}

  /**
   * Start the book
   * @param {Fragment} fragment 
   */
	start(fragment = null){		
		this.currentFragment = this.fragments[0];
		this.dispatch("start", this.currentFragment);
	}

}


export default Book;
