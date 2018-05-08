import Mesh from "./Mesh.js"
import * as THREE from "three"

/**
 * A character with rigs
 */
class Character extends Mesh {
	
	static get MODE_DEBUG(){ return 1; }

	constructor(params){
		super(params);
		this.type = "obj3D";
		window.char = this;
		this.resourceUrl = params.model ? params.model : "/src/assets/obj/test.json";
		this.action = "walk";
		this.anims = [];
		this.mode = 

		this.config = {
			skeleton: false,
			stepSize: 1.0,
			defaultDuration: 3.5,
			timeScale: 1.0,
			weight: {
				idle: 0.0, 
				walk: .8,
				run: 0.0
			}
		}
		this.loader = new THREE.JSONLoader()
		this.loader.load( "/src/assets/obj/head.json",  ( loadedObject ) => {
			this.firstGeo = loadedObject
			console.log(loadedObject)
			let mat = new THREE.MeshBasicMaterial()
			this.mesh2 = new THREE.SkinnedMesh(loadedObject,mat )
			this.skinIndices = this.mesh2.geometry.skinIndices
			this.skinWeights = this.mesh2.geometry.skinWeights
			// this.mesh2.updateMatrix()
		})
		this.loader.load( this.resourceUrl,  ( loadedObject ) => {
			loadedObject.merge(this.mesh2.geometry, this.mesh2.matrix)
			let mat = new THREE.MeshBasicMaterial()
			mat.skinning = true
			for (let index = 0; index < this.skinIndices.length; index++) {
				loadedObject.skinIndices.push(this.skinIndices[index ])
				loadedObject.skinWeights.push(this.skinWeights[index ])
				
			}
		
			this.mesh = new THREE.SkinnedMesh(loadedObject,mat )
			console.log(this.mesh)
			this.mesh.rotation.set(0,Math.PI/3,0)
			this.mesh.material.transparent = true
			this.mesh.material.side = THREE.DoubleSide
			this.mesh.material.opacity = 0.5
			// this.mesh.children[0].children[0].add(new THREE.Mesh(new THREE.BoxGeometry(6,6,6), new THREE.MeshBasicMaterial({color:"black"})))
			 this.mesh.scale.set(10.,10.,10.)
			 var helper = new THREE.SkeletonHelper( this.mesh );
			// loadedObject.traverse( ( child ) => {
			// 	if ( child instanceof THREE.SkinnedMesh ) {
			// 		this.mesh = child;
			// 	}
			// } );
			// for (let index = 0; index < this.mesh.skeleton.bones.length; index++) {
			// 	this.mesh.skeleton.bones[index].children[0].add(new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({color:"black"})))

			// }
			if ( this.mesh === undefined ) {
				alert( 'Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n' );
				return;
			}
			
			this.mixer = new THREE.AnimationMixer( this.mesh );
			console.log(loadedObject)
			this.walkAction = this.mixer.clipAction(loadedObject.animations[0]);
			this.walkAction.enabled = true
			this.actions = [  this.walkAction ];
			
			this.loaded = true;
			this.display();

			this.activateAllActions();
		});

		window.addEventListener("keydown", (e) => {
			if( [38, 40, 37, 39].indexOf(e.keyCode) < 0){ return; }
			this.hasKeyPress = true; 
			
			var targetRotation = this.mesh.rotation.y;
			switch(e.keyCode){
				case 38 : targetRotation = 0; break;// TOP
				case 40 : targetRotation = Math.PI; break; // Bottom
				case 37 : targetRotation = Math.PI/2; break; // Left
				case 39 : targetRotation = -Math.PI/2; break; // Right
			}

			if( this.action !== "walk" ){
				this.rotateYTo(targetRotation);
				this.walk();
			}
			
		})

		window.addEventListener("keyup", (e) => {
			if( [38, 40, 37, 39].indexOf(e.keyCode) < 0){ return; }
			
			this.hasKeyPress = false; 
			if( this.action !== "idle" && !this.hasKeyPress){
				this.idle();
			}
		})
	}



	walk(){
		if( this.mode == Character.MODE_DEBUG ){
			console.log("Walk");	
		}
		if( this.action == "idle" ){
			this.prepareCrossFade( this.idleAction, this.walkAction, 1.0 )	
		} else if( this.action == "run" ){
			this.prepareCrossFade( this.runAction, this.walkAction, 1.0 )	
		}
		this.action = "walk"
	}

	run(){
		if( this.mode == Character.MODE_DEBUG ){
			console.log("Run");	
		}
		if( this.action == "idle" ){
			this.prepareCrossFade( this.idleAction, this.runAction, 1.0 )	
		} else if( this.action == "walk" ){
			this.prepareCrossFade( this.walkAction, this.runAction, 1.0 )	
		}
		this.action = "run"
	}

	idle(){
		if( this.mode == Character.MODE_DEBUG ){
			console.log("Idle");	
		}
		if( this.action == "run" ){
			this.prepareCrossFade( this.runAction, this.idleAction, 1.0 )	
		} else if( this.action == "walk" ){
			this.prepareCrossFade( this.walkAction, this.idleAction, 1.0 )	
		}
		this.action = "idle"
	}


	prepareCrossFade( startAction, endAction, duration ) {
		// Switch default / custom crossfade duration (according to the user's choice)
		if(!duration) duration = this.config.defaultDuration
		// Make sure that we don't go on in singleStepMode, and that all actions are unpaused
		this.singleStepMode = false;
		this.unPauseAllActions();
		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop
		if ( startAction === this.idleAction ) {
			this.executeCrossFade( startAction, endAction, duration );
		} else {
			this.synchronizeCrossFade( startAction, endAction, duration );
		}
	}

	synchronizeCrossFade( startAction, endAction, duration ) {
		
		var onLoopFinished = function( event ) {
			if ( event.action === startAction ) {
				//this.mixer.removeEventListener( 'loop', onLoopFinished.bind(this) );				
			}
		}

		this.executeCrossFade( startAction, endAction, duration );
		// this.mixer.addEventListener( 'loop', onLoopFinished.bind(this) );
	}

	setCrossFadeDuration( defaultDuration ) {
		// Switch default crossfade duration <-> custom crossfade duration
		if ( this.settings[ 'use default duration' ] ) {
			return defaultDuration;
		} else {
			return this.settings[ 'set custom duration' ];
		}
	}

	/**
	 * Start action to mix 2 different action
	 * The end action must have a weight 1
	 */
	executeCrossFade( startAction, endAction, duration ) {
		
		this.setWeight( endAction, 1 );
		
		endAction.time = 0; // Reset time 
		
		// Crossfade with warping - you can also try without warping by setting the third parameter to false
		startAction.crossFadeTo( endAction, duration, true );
	}

	/**
	 * Unpause all the action to prepare cross fade 
	 * (all actions must be playing to fade)
	 */
	unPauseAllActions() {
		this.actions.forEach( function ( action ) {
			action.paused = false;
		} );
	}

	/**
	 * Pause all the action 
	 */
	pauseAllActions() {
		this.actions.forEach( function ( action ) {
			action.paused = true;
		} );
	}

	/**
	 * Toggle actions
	 * If actions are paused, start the anims else, stop the anims
	 */
	pauseContinue() {
		if ( this.singleStepMode ) {
			this.singleStepMode = false;
			this.unPauseAllActions();
		} else {
			if ( this.idleAction.paused ) {
				this.unPauseAllActions();
			} else {
				this.pauseAllActions();
			}
		}
	}

	/**
	 * Stop all the action
	 */
	deactivateAllActions() {
		this.actions.forEach( function ( action ) {
			action.stop();
		} );
	}

	/** 
	 * Activate all actions and set based status
	 */
	activateAllActions() {
		console.log(this.walkAction)
		this.setWeight( this.walkAction, this.config.weight.walk );
		this.actions.forEach( function ( action ) {
			action.play();
		} );
	}

	/**
	 * SingleStepMode
	 */
	toSingleStepMode() {
		this.unPauseAllActions();
		this.singleStepMode = true;
		this.sizeOfNextStep = this.config.stepSize;
	}

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))
	setWeight( action, weight ) {
		action.enabled = true;
		action.setEffectiveTimeScale( 1 );
		action.setEffectiveWeight( weight );
	}

	display(){
		if( this.mesh ) {
			super.display();
		}
	}

	hide(){

	}

	render(clock){
		if( this.loaded ){
			this.walkWeight = this.walkAction.getEffectiveWeight();

			this.renderAnims();
			
			this.mixerUpdateDelta = clock.delta / 1000

			// If in single step mode, make one step and then do nothing (until the user clicks again)
			if ( this.singleStepMode ) {
				this.mixerUpdateDelta = this.sizeOfNextStep;
				this.sizeOfNextStep = 0;
			}

			this.mixer.update( this.mixerUpdateDelta);
		}
	
	}

}

export default Character