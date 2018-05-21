import Mesh from "./../Mesh.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Stars extends Mesh {
	constructor(params){
		super(params);
		super(params);
		this.eventsList.push("load:map");
		this.fit = params.fit || true;
		this.map = params.map;
		this.depth = params.depth;
		this.transparent = params.transparent;
		this.opacity = this.opacity >= 0 ? this.opacity : 1;
		this.count = params.count;
		this.init()
		this.loadMap()
	}

	init() {
		this.geometry = new THREE.BufferGeometry()
		this.material = new THREE.PointsMaterial({color: 0x888888, size: 0.1})

		this.positions = new Float32Array(this.count*3)
		let positionsIterator = 0
		for (let i = 0; i < this.count; i++) {
			this.positions[positionsIterator++] = Math.random()*20
			this.positions[positionsIterator++] = Math.random()*20
			this.positions[positionsIterator++] = -1
		}

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3))	
		this.mesh = new THREE.Points(this.geometry, this.material) 
	}

	loadMap() {
		// this.loader = new THREE.TextureLoader()
		// this.loader.load(this.map, map => {
		// 	this.mesh.material.map = map
			
		// })

		this.loaded = true
		this.dispatch('load')
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

	}
}

export default Stars;