import Mesh from "./../Mesh.js"
/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */

let vert = `
varying vec2 vUv;

void main() {
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`
let frag = `
uniform sampler2D texture;
uniform vec2 textureRes;
uniform vec2 resolution;

 varying vec2 vUv;
 
 void main() {
     float imgRatio = textureRes.x/textureRes.y;
     float screenRatio = resolution.x/resolution.y;
     vec4 color = vec4(0.);
     if(imgRatio > screenRatio) {
         color = texture2D(texture, vec2(vUv.x, vUv.y));
     } else {
         color = texture2D(texture, vec2(vUv.x, vUv.y));
     }

     
     gl_FragColor = color;
 }`
 
class Plane extends Mesh {
	constructor(params){
        super(params);
        this.fit = params.fit || true;
        this.imgUrls = params.imgUrls
        this.videoUrls = params.videoUrls
        this.alpha = params.alpha

        this.on("load", ()=>{
            this.mesh.position.z = params.z
        })
        
        this.geometry = new THREE.PlaneBufferGeometry(1,1,1)
		this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                texture : {
                    type:'t',
                    value : null
                },
                textureRes : {
                    type:'v2',
                    value : null
                },
                resolution : {
                    type:'v2',
                    value : {
                        x:window.innerWidth,
                        y: window.innerHeight,
                    }
                }
            },
            transparent: this.alpha
        })
        
      
        if(this.imgUrls) {
            this.loadTextureFromImg()
        }       

        if(this.videoUrls) {
            this.loadTextureFromVideo()
        }
      
	}


    onAttachToFragment() {
        if(this.fit && this.loaded ) {
            this.fitToScreen()
        } 
        if(!this.loaded) {
            this.on("load", ()=>{
                this.fitToScreen()
            })
        }
    }
	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){

    }

    createMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        
        this.mesh.name = "plane";
    }

    loadTextureFromVideo() {
        for(let i = 0; i < this.videoUrls.length; i++) {
            this.video = document.createElement('video')
          
            this.video.src = this.videoUrls[i]

            this.texture = new THREE.VideoTexture(this.video)
            

            this.mesh.material.uniforms.texture.value = this.texture
        }
    }

    loadTextureFromImg() {
        this.loader = new THREE.TextureLoader()
        this.loader.load(this.imgUrls[0], texture => {
            this.createMesh();
            this.texture = texture
            this.mesh.material.uniforms.texture.value = this.texture
            console.log(this.mesh)
            this.mesh.material.uniforms.textureRes.value = {
                x: this.texture.image.width,
                y: this.texture.image.height
            }
            this.material.uniforms.needsUpdate = true;
            this.loaded = true;
            this.display();
            this.fitToScreen();
        })    
    }
    
    fitToScreen() {
        let camera = this.fragment.book.scene.camera
        var vFOV = camera.fov * Math.PI / 180;
        // Get the visible height 
        console.log(camera.top)
        let distanceOfPlaneFromCamera = camera.position.z - this.mesh.position.z
        var height =  camera.top  +8;

        // If we want a width that follows the aspect ratio of the camera, then get the aspect ratio and multiply by the height.
        var aspect = window.innerWidth / window.innerHeight;
        var width = height * aspect;
        height = width * 2
        this.mesh.scale.set(width, height, 1)
        this.mesh.position.y = (height/2)-8 
    }
}

export default Plane;