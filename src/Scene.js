window.THREE = require("three")
import OrbitControls from './utils/OrbitControl.js'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'

var fxaa = require('three-shader-fxaa')

/** 
 * The threejs scene. It persist during the all livecycle of Book
 */
class Scene {

	/**
	 * Create the THREE.js Scene, camera, renderer and create layer groups
	 */
	constructor(book){

		this.book = book;
		this.canvas = document.getElementById("canvas");
		this.threeScene = new THREE.Scene();
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
		this.camera.position.set(0, 5, 25);

		this.renderer = new THREE.WebGLRenderer( { 
			canvas: this.canvas,
		});
		this.renderer.setClearColor( 0x676FE8, 1 );
		
		this.composer = new EffectComposer(this.renderer)
		this.composer.addPass(new RenderPass(this.threeScene, this.camera))
	
		const fxaaPass = new ShaderPass(fxaa())
		fxaaPass.renderToScreen = true
		this.composer.addPass(fxaaPass)

		fxaaPass.uniforms.resolution.value.x = window.innerWidth
		fxaaPass.uniforms.resolution.value.y = window.innerHeight


		this.threeScene.add( new THREE.AmbientLight( 0xe1e1e1, 1 ) );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.x  = 2
		directionalLight.position.y  = 2
		directionalLight.position.z  = 2
		this.threeScene.add( directionalLight );

		if( this.book.debug ){
			this.controls = new OrbitControls( this.camera );
			this.controls.update();
		}


		this.renderer.setSize( window.innerWidth, window.innerHeight );

		this.initListeners()
		this.initGroups();

	}

	initListeners() {
		window.addEventListener('resize', this.onResize.bind(this))
	}

	onResize() {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight

		this.camera.aspect = this.winRatio;
		this.camera.updateProjectionMatrix();	
		this.renderer.setSize(this.winWidth, this.winHeight)
	}


	/**
	 * Call the renderer
	 */
	render(){
		this.composer.render();
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

		this.bgGroup.position.y = -5
		this.mainGroup.position.y = 0
		this.fgGroup.position.y = 1

		this.threeScene.add(this.bgGroup);
		this.threeScene.add(this.fgGroup);
		this.threeScene.add(this.mainGroup);
	}


	findElement(){

	}

	/**
	 * Add a new element to specific group according to it's position
	 * @param element : Element
	 */
	addElement(element){
		if(!element.mesh){
			console.warn("Element not loaded yet, it will be append to scene later.")
			element.on("load", ()=>{
				this.addElement(element)
			})
			return;
		}
		
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
		switch( element.group ){
			case "background" : this.bgGroup.remove(element.name); break;
			case "foreground" : this.fgGroup.remove(element.name); break;
			default: this.mainGroup.remove(element.name);
		}
	}

}

export default Scene;