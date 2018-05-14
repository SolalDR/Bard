import OBJLoader from '../utils/OBJLoader'
import MTLLoader from '../utils/MTLLoader'
import Element from "./../Element.js"
import Animation from "./../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Mesh extends Element {
	constructor(params){
		super(params);
		this.type = "obj3D";
		this.eventsList = ["load"];
		this.fragment = null; // Lateinit
		this.group = params.group ? params.group : "main";

		if( params.name ){
			this.name = params.name
		} else {
			this.name = Element.randomName();
			console.warn("Name is randomly : "+this.name);
		}

		if( params.mesh ){
			this.mesh = params.mesh;
			this.mesh.name = this.name;
			this.loaded = true; 
		} else {
			this.mesh = null;	
		}
	}

	setMesh(mesh, config) {
		this.mesh = mesh; 
		this.mesh.name = this.name;
		// this.mesh.material.side = THREE.DoubleSide
		if(config.scale) {
			this.mesh.scale.set(config.scale, config.scale, config.scale)
		}
		
		if(config.position) {
			this.position = config.position		
			this.mesh.position.set(config.position.x, config.position.y, config.position.z)
		}	

		if(config.rotation) {
			this.mesh.rotation.set(rotation.x, rotation.y, rotation.z)
		}

    

    this.loaded = true;
    console.log(this)
    this.dispatch("load")
	}

	static fromObj(params) {
		let mesh = new Mesh({
			group:"scene"
    }); 
    console.log(params)
		if(params.mtl) {
			let mtlLoader = new THREE.MTLLoader()
		
			mtlLoader.load(params.mtl, (materials)=>{
				materials.preload()
				let loader = new OBJLoader();
				loader.setMaterials(materials)
				loader.load(
					params.obj,
					(object)=> {
						let obj = object
						for(let i = 0; i< object.children.length; i++) {	
							object.children[i].material.alphaTest = 0.
							object.children[i].material.depthTest = false
							object.children[i].material.depthWrite = false
						}
            mesh.setMesh(obj, params.config, params.position);
					},
          ( xhr ) => {},
          ( error ) => {
						console.log( 'An error happened' );
					}
				);
			})
		}
	
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
		if( this.fragment && this.fragment.book && this.fragment.book.scene ){
			this.fragment.book.scene.removeElement(this); 
			return;
		}
		console.warn("Book not started. Cannot remove elements to fragment");
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

export default Mesh;
