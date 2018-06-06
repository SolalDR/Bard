import OBJLoader from '../utils/OBJLoader'
import MTLLoader from '../utils/MTLLoader'
import Element from "./../Element.js"
import Animation from "./../utils/Animation.js"

/**
 * An element in a THREE.js scene.
 * Can be animated and hooked thanks to event
 */
 
class Mesh extends Element {
	constructor(params){
		super(params);
		this.type = "obj3D";
		this.eventsList = ["load", "click"];
		this.fragment = null; // Lateinit
		this.group = params.group ? params.group : "main";
    this.clickable = params.clickable ? params.clickable : false;
    this.position = params.position ? params.position : new THREE.Vector3(0,0,0)
    this.rotation = params.rotation ? params.rotation : new THREE.Vector3(0,0,0)
    this.scale = params.scale ? params.scale : 1

    if( params.name ){
			this.name = params.name
		} else {
			this.name = Element.randomName();
			console.warn("Name is randomly : "+this.name);
		}

		if( params.mesh ){
      
			this.mesh = params.mesh;
			this.mesh.name = this.name;
      this.loaded = true; 
		} else {
			this.mesh = null;	
		}
	}

	setMesh(mesh, config) {
		this.mesh = mesh; 
		this.mesh.name = this.name;
		// this.mesh.material.side = THREE.DoubleSide
		if(config.scale) {
			this.mesh.scale.set(config.scale, config.scale, config.scale)
		}
		
		if(config.position) {
			this.position = config.position		
			this.mesh.position.set(config.position.x, config.position.y, config.position.z)
		}

		if(config.rotation) {
			this.mesh.rotation.set(rotation.x, rotation.y, rotation.z)
    }
    
    this.loaded = true;
    this.dispatch("load")
	}

	static fromObj(params) {
		let mesh = new Mesh({ group: params.group ? params.group : "scene" });

    function loadObj(materials = null) {
      let loader = new OBJLoader();
      if( materials ) loader.setMaterials(materials)
      loader.load(
        params.obj,
        (object)=> {
          let obj = object
          for(let i = 0; i< object.children.length; i++) {	
            object.children[i].material.depthTest = false
            object.children[i].material.depthWrite = false
          }
          mesh.setMesh(obj, params.config, params.position);
        },
        ( xhr ) => {},
        ( error ) => {
          console.log( 'An error happened' );
        }
      );
    };

		if(params.mtl) {
			let mtlLoader = new THREE.MTLLoader()
			mtlLoader.load(params.mtl, (materials)=>{
        materials.preload()
        loadObj(materials);
			})
    } else if(params.obj) {
      loadObj();
    }
    
		return mesh;
  }

	/*************************
	*
	*	Animation & Control
	*
	**************************/
	
	/** 
	 * Create a rotation animation from the current rotation Y value
	 * @param angle (Float)
	 */
	rotateY(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: this.mesh.rotation.y + angle,
			speed: 0.05,
			onProgress: (advancement, value) =>{ this.mesh.rotation.y = value; },
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}


	/**
	 * Create a rotation animation to the angle specified
	 * @param angle (Float) [0..2*Pi]
	 */
	rotateYTo(angle) {
		var anim = new Animation({
			from: this.mesh.rotation.y,
			to: angle,
			onProgress: (advancement, value) => {
				this.mesh.rotation.y = value;
			},
			onFinish: (anim) => {
				var i = this.anims.indexOf(anim)
				this.anims.splice(i, 1);
			}
		})

		this.anims.push(anim);
	}

	/*************************
	*
	*		Attachement
	*
	**************************/

	/** 
	 * Minimum required to attach an element to the scene
	 */ 
	display(){
		if( this.fragment && this.fragment.book && this.fragment.book.scene ) {

      this.rotateMesh(this.mesh)
      if(this.clickable) {        
        this.createBBox(this.mesh)
      }
      
      this.positionMesh(this.mesh)
      this.scaleMesh(this.mesh)
      this.mesh.visible = this.visible
			this.fragment.book.scene.addElement(this); 
			return;
		}
		console.warn("Book not started. Cannot add elements to fragment");
  }
  
  positionMesh(mesh) {
    mesh.position.x = this.position.x
    mesh.position.y = this.position.y
    mesh.position.z = this.position.z
  }

  rotateMesh(mesh) {
    mesh.rotation.x = this.rotation.x
    mesh.rotation.y = this.rotation.y
    mesh.rotation.z = this.rotation.z
  }

  scaleMesh(mesh) {
    mesh.scale.x = this.scale
    mesh.scale.y = this.scale
    if(this.morphTargets) {
      mesh.scale.z = 1
    } else {
      mesh.scale.z = this.scale
    }
    
  }


  createBBox(mesh) {
    let box = new THREE.Box3().setFromObject(mesh)
    let boundingBuffer = [
      box.min.x*1, box.min.y*1, 1,
      box.max.x*1, box.min.y*1, 1,
      box.max.x*1, box.max.y*1, 1,

      box.min.x*1, box.min.y*1, 1,
      box.max.x*1, box.max.y*1, 1,
      box.min.x*1, box.max.y*1, 1,
    ]

    this.boundingGeo = new THREE.BufferGeometry()
    this.boundingGeo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(boundingBuffer),3))
     
    this.bbMesh = new THREE.Mesh(this.boundingGeo, new THREE.MeshBasicMaterial({color: 'red', transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSie}))
    this.bbMesh.name = "bb-"+this.name;
    this.bbMesh.position.z = -1
    if(this.isChar) {
      this.bbMesh.rotation.x = -this.rotation.x
      this.bbMesh.rotation.y = this.rotation.y
    }
   
    this.bbMesh.material.opacity = 0
    mesh.add(this.bbMesh)
  }

	/** 
	 * @TODO
	 * Minimum required to detach an element to the scene
	 */ 
	hide(){
		if( this.fragment && this.fragment.book && this.fragment.book.scene ){
			this.fragment.book.scene.removeElement(this); 
			return;
		}
		console.warn("Book not started. Cannot remove elements to fragment");
	}


	/*************************
	*
	*		Rendering
	*
	**************************/

	/**
	 * Render the list of all animations
	 */
	renderAnims(delta){
		var diff;
		var anims = [];
		var finished;
		for(var i=0; i<this.anims.length; i++){
			this.anims[i].render(delta);
		}
	}

	/** 
	 * Raf function. Can be override in all elements extending Mesh.
	 * @param clock (Clock) : The general clock of fragment   
	 */
	render(clock){
		this.renderAnims(17);
  }
  
  resize(width, height) {

  }
}

export default Mesh;
