import * as Bard from "./../src/bard.js"

export default class Fragment1 extends Bard.Fragment {

  constructor() {
    super()
  }

  init() {

    this.addSpeechRecognition();
    this.addSoundManager();
    
    /**
     * SOUNDS
     */
    var forest = this.soundManager.load("forest", "./examples/sounds/forest_ambiance.mp3");
    var rocketLaunch = this.soundManager.load("forest", "./examples/sounds/rocket-sound.wav");

    /**
     * ELEMENTS
     */

    // this.char = this.addElement(new Bard.CharacterElement({}))
    this.screenSize = this.book.scene.camera.right*2

    this.rocket = this.addElement(
      Bard.MeshElement.fromObj({
        obj:"./src/assets/obj/fusee-plate5.obj",
        mtl:'./src/assets/obj/fusee-plate2.mtl',
        name: "rocket",
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
          "Il ne reste plus qu’à <span>démarrer la fusée</span>. <span data-speech='rocket-fly'>vers l'infini et l'au-delà</span>."
        ],
        align: "bottom-left",
        position: { x: "40px", y: "-20px" },
        name: "mainText",
        color: '#ffffff'
      })
    );


    this.planes = [];
    this.clouds = [];
    this.planes.push(this.addElement(new Bard.PlaneElement({
      name: "plan3", 
      map: './examples/images/plans/scene1-plan3.png', 
      transparent: true, 
      depth:-20})))

    this.planes.push(this.addElement(new Bard.PlaneElement({name: "plan2",map: './examples/images/plans/scene1-plan2.png', transparent: true, depth:-5})))
    this.planes.push(this.addElement(new Bard.PlaneElement({name: "plan1",map: './examples/images/plans/scene1-plan1.png', transparent: true, depth:0})))

    for (let i = 1; i < 5; i++) {
      let cloud = this.addElement(new Bard.PlaneElement({name: "nuage"+i, map: './examples/images/clouds/nuage'+i+'.png', transparent: true, depth: -6*(i)}));
      cloud.x = (Math.random()*60 ) - 30
      this.clouds.push(cloud);
      this.planes.push(cloud);
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
        },
        onFinish: () => {
          this.executeAction('transitionOut');
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

      this.rocket.display();

      forest.on("load", () => {
        forest.start();
      })

      this.initListeners();
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
