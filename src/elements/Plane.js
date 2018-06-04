import Mesh from "./Mesh.js"
/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */

let vert = `
varying vec2 vUv;
varying vec3 vPos;

void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`
let frag = `
uniform sampler2D texture;
uniform vec2 textureRes;
uniform vec2 resolution;
uniform float opacity; 
uniform bool displacement;

varying vec2 vUv;
 varying vec3 vPos;

  uniform float time;
 void main() {
     float imgRatio = textureRes.x/textureRes.y;
     float screenRatio = resolution.x/resolution.y;
     vec4 color = vec4(0.);

     float hFrequency = 1.;
     float hAmplitude = 0.0005;
     float hSpeed = .1;
    vec2 noiseDispPos;
     if(displacement) {
      noiseDispPos = vec2(
        vUv.x,
        (sin(time*hAmplitude)*0.5+1.)*vUv.y
      );
     } else {
      noiseDispPos = vec2(
        vUv.x,
        vUv.y
      );
     }
    

     color = texture2D(texture, vec2(noiseDispPos.x, noiseDispPos.y));
     

     
     gl_FragColor = vec4(color.rgb, color.a*opacity);
 }`

class Plane extends Mesh {
  
  /**
   * @constructor
   */
  constructor(params){
    super(params);
    this.eventsList.push("load:map");
    this.fit = params.fit || true;
    this.map = params.map;
    this.depth = params.depth;
    this.transparent = params.transparent;
    this.opacity = this.opacity >= 0 ? this.opacity : 1;
    this.position = params.position ? params.position : {x: 0, y: 0, z: 0 + this.depth};
    this.displacement = params.displacement || false
    this.videoUrls = params.videoUrls // @TODO

    this.init();

    if(this.map) this.loadMap();
  }

  /**
   * Resize when the element is had to a fragment 
   */
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
   * @TODO
   */
  loadTextureFromVideo() {
    for(let i = 0; i < this.videoUrls.length; i++) {
      this.video = document.createElement('video');
      this.video.src = this.videoUrls[i];
      this.texture = new THREE.VideoTexture(this.video);
      this.mesh.material.uniforms.texture.value = this.texture;
    }
  }

  /**
   * Load map texture & dispatch load when done
   */
  loadMap() {
    this.loader = new THREE.TextureLoader()
    this.loader.load(this.map, texture => {

      // this.createMesh();
      this.texture = texture
      this.texture.anisotropy = 0;
      this.texture.magFilter = THREE.NearestFilter;
      this.texture.minFilter = THREE.NearestFilter;
      this.mesh.material.uniforms.texture.value = this.texture

      this.mesh.material.uniforms.textureRes.value = {
        x: this.texture.image.width,
        y: this.texture.image.height
      }

      this.material.uniforms.needsUpdate = true;
      this.currentPos = new THREE.Vector2(0,0)
      this.loaded = true;
      this.dispatch("load");

    })
  }
   
  /**
   * Adjust mesh scaling to fit the window 
   */
  fitToScreen() {
    let imgRatio = this.texture.image.width/this.texture.image.height;
    let camera = this.fragment.book.scene.camera
    var vFOV = camera.fov * Math.PI / 180;
    // Get the visible height 
    //let distanceOfPlaneFromCamera = new THREE.Vector3().copy(camera.position).sub(this.mesh.position)
    this.height =  camera.top + Math.abs(camera.bottom)*2;

    // If we want a width that follows the aspect ratio of the camera, then get the aspect ratio and multiply by the height.
    var aspect = window.innerWidth / window.innerHeight;
    this.width = this.height * aspect;
    if(imgRatio > 1) {
      this.height = this.width
      this.width = this.width * imgRatio
    } else {
      this.height = this.width / imgRatio
    }
   
    this.mesh.scale.set(this.width, this.height, 1)
    this.position.y = (this.height/2) - Math.abs(camera.bottom)*2-((camera.top)*0.05)-this.currentPos.y
    this.mesh.position.y = this.position.y
    this.position.x = (this.width/2)-Math.abs(camera.left)-((camera.right*2)*0.025)-this.currentPos.x
    this.mesh.position.x = this.position.x
    console.log(this.currentPos.x)
  }

  meshScale() {
    this.mesh.scale.set(this.width*0.5, this.height*0.5, 1)
  }
  /**
   * Init geometry, material & mesh
   */
  init(){
    this.geometry = new THREE.PlaneBufferGeometry(1,1,1)
    this.material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        texture : { type:'t', value : null },
        textureRes : { type:'v2', value : null },
        resolution : { type:'v2', value : { x: window.innerWidth, y: window.innerHeight } },
        opacity : {
          type:'f',
          value : this.opacity
        },
        time : {
          type:'f',
          value : 0
        },
        displacement : {
          type:'b',
          value : this.displacement
        }
      },
      transparent: this.transparent,
      depthTest: false,
      depthWrite: false,
      // alphaTest: 0.5
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = this.depth;
    this.mesh.name = this.name;
  }
  render(clock) {
    this.renderAnims(17)
    this.mesh.material.uniforms.time.value += clock.delta
  }
  resize(width, height) {
    // this.fitToScreen()
  }
}

export default Plane;
