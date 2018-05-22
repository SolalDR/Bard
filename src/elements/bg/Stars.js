import Mesh from "./../Mesh.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */

let vert = `
varying vec2 vUv;

void main() {
	gl_PointSize = 20.;
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`
let frag = `
uniform sampler2D texture;

 varying vec2 vUv;
 
 void main() {
     gl_FragColor = texture2D(texture, gl_PointCoord);
 }`
 
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

	onAttachToFragment() {
		if(this.loaded ) {
		  this.positionStars()
		} 
		if(!this.loaded) {
		  this.on("load", ()=>{
			this.positionStars()
		  })
		}
	}

	// for(var i=0; i<10; i++) {
	// 	for(var j=0; j<10; j++){
	// 		var coord = {
	// 			x: i*40 + Math.random()*20 - 10,
	// 			y: i*40 + Math.random()*20 - 10
	// 		}
	// 	}
	// }

	positionStars() {
		this.mesh.geometry.attributes.position.needsUpdate  = true
		let camera = this.fragment.book.scene.camera
		let cameraLength = camera.right*2
		let starOffset = cameraLength / this.count
		console.log(starOffset)
		console.log(camera)
		let positionIterator = 0

		for (let i = 0; i < this.mesh.geometry.attributes.position.array.length; i++) {
			this.mesh.geometry.attributes.position.array[positionIterator++] = (i*starOffset + Math.random()*2-1)+camera.left
			this.mesh.geometry.attributes.position.array[positionIterator++] = Math.random()*40+20
			this.mesh.geometry.attributes.position.array[positionIterator++] = -20
			
		}
		console.log(this.mesh.geometry.attributes.position.array)
	}

	init() {
		this.geometry = new THREE.BufferGeometry()
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				texture: {
					type:'t',
					value: null
				}
			},
			vertexShader: vert,
			fragmentShader: frag,
			transparent: true,
			depthTest: false,
			depthWrite: false,
		})
		this.material.sizeAttenuation = false
		this.positions = new Float32Array(this.count*3)
		let positionsIterator = 0

		for (let i = 0; i < this.count; i++) {
			this.positions[positionsIterator++] = 0
			this.positions[positionsIterator++] = 0
			this.positions[positionsIterator++] = -20
		}

		this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3))	
		
		this.mesh = new THREE.Points(this.geometry, this.material) 
	}

	loadMap() {
		this.loader = new THREE.TextureLoader()
		this.loader.load(this.map, map => {
			
			this.mesh.material.uniforms.texture.value = map
			this.loaded = true
			this.dispatch('load')
		})

		
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

	}
}

export default Stars;