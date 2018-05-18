import * as Bard from "./../src/bard.js"

export default class Fragment2 extends Bard.Fragment {
  
  constructor(){
    super();
  }

  init() {    
    var self = this;

    this.addSpeechRecognition();
    this.addSoundManager();
    
    /**
     * SOUNDS
     */
    var rocketLaunch = this.soundManager.load("forest", "/examples/sounds/rocket_launch.mp3");

    /**
     * ELEMENTS
     */
    // this.char = this.addElement(new Bard.CharacterElement({}))
    this.screenSize = this.book.scene.camera.right*2
    this.rocket = this.addElement( 
      Bard.MeshElement.fromObj({
        obj: "/examples/obj/fusee-plate5.obj",
        mtl: '/examples/obj/fusee-plate2.mtl',
        config: {
          scale:3.,
          position: {
            x: (0.4*this.screenSize)+this.book.scene.camera.left,
            y: -this.screenSize,
            z: -3
          }
        }
      })
    );

    var text = this.addElement(
      new Bard.TextElement({
        nodes: [
          "Dans l'espace, ils font vraiment du sale"
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );


    /**
     * ACTIONS
     */
    this.addAction("rocket-fly", (e) => {
      this.rocket.anims.push(new Bard.Animation({
        duration: 6000,
        onProgress: (advancement, time) => {
          this.rocket.mesh.position.x = (Math.sin(advancement) * 30.) + this.rocket.position.x
          this.rocket.mesh.position.y = advancement * 200. + this.rocket.position.y
          this.rocket.mesh.rotation.z = -(Math.sin(advancement))/2.
        },
        onFinish: function() {}
      }))
      rocketLaunch.start()
    }, {
      once: true
    })


    var planets = []
    for (let i = 23; i >= 0; i--) {
      planets.push(this.addElement(new Bard.PlaneElement({
        map : '/examples/img/planets/planete'+(i+1)+'.png', 
        transparent: true,
        depth: -0.5*(i), 
        opacity: 0.
      })));
    }


    this.addAction("planet-appear", (e) => {
      planets.forEach((planet, i) => {
        planet.anims.push(new Bard.Animation({
          onStart: () => {
            console.log("Planet appear launch anim")
          },
          onProgress: (advancement, value, anim) => {
            if( !planet.mesh ) return;
            var ease = Bard.Easing.easeOutQuint(advancement);
            if( i == 0) console.log(advancement, value, anim)
            planet.mesh.scale.x = planet.width+(50-(50*ease))
            planet.mesh.scale.y = planet.width+(50-(50*ease))
            planet.mesh.scale.z = 1
            planet.mesh.material.uniforms.opacity.value = advancement;
          },
          onFinish: this.executeAction.bind(this, "rocket-fly")
        }))
      })
    })

    this.cube = this.addElement(new Bard.MeshElement({
      clickable: true,
      name: "Hello",
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry( 1, 1, 1 ), 
        new THREE.MeshBasicMaterial({color: 0xFF0000}))
    }))

    this.cube.on("click", ()=>{
      console.log("Clicked in scene 2");
    })


    this.on("start", ()=>{
      
      for(var i=0; i<this.elements.length; i++)
        this.elements[i].display();

      this.initListeners();

      this.executeAction("planet-appear");
      // this.soundManager.stop("forest");
      // this.soundManager.play("rocket");
    })
  }


  render() {
    this.beforeRender();
    this.afterRender();
  }

  initListeners() {}
}
