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
    this.rocket = this.addElement( 
      Bard.MeshElement.fromObj({path:"./src/assets/obj/rocket.obj"})
    );
    
    var text = this.addElement(
      new Bard.TextElement({
        nodes: [
          "Tout le monde a mis sa <span>ceinture de sécurité</span> et est bien installé <span data-speech='next'>dans le cockpit</span>",
          "Il ne reste plus qu’à <span>démarrer la fusée</span>. <span data-speech='rocket-fly'>vers l'infini et l'au-delà</span>.",
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText"
      })
    );

    for (let i = 0; i < 5; i++) {
      this.addElement(
        Bard.MeshElement.fromObj({ 
          path: "./src/assets/obj/tree.obj", 
          scale: 0.04, 
          position: { 
            x: Math.random() * 10 + (i * 20) - 40, 
            y: 0, 
            z: Math.random() * -30 - 3 } 
        })
      );
    }
    
    this.floor = this.addElement(new Bard.FloorElement({}))
    this.stars = this.addElement(new Bard.StarsElement({}));
    
    /**
     * ACTIONS
     */
    this.addAction("rocket-fly", (e) => {
      this.rocket.anims.push(new Bard.Animation({
        duration: 9000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInQeight(advancement)
          this.rocket.mesh.position.x = Math.sin(easeTime) * 100.
          this.rocket.mesh.position.y = easeTime * 200
          this.rocket.mesh.rotation.x = Math.cos(time*200)/2
          
          this.rocket.mesh.scale.x = 1 - easeTime
          this.rocket.mesh.scale.y = 1 - easeTime
          this.rocket.mesh.scale.z = 1 - easeTime
          this.book.scene.camera.lookAt(this.rocket.mesh.position)
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

  var book = new Bard.Book();
	
	
	book.addFragment(fragment);
  book.start();
})

