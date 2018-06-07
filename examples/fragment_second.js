import * as Bard from "./../src/bard.js"

export default class Fragment2 extends Bard.Fragment {
  
  constructor(){
    super();
    this.name = "Second fragment"
  }

  init() {    
    var self = this;

    this.addSpeechRecognition();
    this.addSoundManager();
    this.aspect = window.innerWidth/window.innerHeight
    this.winWidth = window.innerWidth
    this.fondPerdu = this.winWidth*0.5/this.aspect
    /**
     * SOUNDS
     */
    var rocketLaunch = this.soundManager.load("forest", "/examples/sounds/rocket_launch.mp3");

    /**
     * ELEMENTS
     */
    // this.char = this.addElement(new Bard.CharacterElement({}))
  

    var text = this.addElement(
      new Bard.TextElement({
        nodes: [
          " Enfin arrivés ! La fusée à peine posée, les habitants de mars affluent des alentours pour t'acclamer et t’encourager :”Libère-nous ! Tu es notre <span data-speech='next'>seul espoir</span> !”",
          "Tout à coup, un <span data-speech='terryfying-roar'>bruit terrifiant</span> retentit dans les environs. Pris de panique les martiens courent se mettre à l’abri ! Le monstre est <span data-speech='unlock-sword'>tout proche</span> !" ,
        
          "Notre héros brandit son arme, prêt à combattre. Tout à coup, la créature s’élance d’<span data-speech='dragon-appear'>une falaise</span> et atterrit devant eux.",
           "“Graougrrrr !! je vais vous manger tout crus !!” dit-elle en <span data-speech='next'>grognant</span>.",
           "Avant même que *Nom du héro* ait eu le temps d’esquisser un geste, elle lui fonce dessus et le projette sur le sol, son arme se brisant avec la <span data-speech='break-sword'>force du choc</span>.<br> “Hahahaha, trop facile !”",
           "Ton héros est désarmé ! Vite, nous <span data-speech='run'>devons fuir</span> !",
           "*Nom du héro* et ses compagnons déguerpissent sans attendre. Le monstre les prend en chasse! Ils sont rapides, mais le monstre <span data-speech='next'>plus encore</span>…  ",
           "Il gagne de la distance sur eux ! <span data-speech='ocelot-talk'>Tout</span> à coup, Ocelot s’écrie : “Nous voilà bloqués !” Un grand rocher se cachait au détour d’un virage : pas moyen de <span data-speech='next'>continuer à fuir</span> !",
           "<span data-speech='dragon-ready'>En appui</span> sur ses pattes arrière, le monstre s’apprête à bondir. “Quelle pitoyable tentative ! lance le monstre. Vous ne pourrez pas m’empêcher de terroriser la planète mars ! Et je vais vous faire si peur que <span data-speech='ocelot-respond'>vous en</span> mourrez !”",
           "Moi je n’ai pas peur, lui répond Ocelot, et je connais même quelqu’un que tu ne pourras jamais effrayer, il est d’ailleurs <span data-speech='enableClick-robot'>avec nous</span> !",
           "Impossible ! Répond le monstre. Dis-moi qui est cette personne, que je te montre que tu as tort” Touche ton compagnon qui ne pourra jamais être effrayé pour vaincre le monstre ",
           "“Le robot Tanique ne te craint pas !” dit *Nom du héro* À ces mots, le monstre se met à <span data-speech='dragon-wigle'>trembler</span> et à enfler de colère, prêt à faire le cri le plus terrorisant de tous <span data-speech='dragon-roar'>les temps</span> : “Braougraaaaaagggggaaaaaar !!!!",
           "Voyant qu’il a échoué à effrayer le robot, le monstre pâlit et un grondement sourd sort de sa gueule. Le <span data-speech='dragon-vainquished'>voilà vaincu</span>! Il s’écroule tout à coup et son corps s’évanouit pour ne laisser qu’une petite forme <span data-speech='dragon-fade'>sur le sol</span>."
          
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );

    var planets = []
    this.planes = []
    
    this.planesLength = 6

    this.addElement(new Bard.PlaneElement({
      name: 'bg',
      group: 'foreground',
      depth: 31,
      transparent: true,
      inverse: true,
      map: '/examples/scene-mars/bg.png'
    }))

    for (let i = 0; i < 6; i++) {
      let group = "background"
      let id = this.planesLength - i
      if (id==1) {
        group= "foreground"
      }
      this.planes.push(
        this.addElement(new Bard.PlaneElement({
            name: 'plan'+(id),
            group: group,
            depth: -30*id+(60),
            inverse: true,
            transparent: true,
            map: '/examples/scene-mars/scenes-mars-plan'+id+'.png'
          })
        )
      )
      
    }

    this.liane = this.addElement(
      new Bard.CharacterElement({
        name: "liane1",
        clickable: true,
        morphTargets: true,
        visible: true,
        position: {
          x:(this.winWidth*0.7/this.aspect),
          y: this.winWidth*0.2/this.aspect,
          z: -29
        },
        rotation: {
          x:0,
          y:Math.PI,
          z:0,
        },
        scale: 160,
        opacity: 0.5,
        model: 'examples/obj/liane2/liane2.gltf'
      })
    )

    this.liane2 = this.addElement(
      new Bard.CharacterElement({
        name: "liane2",
        clickable: true,
        morphTargets: true,
        visible: true,
        position: {
          x:(this.winWidth*0.4/this.aspect),
          y: this.winWidth*0.2/this.aspect,
          z: -29
        },
        rotation: {
          x:0,
          y:Math.PI,
          z:0,
        },
        scale: 160,
        opacity: 0.5,
        model: 'examples/obj/liane3/liane3.gltf'
      })
    )

    this.liane3 = this.addElement(
      new Bard.CharacterElement({
        name: "liane3",
        clickable: true,
        morphTargets: true,
        visible: true,
        position: {
          x:(-this.winWidth*0.05/this.aspect),
          y: this.winWidth*0.25/this.aspect,
          z: -29
        },
        rotation: {
          x:0,
          y:Math.PI,
          z:0,
        },
        scale: 160,
        opacity: 0.5,
        model: 'examples/obj/liane4/liane4.gltf'
      })
    )


    this.liane.on('load', ()=>{
      this.liane.actions[1].play()
    })

    this.liane2.on('load', ()=>{
      this.liane2.actions[1].setDuration(2)
      this.liane2.actions[1].play()
    })

    this.liane3.on('load', ()=>{
      this.liane3.actions[1].setDuration(3)
      this.liane3.actions[1].play()
    })


    this.rocket = this.addElement(
      new Bard.CharacterElement({
        name: "rocket",
        clickable: true,
        morphTargets: true,
        visible: true,
        position: {
          x:(this.winWidth*0.7/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:0,
          y:Math.PI,
          z:0,
        },
        scale: 300,
        model: 'examples/obj/fusee/fusee.gltf'
      })
    )

    this.char = this.addElement(
      new Bard.CharacterElement({
        name: "mainChar",
        clickable: true,
        morphTargets: false,
        visible: true,
        mainChar: true,
        position: {
          x:(this.winWidth*0.50/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:Math.PI/2,
          y:0,
          z:0,
        },
        scale: 0.6,
        hide:true,
        originCenter: true,
        model: 'examples/obj/rig-heros.glb'
      })
    )

    this.robot = this.addElement(
      new Bard.CharacterElement({
        name: "robot-tanique",
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(this.winWidth*0.32/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:Math.PI/2,
          y:0,
          z:0,
        },
        scale: 0.8,
        hide:true,
        originCenter: true,
        model: 'examples/obj/rig-robot-tanique.glb'
      })
    )

    this.caracal = this.addElement(
      new Bard.CharacterElement({
        name: "caracal",
        hide:true,
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(this.winWidth*0.40/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:Math.PI/2,
          y:0,
          z:0,
        },
        scale: 0.5,
        originCenter: true,
        model: 'examples/obj/rig-chats2.glb'
      })
    )

    this.ocelot = this.addElement(
      new Bard.CharacterElement({
        name: "ocelot",
        hide:true,
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(this.winWidth*0.22/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:Math.PI/2,
          y:0,
          z:0,
        },
        scale: 0.4,
        originCenter : true,
        model: 'examples/obj/rig-chats2.glb'
      })
    )


    this.serval = this.addElement(
      new Bard.CharacterElement({
        name: "serval",
        hide:true,
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(this.winWidth*0.7/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:Math.PI/2,
          y:0,
          z:0,
        },
        scale: 0.35,
        originCenter : true,
        model: 'examples/obj/rig-chats2.glb'
      })
    )


    this.dragon = this.addElement(
      new Bard.CharacterElement({
        name: "dragon",
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(this.winWidth*1.5/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:-Math.PI/2,
          y:Math.PI,
          z:0,
        },
        scale: 2.,
        model: 'examples/obj/rig-boss.glb'
      })
    )

    this.king = this.addElement(
      new Bard.CharacterElement({
        name: "king",
        clickable: true,
        morphTargets: false,
        visible: true,
        position: {
          x:(-this.winWidth*0.68/this.aspect),
          y: this.winWidth*0.27/this.aspect,
          z: -29
        },
        rotation: {
          x:-Math.PI/2,
          y:Math.PI,
          z:0,
        },
        scale: 1.,
        model: 'examples/obj/rig-roi-martien1.glb'
      })
    )

    this.addAction('move-element',(e)=>{
      
      e.args.element.anims.push(new Bard.Animation({
        from: e.args.element.mesh.position.x,
        to: e.args.to+e.args.element.mesh.position.x,
        duration: e.args.duration,
        onProgress:  (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          e.args.element.mesh.position.x = time
        },
        onFinish: ()=>{
          this.ocelot.actions[5].stop()
          this.dragon.actions[2].stop()
          this.caracal.actions[5].stop()
        }
      }))
    })

    this.addAction('terryfying-roar', (e)=>{
      this.ocelot.actions[9].setLoop(THREE.LoopOnce)
     
      // this.ocelot.actions[9].crossFadeFrom(this.ocelot.actions[0], 0.2)
      this.ocelot.actions[9].play()

      this.caracal.actions[9].setLoop(THREE.LoopOnce)
      // this.caracal.actions[9].crossFadeFrom(this.caracal.actions[0], 0.2)
      this.caracal.actions[9].play()

      this.robot.actions[2].setLoop(THREE.LoopOnce)
      // this.robot.actions[9].crossFadeFrom(this.robot.actions[0], 0.2)
      this.robot.actions[2].play()
    })

    this.addAction('unlock-sword', (e)=>{
      this.executeAction('next')
      this.ocelot.actions[5].play();
      this.caracal.actions[5].play();
      this.executeAction('move-element', {element: this.ocelot, to: -this.winWidth*0.15/this.aspect, duration: 2000})
      this.executeAction('move-element', {element: this.caracal, to: -this.winWidth*0.15/this.aspect, duration: 2000})
      this.executeAction('move-element', {element: this.robot, to: -this.winWidth*0.15/this.aspect, duration: 2000})

    })

    this.addAction('dragon-appear', (e)=>{
      this.executeAction('move-element', {element: this.dragon, to: -this.winWidth*0.75/this.aspect, duration: 2000})
      this.dragon.actions[2].play()
      this.dragon.actions[0].play()
      this.executeAction('next')
    })

    this.addAction('break-sword', (e)=>{
      this.executeAction('move-element', {element: this.char, to: -this.winWidth*0.15/this.aspect, duration: 1000})
      this.executeAction('next')
    })

    this.addAction('run', (e)=>{
      this.executeAction('next')
      this.executeAction('move-element', {element: this.ocelot, to: -this.winWidth*0.8, duration: 11000})
      this.executeAction('move-element', {element: this.caracal, to: -this.winWidth*0.8, duration: 11000})
      this.executeAction('move-element', {element: this.robot, to: -this.winWidth*0.8, duration: 11000})

      setTimeout(this.executeAction.bind(this, 'move-element', {element: this.dragon, to: -this.winWidth*0.87, duration: 8000}), 3000)

      this.ocelot.actions[3].play()
      this.caracal.actions[3].play()
      this.char.actions[4].play()
      this.caracal.actions[0].fadeOut(0.5)
      this.ocelot.actions[0].fadeOut(0.5)
      this.char.actions[8].fadeOut(0.5)
      setTimeout( ()=>{
        this.dragon.actions[1].fadeIn(0.5),
      this.dragon.actions[1].play(),
      this.dragon.actions[0].fadeOut(0.5)
      }
        ,3000)
        setTimeout( ()=>{
          this.dragon.actions[1].fadeOut(1)
          this.dragon.actions[0].enabled =true
          this.dragon.actions[0].fadeIn(0.5)
          this.dragon.actions[0].play()
        }
          ,10000)

      this.caracal.mesh.rotation.y = Math.PI
      this.char.mesh.rotation.y = Math.PI 
      this.ocelot.mesh.rotation.y = Math.PI

      this.caracal.mesh.rotation.x = -Math.PI/2
      this.char.mesh.rotation.x = -Math.PI /2
      this.ocelot.mesh.rotation.x =- Math.PI/2

      for (let i = 0; i < this.planes.length; i++) {
        this.executeAction('move-element', {element: this.planes[i], to: -(this.fondPerdu*(4-i)), duration: 11000})
        console.log((this.fondPerdu*(4-i)))
        console.log(this.planes[i])
      }

      this.char.anims.push(new Bard.Animation({
        from: this.char.mesh.position.x,
        to:-(this.winWidth*0.8)+this.char.mesh.position.x,
        duration: 11000,
        onProgress:  (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          this.char.mesh.position.x = time
          this.book.scene.camera.position.x = advancement*(-this.winWidth*0.9)
        },
        onFinish: ()=>{
          this.ocelot.actions[3].stop()
          // this.dragon.actions[2].stop()
          this.caracal.mesh.rotation.y = 0
          this.char.mesh.rotation.y =0 
          this.ocelot.mesh.rotation.y = 0

          this.caracal.actions[0].enabled =true
          this.caracal.actions[0].fadeIn(0.5)
          this.caracal.actions[0].play()
          this.ocelot.actions[0].enabled =true
          this.ocelot.actions[0].fadeIn(0.5)
          this.ocelot.actions[0].play()

          this.char.actions[8].enabled =true
          this.char.actions[8].fadeIn(0.5)
          this.char.actions[8].play()
          
          this.caracal.mesh.rotation.x = Math.PI/2
          this.char.mesh.rotation.x = Math.PI /2
          this.ocelot.mesh.rotation.x = Math.PI/2
          this.char.actions[4].stop()
          this.caracal.actions[3].stop()
        
        }
      }))
    })

    this.addAction('ocelot-talk', (e)=>{
      this.ocelot.actions[4].setLoop(THREE.LoopOnce)
      this.ocelot.actions[4].play()
    })
    
    this.addAction('ocelot-respond', (e)=>{
      // this.ocelot.actions
      this.executeAction('next')
    })

    
    this.addAction('enableClick-robot', (e)=>{
      this.robotClickable = true
      this.executeAction('next')
    })

    this.robot.on('click', ()=>{
      if(this.robotClickable) {
        this.robotClickable = false
        this.executeAction('next')
      }
    })

    this.addAction('dragon-wigle', (e)=>{
    
    })

    this.addAction('dragon-roar', (e)=>{
      this.king.mesh.position.x = this.dragon.mesh.position.x - (this.winWidth*0.4/this.aspect)
     
      this.ocelot.actions[9].setLoop(THREE.LoopOnce)
     
      // this.ocelot.actions[9].crossFadeFrom(this.ocelot.actions[0], 0.2)
      this.ocelot.actions[9].play()

      this.caracal.actions[9].setLoop(THREE.LoopOnce)
      // this.caracal.actions[9].crossFadeFrom(this.caracal.actions[0], 0.2)
      this.caracal.actions[9].play()

      this.char.actions[10].setLoop(THREE.LoopOnce)
      // this.char.actions[9].crossFadeFrom(this.char.actions[0], 0.2)
      this.char.actions[10].play()
      this.executeAction('next')
    })

    this.addAction('dragon-fade', (e)=>{
      this.serval.mesh.position.x = this.dragon.mesh.position.x
      this.serval.mesh.rotation.y = Math.PI

      this.serval.mesh.rotation.x = -Math.PI/2

      this.dragon.anims.push(new Bard.Animation({
        duration: 2000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          this.dragon.mesh.children[0].traverse((child)=> {
            if(child['material']) {
              child.material.opacity = Math.min(Math.max((1-easeTime)*child.material.realOpacity,0),1)
            }
          })
        }
      }))
      this.serval.anims.push(new Bard.Animation({
        duration: 2000,
        onProgress: (advancement, time) => {
          var easeTime = Bard.Easing.easeInOutQuint(advancement)
          this.serval.mesh.children[0].traverse((child)=> {
            if(child['material']) {
              child.material.opacity = Math.min(Math.max((easeTime)*child.material.realOpacity,0),1)*0.6
            }
          })
        }
      }))
    })
    /**
     * ACTIONS
     */
    this.addAction('transitionIn', (e)=>{

      this.rocket.actions[4].play()
      this.rocket.actions[4].fadeOut( 5)
      this.rocket.actions[2].play()
      this.rocket.actions[2].fadeIn(5)

      this.rocket.anims.push(new Bard.Animation({
        duration: 5000,
        from: this.winWidth*0.5/this.aspect,
        to: this.rocket.mesh.position.y,
        timingFunction:'easeOutQuad',
        onProgress:(advancement, time)=> {
          
          this.rocket.mesh.position.y = time
          
          // this.rocket.actions[4].play()

          // if(advancement > 0.85) {
          //   this.rocket.actions[1].setLoop(THREE.LoopOnce)
          //   this.rocket.actions[1].crossFadeFrom()
          //   // this.rocket.actions[1].setEffectiveWeight((advancement-0.85)*8.)
          //   // this.rocket.actions[2].play((advancement-0.85)*8.)
          // }
          
          
        },
        onFinish:()=> {
          // this.rocket.actions[0].play()
          this.ocelot.actions[0].play()
          this.ocelot.anims.push(new Bard.Animation({
            duration: 1000,
            onProgress: (advancement, time) => {
              var easeTime = Bard.Easing.easeInOutQuint(advancement)
              this.ocelot.mesh.children[0].traverse((child)=> {
                if(child['material']) {
                  child.material.opacity = easeTime*child.material.realOpacity
                }
              })
            }
          }))

          this.robot.actions[0].play()
          this.robot.anims.push(new Bard.Animation({
            duration: 1000,
            onProgress: (advancement, time) => {
              var easeTime = Bard.Easing.easeInOutQuint(advancement)
              this.robot.mesh.children[0].traverse((child)=> {
                if(child['material']) {
                  child.material.opacity = easeTime*child.material.realOpacity
                }
              })
            }
          }))

          this.caracal.actions[0].play()
          this.caracal.anims.push(new Bard.Animation({
            duration: 1000,
            onProgress: (advancement, time) => {
              var easeTime = Bard.Easing.easeInOutQuint(advancement)
              this.caracal.mesh.children[0].traverse((child)=> {
                if(child['material']) {
                  child.material.opacity = easeTime*child.material.realOpacity
                }
              })
            }
          }))

          this.char.actions[8].play()
          this.char.anims.push(new Bard.Animation({
            duration: 1000,
            onProgress: (advancement, time) => {
              var easeTime = Bard.Easing.easeInOutQuint(advancement)
              this.char.mesh.children[0].traverse((child)=> {
                if(child['material']) {
                  child.material.opacity = easeTime*child.material.realOpacity
                }
              })
            }
          }))
        }
      }))
    })

    this.addAction("next",  e => text.next())


    this.on("start", ()=>{
      
      for(var i=0; i<this.elements.length; i++)
        this.elements[i].display();

      // this.book.scene.camera.position.x = this.winWidth*2.75

      this.initListeners();
      this.executeAction("transitionIn");
      // this.soundManager.stop("forest");
      // this.soundManager.play("rocket");
    })
  }
  resize() {
    this.winWidth = window.innerWidth
    this.winHeight = window.innerHeight
    this.aspect = this.winWidth/this.winHeight
  
    this.fondPerdu = (this.winWidth*0.5)/this.aspect
    
  }

  render() {
    this.beforeRender();
    this.afterRender();
  }

  initListeners() {}
}
