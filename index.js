import * as THREE from "three"; 
import * as Bard from "./src/bard.js"


// Custom Fragment

var fragment = Bard.Fragment.build("StartFragment", {
  
  start: function() {

    this.addSpeechRecognition();
    this.addSoundManager();
    
    /**
     * SOUNDS
     */
    var forest = this.soundManager.load("forest", "./examples/sounds/forest_ambiance.mp3");
    var rocketLaunch = this.soundManager.load("forest", "./examples/sounds/rocket_launch_start.mp3");
    forest.on("load", () => {
      console.log("Load"),
      forest.start();
    })

    /**
     * ELEMENTS
     */
    // this.char = this.addElement(new Bard.CharacterElement({}))
    
    this.rocket = this.addElement( 
      Bard.MeshElement.fromObj({
        path:"./src/assets/obj/fusee-plate5.obj",
        mtl:'./src/assets/obj/fusee-plate2.mtl',
        config: {
          scale:3.,
          position: {
            x: 0.4,
            y: 0.03,
            z: -3
          }
        }
      })
    );

    
    var text = this.addElement(
      new Bard.TextElement({
        nodes: [
          "Tout le monde a mis sa <span>ceinture de sécurité</span> et est bien installé <span data-speech='next'>dans le cockpit</span>",
          "Il ne reste plus qu’à <span>démarrer la fusée</span>. <span data-speech='rocket-fly'>vers l'infini et l'au-delà</span>.",
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );

    this.plane2 = this.addElement(new Bard.PlaneElement({imgUrls : ['./src/assets/scene1-plan3.png'], alpha: true, z:-20}));
    this.plane3 = this.addElement(new Bard.PlaneElement({imgUrls : ['./src/assets/scene1-plan2.png'], alpha: true, z:-5}));
    this.plane = this.addElement(new Bard.PlaneElement({imgUrls : ['./src/assets/scene1-plan1.png'], alpha: true, z:0}));

    /**
     * ACTIONS
     */
    this.addAction("rocket-fly", (e) => {
      this.rocket.anims.push(new Bard.Animation({
        duration: 6000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInQeight(advancement)
          this.rocket.mesh.position.x = (Math.sin(easeTime) * 30.)
          this.rocket.mesh.position.y = easeTime * 200.
 
          this.book.scene.camera.rotation.x = Math.cos(time*(Math.PI*100))/100
          this.book.scene.camera.rotation.y = Math.cos(time*(Math.PI*100))/200
        }
      }))
      rocketLaunch.start();
    })

    this.addAction("next",  e => text.next())

    for(var i=0; i<this.elements.length; i++)
      this.elements[i].display();

    this.initListeners()
    
    this.afterStart();  
  },

  render: function() {
    this.beforeRender();
    
    for(var i=0; i<this.elements.length; i++){
      if(this.elements[i].type == "Mesh"){
        this.elements[i].render(this.clock);
      }
    }

    this.afterRender();
  },

  initListeners: function() {

  }
})


window.addEventListener("load", function(){

  var book = new Bard.Book({
    debug: true
  });
	
	
	book.addFragment(fragment);
  book.start();
})

