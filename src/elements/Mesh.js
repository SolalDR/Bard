<<<<<<< Updated upstream

import Element from "./../Element.js"
import Animation from "./../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Mesh extends Element {
	constructor(params){
		super(params);

		this.fragment = null; // Lateinit
		this.group = params.group;

		if( params.mesh ){
			this.mesh = params.mesh;
			this.mesh.name = this.name;
			this.loaded = true; 
		} else {
			this.mesh = null;	
		}
	}

	/*************************
	*
	*	Animation & Control
	*
	**************************/
	
	/** 
	 * Create a rotation animation from the current rotation Y value
	 * @param angle (Float)
	 */
	rotateY(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: this.mesh.rotation.y + angle,
			speed: 0.05,
			onProgress: (advancement, value) =>{ this.mesh.rotation.y = value; },
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}


	/**
	 * Create a rotation animation to the angle specified
	 * @param angle (Float) [0..2*Pi]
	 */
	rotateYTo(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: angle,
			onProgress: (advancement, value) => {
				this.mesh.rotation.y = value;
			},
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}

	/*************************
	*
	*		Attachement
	*
	**************************/

	/** 
	 * Minimum required to attach an element to the scene
	 */ 
	display(){
		if( this.fragment && this.fragment.book && this.fragment.book.scene ) {
			this.fragment.book.scene.addElement(this); 
			return;
		}
		console.warn("Book not started. Cannot add elements to fragment");
	}

	/** 
	 * @TODO
	 * Minimum required to detach an element to the scene
	 */ 
	hide(){

	}


	/*************************
	*
	*		Rendering
	*
	**************************/


	// renderAnims(){
	// 	var diff;
	// 	var anims = [];
	// 	var finished;
	// 	for(var i=0; i<this.anims.length; i++){
	// 		diff = this.anims[i].to - this.anims[i].from;
	// 		finished = false

	// 		// If from < to 
	// 		if (diff > this.anims[i].step) {
	// 			this.anims[i].from += this.anims[i].step
	// 		// If from > to
	// 		} else if (diff < -this.anims[i].step ){
	// 			this.anims[i].from -= this.anims[i].step
	// 		// If diff < step
	// 		} else {
	// 			finished = true; 
	// 		}


	// 		this.anims[i].frame(this.anims[i].from)
	// 		if( !finished ) anims.push(this.anims[i]);
	// 	}

	// 	this.anims = anims;
	// }
	/**
	 * Render the list of all animations
	 */
	renderAnims(){
		var diff;
		var anims = [];
		var finished;
		for(var i=0; i<this.anims.length; i++){
			this.anims[i].render(16);
		}
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){}
}

=======
import OBJLoader from '../utils/OBJLoader'
import Element from "./../Element.js"
import Animation from "./../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Mesh extends Element {
	constructor(params){
		super(params);
		this.type = "Mesh"
		this.eventsList = ["load"]

		this.fragment = null; // Lateinit
		this.group = params.group;

		if( params.mesh ){
			this.mesh = params.mesh;
			this.mesh.name = this.name;
			this.loaded = true; 
		} else {
			this.mesh = null;	
		}
	}

	setMesh(mesh, scale, position) {
		this.mesh = mesh; 

		if(scale) {
			this.mesh.scale.x = scale
			this.mesh.scale.y = scale
			this.mesh.scale.z = scale
		}
		
		if(position) {
			this.mesh.position.x = position.x
			this.mesh.position.y = position.y
			this.mesh.position.z = position.z
		}	

		this.loaded = true;
		this.dispatch("load")
	}

	static fromObj(params) {
		let mesh = new Mesh({
			group:"scene"
		}); 
		
		let loader = new OBJLoader();

		loader.load(
			params.path,
			(object)=> {
				let obj = object

				mesh.setMesh(obj, params.scale, params.position);							
			},
			 ( xhr ) => {

				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		
			},
			// called when loading has errors
			 ( error ) => {
		
				console.log( 'An error happened' );
		
			}
		);
		
		return mesh;
	}

	/*************************
	*
	*	Animation & Control
	*
	**************************/
	
	/** 
	 * Create a rotation animation from the current rotation Y value
	 * @param angle (Float)
	 */
	rotateY(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: this.mesh.rotation.y + angle,
			speed: 0.05,
			onProgress: (advancement, value) =>{ this.mesh.rotation.y = value; },
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}


	/**
	 * Create a rotation animation to the angle specified
	 * @param angle (Float) [0..2*Pi]
	 */
	rotateYTo(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: angle,
			onProgress: (advancement, value) => {
				this.mesh.rotation.y = value;
			},
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}

	/*************************
	*
	*		Attachement
	*
	**************************/

	/** 
	 * Minimum required to attach an element to the scene
	 */ 
	display(){
		if( this.fragment && this.fragment.book && this.fragment.book.scene ) {
			this.fragment.book.scene.addElement(this); 
			return;
		}
		console.warn("Book not started. Cannot add elements to fragment");
	}

	/** 
	 * @TODO
	 * Minimum required to detach an element to the scene
	 */ 
	hide(){

	}


	/*************************
	*
	*		Rendering
	*
	**************************/

	/**
	 * Render the list of all animations
	 */
	renderAnims(delta){
		var diff;
		var anims = [];
		var finished;
		for(var i=0; i<this.anims.length; i++){
			this.anims[i].render(delta);
		}
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){
		this.renderAnims(clock.delta);
	}
}

>>>>>>> Stashed changes
export default Mesh;