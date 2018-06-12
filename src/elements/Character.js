import Mesh from "./Mesh.js"
import * as THREE from "three"
import GLTFLoader from './../utils/glTFLoader'
/**
 * A character with rigs
 */
class Character extends Mesh {
	
	static get MODE_DEBUG(){ return 1; }

	constructor(params){
    super(params);
    this.type = "obj3D";
    this.isChar = true;
    this.morphTargets = params.morphTargets ? true : false
    window.char = this;
    this.visible = params.visible ? true : false
    this.mainChar = params.mainChar ? true : false
    this.hide = params.hide ? true : false
		this.resourceUrl = params.model ? params.model : "/examples/obj/rig2.glb";
    this.action = "walk";
    this.actions = []
    this.actionNames = [];
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
    
    this.loader = new GLTFLoader()
    this.loader.setCrossOrigin = "anonymous"
		this.loader.load( this.resourceUrl,  ( gltf ) => {
			gltf.scene.traverse((child)=> {
        
        if (child.isMesh) {
          if(this.morphTargets) {
            // let mat = new THREE.MeshBasicMaterial()
              let color = child.material.color
              
              let opacity = child.material.opacity
              // child.material = mat
              child.material.color = color
              if(this.hide) {
                child.material.opacity = 0
              } else {
                child.material.opacity = opacity
              }
              
              child.material.realOpacity = opacity
              child.material.transparent = true
              child.material.depthTest = false
              child.material.depthWrite = false
              child.material.morphTargets = true
          } else {      
            if(child['material']) {
              let mat = new THREE.MeshBasicMaterial()
              let color = child.material.color
              let opacity = child.material.opacity
              child.material = mat
              child.material.color = color
              if(this.hide) {
                child.material.opacity = 0
              } else {
                child.material.opacity = opacity
              }
              
             

              child.material.realOpacity = opacity
              child.material.transparent = true
              child.material.depthTest = false
              child.material.depthWrite = false
              child.material.side = THREE.DoubleSide
              child.name = child.parent.parent.name
              
              if(this.mainChar) {
                var matches = child.name.match(/\d+/g);
                if (matches[0] != 1) {
                  child.visible = false
                }
              }
            }
          }
        }
      })


      this.mesh = new THREE.Group()
      this.mesh.name = this.name;
      this.mesh.add(gltf.scene)

			if ( this.mesh === undefined ) {
				alert( 'Unable to find a SkinnedMesh in this place:\n\n' + url + '\n\n' );
				return;
      }
      
      this.mixer = new THREE.AnimationMixer( gltf.scene );
      for(let i=0; i< gltf.animations.length; i++) {
        // console.log(this.mixer.clipAction(gltf.animations[i])._clip.name)
        if (this.mixer.clipAction(gltf.animations[i])._clip.name.indexOf('Armature|') > -1)
        {
          this.mixer.clipAction(gltf.animations[i])._clip.animName = this.mixer.clipAction(gltf.animations[i])._clip.name.replace('Armature|', "")

        } else if(this.mixer.clipAction(gltf.animations[i])._clip.name.indexOf('Armature.001|') > -1) {
          this.mixer.clipAction(gltf.animations[i])._clip.animName = this.mixer.clipAction(gltf.animations[i])._clip.name.replace('Armature.001|', "")
        }

        this.actions.push(this.mixer.clipAction(gltf.animations[i]))
        this.actionNames.push(this.actions[i]._clip.name)
      } 

      this.loaded = true;
      this.dispatch("load");
      
			this.activateAllActions();
		});
	}

  /**
   * Return an action 
   * @param {String} name 
   */
  getAnimationByName(name){
    for(var i=0; i<this.actions.length; i++){
      if(this.actions[i]._clip.animName === name){
        console.log(this.actions[i]._clip.name)
        return this.actions[i];
      }
    }
    console.warn("----------- Character: Animation with name "+name+" doesn't exist.")
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
		// this.setWeight( this.walkAction, this.config.weight.walk );
		this.actions.forEach( function ( action ) {
			// action.play();
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

	render(clock){
		if( this.loaded ){
      for (let i = 0; i < this.actions.length; i++) {
        this.actions[i].getEffectiveWeight();
        
      }
	
		  this.mixerUpdateDelta = clock.delta / 1000
      this.renderAnims(clock.delta );

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
