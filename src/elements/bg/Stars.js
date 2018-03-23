import Mesh from "./../Mesh.js"
import Animation from "./../../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Stars extends Mesh {
	constructor(params){
		super(params);
		let starGeo = new THREE.SphereGeometry(8,8,1)
		let starMat = new THREE.MeshBasicMaterial({color: 0xffffff})
        this.mesh = new THREE.Group()

		for(let i = 0; i < 100; i++) {
			let star = new THREE.Mesh(starGeo, starMat)
			star.position.x = Math.random()*500-250
			star.position.y = Math.random()*100+100
			star.position.z = Math.random()*500-250

			star.scale.x = 0.3
			star.scale.y = 0.3
            star.scale.z = 0.3
            this.mesh.add(star)

		}
		this.mesh.name = "stars";
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

	}
}

export default Stars;