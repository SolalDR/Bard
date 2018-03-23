import Mesh from "./Mesh.js"
import Animation from "./../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Floor extends Mesh {
	constructor(params){
		super(params);
        let floorGeo = new THREE.PlaneGeometry(100, 100, 2, 2)
		let floorMat = new THREE.MeshBasicMaterial({ color: 0xefefef, side: THREE.DoubleSide })
		this.mesh = new THREE.Mesh(floorGeo, floorMat)
		this.mesh.rotation.set(-Math.PI / 2, 0, 0)
		this.mesh.name = "floor";
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

	}
}

export default Floor;