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
    var rocketLaunch = this.soundManager.load("forest", "./examples/sounds/rocket-sound.wav");
    forest.on("load", () => {
      forest.start();
    })

    /**
     * ELEMENTS
     */
    // this.char = this.addElement(new Bard.CharacterElement({}))
    this.screenSize = this.book.scene.camera.right*2

    this.rocket = this.addElement( 
      Bard.MeshElement.fromObj({
        path:"./src/assets/obj/fusee-plate5.obj",
        mtl:'./src/assets/obj/fusee-plate2.mtl',
        config: {
          scale:3.,
          position: {
            x: (0.4*this.screenSize)+this.book.scene.camera.left,
            y: 0.03*this.screenSize,
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
          "C'est parti ! Nos héros partent à la découverte de la planète route !"
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );
    this.planes = []

    this.plane2 = this.addElement(new Bard.PlaneElement({imgUrls : ['./examples/images/plans/scene1-plan3.png'], alpha: true, z:-20}));
    this.planes.push(this.plane2)
    this.plane3 = this.addElement(new Bard.PlaneElement({imgUrls : ['./examples/images/plans/scene1-plan2.png'], alpha: true, z:-5}));
    this.planes.push(this.plane3)
    this.plane = this.addElement(new Bard.PlaneElement({imgUrls : ['./examples/images/plans/scene1-plan1.png'], alpha: true, z:0}));
    this.planes.push(this.plane)

    this.clouds = []

    for (let i = 1; i < 5; i++) {
      let cloud = this.addElement(new Bard.PlaneElement({imgUrls : ['./examples/images/clouds/nuage'+i+'.png'], alpha: true, z: -6*(i)}));
      cloud.x = (Math.random()*60 ) -30
      this.clouds.push(cloud)
      this.planes.push(cloud)
    }

    /**
     * ACTIONS
     */
    this.addAction("rocket-fly", (e) => {
      this.rocket.anims.push(new Bard.Animation({
        duration: 6000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInQeight(advancement)
          this.rocket.mesh.position.x = (Math.sin(easeTime) * 30.) + this.rocket.position.x
          this.rocket.mesh.position.y = easeTime * 200. + this.rocket.position.y
          this.rocket.mesh.rotation.z = -(Math.sin(easeTime))
          
          this.book.scene.camera.rotation.x = Math.cos(time*(Math.PI*100))/100
          // this.book.scene.camera.rotation.y = Math.cos(time*(Math.PI*100))/200
        },
        onFinish: () => {
          this.fragmentTransitionOut()
        }
      }))
      rocketLaunch.start()
    }, {
      once: true
    })

    this.addAction("transitionOut", (e) => {
     for (let i = 0; i < this.planes.length; i++) {
     
      this.planes[i].anims.push(new Bard.Animation({
        duration: 2000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInQeight(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
          this.planes[i].mesh.scale.x = ((easeTime*(i+1))*(100+(20*i)))+this.planes[i].width
          this.planes[i].mesh.scale.y = ((easeTime*(i+1))*(100+(20*i)))+this.planes[i].height

          if(advancement > 0.5) {
            this.planes[i].mesh.material.uniforms.opacity.value = 1-((advancement-0.5)*2.)
          }
        },
        onFinish:() => {
          this.fragmentTransitionIn()
          text.next()
        }
      }))
      }
    })

    this.planets = []


    for (let i = 1; i < 25; i++) {
      let planet = this.addElement(new Bard.PlaneElement({imgUrls : ['./examples/images/planets/planete'+i+'.png'], alpha: true, z: -0.5*(i), opacity:"0."}));
      this.planets.push(planet)
      
    }

    this.addAction("transitionIn", (e) => {
      for (let i = 0; i < this.planets.length; i++) {
      
        setTimeout(()=> {
          this.planets[i].anims.push(new Bard.Animation({
            duration: 1000,
            onProgress: (advancement, time) => {
              var easeTime = Bard.Easing.easeOutQuint(advancement)

              this.planets[i].mesh.scale.set(this.planets[i].width+(50-(50*easeTime)),this.planets[i].height+(50-(50*easeTime)),1 )
                this.planets[i].mesh.material.uniforms.opacity.value = ((advancement))
             
            },
            onFinish:() => {
            }
          }))
        }, i*20)
       
       }
     })
 
    

    this.addAction("next",  e => text.next())

    for(var i=0; i<this.elements.length; i++)
      this.elements[i].display();

    this.initListeners()
    
    this.afterStart();  
  },

  fragmentTransitionOut: function() {
    if(!this.fragmentEnd) {
      this.fragmentEnd = true
      
      this.executeAction('transitionOut')

    }
  },

  fragmentTransitionIn: function() {
    if(!this.fragmentNew) {
      this.fragmentNew = true

      this.executeAction('transitionIn')
    }
  },

  render: function() {
    this.beforeRender();
    
    for(var i=0; i<this.elements.length; i++){
      if(this.elements[i].type == "Mesh"){
        this.elements[i].render(this.clock);
      }
    }

    if(this.clouds.length ) {
      for (let i = 0; i < this.clouds.length; i++) {
        if(this.clouds[i].mesh) {
          this.clouds[i].mesh.position.x = (Math.sin(this.clock.elapsed/(2000.*((i*0.5)+1)))*40)+this.clouds[i].x
        }
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

