window.THREE = require("three")
import OrbitControls from './utils/OrbitControl.js'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import Event from "./utils/Event.js"
import ParallaxControl from './utils/ParallaxControls'
var fxaa = require('three-shader-fxaa')

/** 
 * The threejs scene. It persist during the all livecycle of Book
 */
class Scene extends Event {

	/**
	 * Create the THREE.js Scene, camera, renderer and create layer groups
	 */
	constructor(book){
    super();
    this.eventsList = ["click"];
		this.book = book;
		this.canvas = document.getElementById("canvas");
		this.threeScene = new THREE.Scene();
    
    this.fov = 65;
		this.camera = new THREE.OrthographicCamera(this.fov/- 2, this.fov / 2, this.fov ,-5, -1000, 1000 );
    this.camera.position.set(0, 0, 20);

		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
		this.renderer.setClearColor( 0xffffff, 1 );
    this.composer = new EffectComposer(this.renderer)
		this.composer.addPass(new RenderPass(this.threeScene, this.camera))
    
    this.onResize();
    this.initAntialias();
    this.initLights();
    this.initControls();
		this.initListeners()
    this.initGroups();
    this.initRaycaster();
    
    this.renderer.sortObjects = false
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  /**
   * Init orbit control OR paralax
   */
  initControls(){
		if( this.book.debug ){
			this.controls = new OrbitControls( this.camera );
			this.controls.rotateSpeed = 1
			this.controls.update();
    }
    
    this.pControls = new ParallaxControl({camera: this.camera, canvas: this.canvas})
  }

  /**
   * Init Raycaster
   */
  initRaycaster(){
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clicked = false;
  }
  
  /**
   * Init ShaderPass to manage antialias
   */
  initAntialias(){
		const fxaaPass = new ShaderPass(fxaa())
		fxaaPass.renderToScreen = true
		this.composer.addPass(fxaaPass)

		fxaaPass.uniforms.resolution.value.x = window.innerWidth
		fxaaPass.uniforms.resolution.value.y = window.innerHeight
  }

  /**
   * Init ambient light
   */
  initLights(){
		this.threeScene.add( new THREE.AmbientLight( 0xfffffff, 0.9 ) );
		var directionalLight = new THREE.DirectionalLight( 0xeeeeee, 1 );
		directionalLight.position.x  = 2
		directionalLight.position.y  = 2
		directionalLight.position.z  = 2
  }

  /**
   * Manage listener
   */
	initListeners() {
    window.addEventListener('resize', this.onResize.bind(this))
    window.addEventListener('click', this.onClick.bind(this))
  }

	onResize() {
		var winWidth = window.innerWidth
		var winHeight = window.innerHeight

    this.camera.aspect = window.innerWidth/window.innerHeight
		this.camera.left = this.fov*(winWidth/winHeight) / -2;
		this.camera.right = this.fov*(winWidth/winHeight) / 2;
		this.camera.top = this.fov;
		this.camera.bottom = -5;

		this.camera.updateProjectionMatrix();	
    this.renderer.setSize(winWidth, winHeight)
    
    if(this.book._currentFragment) {
      this.book._currentFragment.elements.forEach(mesh => {
        if(mesh.type == "obj3D") {
          mesh.resize(this.winWidth, this.winHeight)
        }
      });
    }
   
	}

  onClick(event){
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.clicked = true; 
  }

	/**
	 * Call the renderer & manage raycaster
	 */
	render(){
    if( this.clicked ) {
      this.clicked = false;
      this.raycaster.setFromCamera( this.mouse, this.camera );
      var intersects = this.raycaster.intersectObjects( this.mainGroup.children, true );
      
      this.dispatch("click", intersects );
    }
    if(this.pControls) {
      
      this.pControls.update()
    }

		this.composer.render(this.threeScene, this.camera);
	}

	/**	
	 * Init layer group
	 * - Background
	 * - Scene
	 * - Foreground
	 */
	initGroups(){
		this.bgGroup = new THREE.Group();
		this.fgGroup = new THREE.Group();
		this.mainGroup = new THREE.Group();

		this.bgGroup.name = "background";
		this.fgGroup.name = "foreground";
		this.mainGroup.name = "main";

		this.bgGroup.position.z = -6
		this.mainGroup.position.z = 0
		this.fgGroup.position.z = 6

		this.threeScene.add(this.bgGroup);
    this.threeScene.add(this.mainGroup);
    this.threeScene.add(this.fgGroup);
	}
  
	findElement(){

	}

	/**
	 * Add a new element to specific group according to it's position
	 * @param element : Element
	 */
	addElement(element){
    if( element.type !== "obj3D" ) {
      return; 
    }
    
		if (!element.loaded) {
			console.warn("Element \""+element.name+"\" not loaded yet, it will be append to scene later.")
			element.on("load", ()=>{
        if( element.mesh ){
          this.addElement(element);
        }
			})
			return;
    }
    console.log("Add element", element.name);
		switch( element.group ){
			case "background" : this.bgGroup.add(element.mesh); break;
			case "foreground" : this.fgGroup.add(element.mesh); break;
			default: this.mainGroup.add(element.mesh);
		}
	}


	/**
	 * Remove an element in its group
	 * @param element : Element
	 */
	removeElement(element){
		console.log(element, element.group, element.name);
		switch( element.group ){
			case "background" : this.bgGroup.remove(element.mesh); break;
			case "foreground" : this.fgGroup.remove(element.mesh); break;
			default: this.mainGroup.remove(element.mesh);
		}
	}

}

export default Scene;
