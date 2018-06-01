import * as Bard from "./../src/bard.js"

export default class Fragment1 extends Bard.Fragment {

  constructor() {
    super()
  }

  init() {

    this.addSpeechRecognition();
    this.addSoundManager();
    this.winWidth = window.innerWidth
    this.winHeight = window.innerHeight

    /**
     * SOUNDS
     */
    var forest = this.soundManager.load("forest", "./examples/sounds/forest_ambiance.mp3", {
      loop: true,
      volume: 0
    });
    var rocketLaunch = this.soundManager.load("rocket", "./examples/sounds/rocket_launch.mp3");

    var recorder = new Bard.Recorder(this.soundManager);
    recorder.init();
    recorder.on("record:stop", (event) => {
      this.soundManager.load("record", event.buffer, { loop: true, effect: "distortionCurve", effectIntensity: 0 }); 
      this.soundManager.sounds.record.start();
    })
    window.recorder = recorder;
    /**
     * ELEMENTS
     */

    // this.char = this.addElement(new Bard.CharacterElement({}))
    this.screenSize = this.book.scene.camera.right*2

    var text = this.addElement(
      new Bard.TextElement({
        nodes: [
          "Un soir, alors qu’il observe le ciel étoilé d’une belle nuit d’été… Une étrange comète traverse l’atmosphère, pour disparaître dans un bois <span data-speech='next'>non loin de</span> là.",
          " Il faut que j’aille voir cela de plus près ! “ s’exclame notre héros. Mais pour s’aventurer dehors, il doit être <span data-speech='scene-2'>bien équipé</span>.",
          "Le voilà fin prêts ! *Nom du héro* guidé par la lumière de la comète qui s’est écrasée, s’enfonce dans la forêt… Soudain, à l’orée d’une clairière, des voix lui parviennent. Qui peut bien se cacher <span data-speech='next'>parmi les feuillages</span> ?",
          "Touche ton héros pour qu’il/elle fasse peur aux créatures et qu’elles sortent de leur cachette !",
          "Bien joué, deux créatures viennent d’apparaître dans les feuillages, Trouve-les et Touche-les pour les faire parler. ",
          "Dans un langage codé, l’une des créatures prend la parole. <br> Hélas son message est incompréhensible… La pierre de traduction s’est égarés dans la forêt. Retrouve la pour l’aider à se faire comprendre",
          "Bien joué ! Tu as débloqué la pierre de traduction, voici les <span data-speech='next'>paroles de la créature</span>.",
          "Nous sommes les frères Ocelot et Caracal de la lointaine planète Mars. Là-bas, un cataclysme menace nos jours. Par pitié, aidez-nous !”          Bravo ! Tu as décodé son message : les frères Ocelot et Caracal ont besoin d’aide, un terrible monstre sème la terreur sur leur planète. Ceux-ci, ayant entendu parler des derniers exploits de *Nom du héro*, ont décidé de traverser l’univers pour lui proposer une nouvelle aventure."
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );
   

    this.getElement("mainText").on("word:click", function(e){
      console.log(e);
    })

    this.planes = [];
    this.clouds = [];

    this.stars = this.addElement(new Bard.StarsElement({map: '/examples/img/etoile-128.png', count: 20, group: "background"}))
   
    this.planes.push(this.addElement(new Bard.PlaneElement({
      name: "plan3",
      group: "background",
      map: '/examples/scene-1/scene-1-bg.png', 
      transparent: true, 
      depth: -200}
    )))

    this.planes.push(this.addElement(new Bard.PlaneElement({
      name: "plan5", 
      group: "background",
      map: '/examples/scene-1/scene-1-plan5.png', 
      transparent: true, 
      depth: -160
    })))
    this.animatedPlanes = []

    this.animatedPlanes.push(this.addElement(new Bard.PlaneElement({
      name: "plan4",
      group: "background",
      map: '/examples/scene-1/scenes-123-parallaxe-plan4.png', 
      transparent: true, 
      depth: -120}
    )))
    
    

    this.animatedPlanes.push(this.addElement(new Bard.PlaneElement({
      name: "plan3",
      group: "background",
      map: '/examples/scene-1/scenes-123-parallaxe-plan3.png', 
      transparent: true, 
      depth: -80}
    )))

    this.animatedPlanes.push(this.addElement(new Bard.PlaneElement({
      name: "plan2",
      group: "background",
      map: '/examples/scene-1/scenes-123-parallaxe-plan2.png', 
      transparent: true, 
      depth: -40}
    )))

    this.animatedPlanes.push(this.addElement(new Bard.PlaneElement({
      name: "plan1",
      group: "foreground",
      map: '/examples/scene-1/scenes-123-parallaxe-plan1.png', 
      transparent: true, 
      depth: 0}
    )))

    this.planes.push(this.addElement(new Bard.PlaneElement({
      name: "degradeSol",
      group: "background",
      map: '/examples/scene-1/scene-1-degrade-sol.png', 
      transparent: true, 
      depth: 2,    
      displacement: 1.}
    )))
    this.planes.push(this.addElement(new Bard.PlaneElement({
      name: "degradeCiel",
      group: "background",
      map: '/examples/scene-1/scene-1-degrade-ciel.png', 
      transparent: true, 
      depth: 3,
    }
    )))

    for (let i = 1; i < 5; i++) {
      let cloud = this.addElement(new Bard.PlaneElement({
        name: "nuage"+i, 
        group: "background",
        map: '/examples/img/clouds/nuage'+i+'.png', 
        transparent: true, 
        depth: 3+i*1
      }));
      cloud.x = (Math.random()*60 ) - 30
      this.clouds.push(cloud);
      // this.planes.push(cloud);
    }

    // this.rocket = this.addElement(
    //   Bard.MeshElement.fromObj({
    //     obj:"/examples/obj/fusee-plate5.obj",
    //     mtl:'/examples/obj/fusee-plate2.mtl',
    //     name: "rocket",
    //     clickable: true,
    //     config: {
    //       scale:3.,
    //       position: {
    //         x: (0.4*this.screenSize)+this.book.scene.camera.left,
    //         y: 0.03*this.screenSize,
    //         z: 0
    //       }
    //     }
    //   })
    // );

    this.ocelotFound = false
    this.caracalFound = false
    this.parcheminFound = false

    this.roar = false
    this.char = this.addElement(new Bard.MeshElement({
      clickable: true,
      name: "char",
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry( 100, 100, 1 ), 
        new THREE.MeshBasicMaterial({color: 0xFFF000, transparent: true, depthTest: false, depthWrite: false }))
    }))

    this.char.mesh.position.y = this.winHeight*0.25
    this.char.mesh.position.x = this.winWidth*0.35
    this.char.mesh.position.z = -30

    this.char.position.y = this.winHeight*0.25
    this.char.position.x = this.winWidth*0.35
    this.char.position.z = -30
    console.log(this.char)

    this.ocelot = this.addElement(new Bard.MeshElement({
      clickable: true,
      name: "ocelot",
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry( 100, 100, 1 ), 
        new THREE.MeshBasicMaterial({color: 0xF26000, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }))
    }))
    this.ocelot.mesh.position.y = this.winHeight*0.6
    this.ocelot.mesh.position.x = this.winWidth*0.2

    this.caracal = this.addElement(new Bard.MeshElement({
      clickable: true,
      name: "caracal",
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry( 100, 100, 1 ), 
        new THREE.MeshBasicMaterial({color: 0xF26000, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }))
    }))
    this.caracal.mesh.position.y = this.winHeight*0.7
    this.caracal.mesh.position.x = this.winWidth*0.3
    
    this.pierre = this.addElement(new Bard.MeshElement({
      clickable: true,
      name: "pierre",
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry( 50, 50, 1 ), 
        new THREE.MeshBasicMaterial({color: 0xF26000, transparent: true, depthTest: false, depthWrite: false, opacity: 0.5 }))
    }))

    this.pierre.mesh.position.y = this.winHeight*0.5
    this.pierre.mesh.position.x = this.winWidth*0.75

   

    this.char.on("click", ()=>{
      if(!this.roar) {
        rocketLaunch.start()
        this.roar = true
        this.executeAction('next')
        this.executeAction('displayCatHolo')
      }
    })

    this.ocelot.on("click",()=>{

      this.ocelotFound = true
      this.executeAction('fallOcelot')
      if(this.characalFound ) {
        this.executeAction('next')
      }
      
    })

    this.caracal.on("click",()=>{

      this.caracalFound = true
      this.executeAction('fallCaracal')
      if(this.ocelotFound) {
        this.executeAction('next')
      }
      
    })

    this.pierre.on("click",()=>{
      if(this.caracalFound && this.ocelotFound) {
        this.parcheminFound = true
        this.executeAction('next')
      }
    })

    /**
     * ACTIONS
     */

    // this.addAction("rocket-fly", (e) => {
    //   this.rocket.anims.push(new Bard.Animation({
    //     duration: 6000,
    //     onProgress: (advancement, time) => {
    //       var easeTime = Bard.Easing.easeInQeight(advancement)
    //       this.rocket.mesh.position.x = (Math.sin(easeTime) * 30.) + this.rocket.position.x
    //       this.rocket.mesh.position.y = easeTime * 200. + this.rocket.position.y
    //       this.rocket.mesh.rotation.z = -(Math.sin(easeTime))
          
    //       this.book.scene.camera.rotation.x = Math.cos(time*(Math.PI*100))/100
    //     },
    //     onFinish: () => {
    //       this.executeAction('transitionOut');
    //     }
    //   }))
    //   rocketLaunch.start()
    // }, {
    //   once: true
    // })

    this.addAction('displayCatHolo', (e)=> {
      this.ocelot.anims.push(new Bard.Animation({
        duration: 1000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
         
          this.ocelot.mesh.material.opacity = easeTime
          
      }}))
      this.caracal.anims.push(new Bard.Animation({
        duration: 1000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
       
          this.caracal.mesh.material.opacity = easeTime
          
      }}))
    })

    this.addAction('fallOcelot', (e)=> {
      this.ocelot.anims.push(new Bard.Animation({
        duration: 500,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
          this.ocelot.mesh.position.y =this.winHeight*0.6-(this.winHeight*0.3*easeTime)
        },
      })) 
    })

    this.addAction('fallCaracal', (e)=> {
      this.ocelot.anims.push(new Bard.Animation({
        duration: 500,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
          this.caracal.mesh.position.y =this.winHeight*0.7-(this.winHeight*0.4*easeTime)
        },
      })) 
    })

    this.addAction('charWalk', (e)=> {
      this.char.anims.push(new Bard.Animation({
        duration: 6000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeOutQuad(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
          let offset = ((this.book.scene.camera.right))+(((this.book.scene.camera.right)/15))
          this.char.mesh.position.x =this.winWidth*0.40*(easeTime)
        },
      })) 
    })

    this.addAction("scene-2", (e)=>{
      this.char.anims.push(new Bard.Animation({
        duration: 3500,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
          let offset = ((this.book.scene.camera.right))+(((this.book.scene.camera.right)/15))
          this.char.mesh.position.x =this.winWidth*0.35-(offset*easeTime)
        },
        onFinish: () => {
          this.executeAction('charWalk', 'hello')
          this.executeAction('next')
        }
      })) 
      for (let i = 0; i < this.animatedPlanes.length; i++) {
     
        this.animatedPlanes[i].anims.push(new Bard.Animation({
          duration: 3500,
          onProgress: (advancement, time) => {
            var easeTime = Bard.Easing.easeInOutQuint(advancement)
            // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
        
            let offset = ((this.book.scene.camera.right))+(((this.book.scene.camera.right)/15)*i)
           this.animatedPlanes[i].mesh.position.x = this.animatedPlanes[i].position.x - (offset*easeTime)
          },
          onFinish:() => {
            
          }
        }))
       }

       for (let i = 0; i < this.planes.length; i++) {
     
        this.planes[i].anims.push(new Bard.Animation({
          duration: 3500,
          onProgress: (advancement, time) => {
            var easeTime = Bard.Easing.easeInOutQuint(advancement)
            // this.planes[i].mesh.position.x = ((advancement*(i+1))*80)+(this.book.scene.camera.top/2.)
            
            let offset = ((this.book.scene.camera.right))+((this.book.scene.camera.right)/15)
           this.planes[i].mesh.position.x = this.planes[i].position.x - (offset*easeTime)
            
          },
          onFinish:() => {
         
          }
        }))
       }
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
          this.runChild(0);
        }
      }))
      }
    })

    this.addAction("next",  e => text.next())

    this.on("start", ()=>{
      for(var i=0; i<this.elements.length; i++){
        this.elements[i].display();
      }
      forest.on("load", ()=>{forest.start()})
      this.initListeners();

      this.waitAndAlert("chrome_exception", "next")
      this.book.on("alert", (e)=>{
        console.log(e);
      })
    })
  }

  render() {
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
  }

  initListeners() {

  }
};
