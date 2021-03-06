import Mesh from "./../Mesh.js"
import Animation from "./../../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Space extends Mesh {
	constructor(params){
		super(params);
		this.geometry = new THREE.PlaneGeometry( 5, 20, 32 );
		this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.name = "space";
		this.loaded = true;
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

	}
}

export default Space;