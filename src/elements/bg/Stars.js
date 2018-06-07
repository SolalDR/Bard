import Mesh from "./../Mesh.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */

let vert = `
attribute float rank;
varying vec2 vUv;
varying float vRank;

uniform float size;
uniform float time;

void main() {
	gl_PointSize = size+(sin(time+rank*5.5)*10.);
    vUv = uv;
    vRank = rank;
    // vec3 newPos = 2.0 * cross( vec3(0.,.2,0.), cross( vec3(0.,.2,0.), position ) + .3 * position )*100.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`

let frag = `
varying vec2 vUv;
 varying float vRank;

uniform float time;
uniform sampler2D texture;

 

 void main() {
   vec4 color =  texture2D(texture, gl_PointCoord.xy);
   float alpha = max(cos(time*2.5+(vRank)),0.4);
     gl_FragColor =vec4(color.rgb, color.a*alpha);
 }`
 
class Stars extends Mesh {

	constructor(params){
		super(params);
		this.eventsList.push("load:map");
		this.fit = params.fit || true;
    this.map = params.map;
    this.time = 0
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
		let positionIterator = 0

		for (let i = 0; i < this.mesh.geometry.attributes.position.array.length; i++) {
			this.mesh.geometry.attributes.position.array[positionIterator++] = (i*starOffset + Math.random()*2-1)+camera.left
			this.mesh.geometry.attributes.position.array[positionIterator++] = Math.random()*camera.top/2+camera.top/2
			this.mesh.geometry.attributes.position.array[positionIterator++] = Math.random()*(-100)-20			
		}
	}

	init() {
		this.geometry = new THREE.BufferGeometry()
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				texture: {
					type:'t',
					value: null
        }, 
        size: {
          type:'f',
          value: 30
        },
        time: {
          type:'f',
          value : 0,
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
    this.rank = new Float32Array(this.count)
    let positionsIterator = 0
    let rankIterator = 0

		for (let i = 0; i < this.count; i++) {
			this.positions[positionsIterator++] = 0
			this.positions[positionsIterator++] = 0
      this.positions[positionsIterator++] = -20
      this.rank[rankIterator++] = i
		}

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3))	
    this.geometry.addAttribute('rank', new THREE.BufferAttribute(this.rank, 1))	
		
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
    this.renderAnims(17)
    this.mesh.material.uniforms.time.value = clock.elapsed/1000
  }
  
  resize() {
    // this.positionStars()
  }
}

export default Stars;
