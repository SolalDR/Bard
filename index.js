import * as THREE from "three"; 
import * as Bard from "./src/bard.js"


// Custom Fragment

class StartFragment extends Bard.Fragment {

	constructor(){ super(); }

	start(){
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		this.cube = new THREE.Mesh( geometry, material );

		let floorGeo = new THREE.PlaneGeometry(100,100,2,2)
		let floorMat = new THREE.MeshBasicMaterial({color:0xefefef})
		this.floor = new THREE.Mesh(floorGeo, floorMat)
		this.floor.rotation.set(-Math.PI/2,0,0)
		
		this.addSpeechRecognition();
		


		this.rocket = this.addElement( Bard.MeshElement.fromObj({path:"./src/assets/obj/rocket.obj"}));
		
		this.addAction("rocket-fly", (e) => {
			this.rocket.anims.push(new Bard.Animation({
				duration: 9000,
				onProgress: (advancement, time) => {
					var easeTime = Bard.Easing.easeInQeight(advancement)
					console.log(easeTime)
					this.rocket.mesh.position.x = Math.sin(easeTime)*100.
					this.rocket.mesh.position.y = advancement*200
					this.rocket.mesh.scale.x = 1 - advancement
					this.rocket.mesh.scale.y = 1 - advancement
					this.rocket.mesh.scale.z = 1 - advancement

					this.book.scene.camera.lookAt(this.rocket.mesh.position)
				}
			}))
		})
	

		for(let i = 0; i < 5; i++) {
			this.addElement( Bard.MeshElement.fromObj({path:"./src/assets/obj/tree.obj", scale: 0.04, position:{x:Math.random()*10+(i*20)-40,y:0,z:Math.random()*-30-3}}));
		}
		
		let starGeo = new THREE.SphereGeometry(8,8,1)
		let starMat = new THREE.MeshBasicMaterial({color: 0xffffff})

		for(let i = 0; i < 100; i++) {
			let star = new THREE.Mesh(starGeo, starMat)
			star.position.x = Math.random()*500-250
			star.position.y = Math.random()*100+100
			star.position.z = Math.random()*500-250

			star.scale.x = 0.3
			star.scale.y = 0.3
			star.scale.z = 0.3

			this.addElement(new Bard.MeshElement({mesh:star}));
		}

		this.addElement(new Bard.MeshElement({mesh:this.floor}))

		//this.addElement( new Bard.CharacterElement( {group: "scene", name: "guy"} ) );
		
		var text = this.addElement( new Bard.TextElement({ 
			nodes: [
				"Un soir alors qu'ils <span data-speech='test_recognition'>observent le ciel étoilé</span> d'une <span data-speech='next'>belle nuit d'été</span>", 
				"<span data-speech='test_recognition'>une étrange comète traverse l'atmosphère</span> ... pour disparaître <span data-speech='next'>non loin de là</span>.", 
				"\"Allons voir cela de plus prêt !\" s'exclament en coeur <span data-speech='next'>nos deux héros</span>...", 
				"<span data-speech='noises_forest'>Soundain <span data-speech='next'>des bruits étranges parviennent de la forêt</span>."
			],
			align: "bottom-left",
			position: {x: "40px", y:"-20px"},
			name: "mainText"
		}));

		this.addAction("next",  e => text.next())

		for(var i=0; i<this.elements.length; i++)
			this.elements[i].display();

		this.initListeners()
		super.start();	
	}

	initListeners() {			
		document.getElementById("canvas").addEventListener("click", () => {
			this.executeAction("rocket-fly")
		})
	}

	render(){
		super.render();
		
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].type == "Mesh"){
				this.elements[i].render(this.clock);
			}
		}

		super.postRender();
	}
	
}


class TestFragment extends Bard.Fragment {
	constructor() {
		super();	
	}

	start() {
	
		for(var i=0; i<this.elements.length; i++){
			
			this.elements[i].display();
		}

		super.start()
	}
	
	render() {
		super.render()

		super.postRender()
	}
}

window.addEventListener("load", function(){

    var book = new Bard.Book();
    var frag = new StartFragment();
	var testFrag = new TestFragment()
	
	
	book.addFragment(frag);
	book.addFragment(testFrag);
    book.start();
})

