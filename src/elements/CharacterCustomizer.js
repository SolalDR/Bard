import GLTFLoader from './../utils/glTFLoader'
import GLTFExporter from './../utils/glTFExporter'
import Element from "./../Element.js";
import * as THREE from 'three'

class CharacterCustomizer extends Element {
  constructor(args) {
    super(args);
    this.type = "ui-utils";
    this.eventsList = ["load", "change", "save"];
    this.path = args.path ? args.path : null;
    this.character = args.character ? args.character : null;
    this.autoDisplay = true;

    if( !this.path && !this.character ) return; 

    this.sceneRef = args.scene;
    this.onLoad = args.onLoad;
    this.actions = [];

    this.bodyParts = {
      csqe: [],
      tete: [],
      crps: [],
      bras: [],
      jmbe: [],
    }

    
    if( this.character ){
      this.loaded = true;
      this.dispatch("load")
    }

    if( this.path ) this.import(this.path);
  }

  import(path) {
    this.loader = new GLTFLoader()
    this.loader.setCrossOrigin = "anonymous"
    
    this.loader.load( path,  ( gltf ) => { 
      this.scene = gltf;
      gltf.scene.traverse((child)=> {
        if (child.isMesh) {
          if(child['material']) {
            
            // Manage material
            let mat = new THREE.MeshBasicMaterial()
            let color = child.material.color
            let opacity = child.material.opacity
            child.material = mat
            child.material.color = color
            child.material.opacity = opacity
            child.material.realOpacity = opacity
            child.material.transparent = true
            child.material.depthTest = false
            child.material.depthWrite = false

            // Manage name & classification
            child.name = child.parent.parent.name.replace('-', '').slice(0,5)
            this.bodyParts[child.name.slice(0,4)].push(child)
            
            var matches = child.name.match(/\d+/);
            if (matches[0] != 2) {
              child.visible = false
            }
          }
        }
      })

      // Create customize character
      this.character = new THREE.Group();
      this.character.name = this.name;
      this.character.add(gltf.scene);
      this.character.rotation.x = Math.PI/2;
      this.character.scale.set(4,4,4); 
      

      this.mixer = new THREE.AnimationMixer( gltf.scene );
      for(let i=0; i< gltf.animations.length; i++) {
        this.actions.push(this.mixer.clipAction(gltf.animations[i]))
      }

      if( this.onLoad ) this.onLoad.call(this);

      this.actions[5].play()

      this.loaded = true;
      this.dispatch("load")
    });
  }

  export() {
    // console.log(this.scene);    
    this.exporter = new GLTFExporter();
    // console.log(this.scene.scenes[0].children[0]);
    this.exporter.parse(this.sceneRef.children, function(gltf) {
      console.log(gltf)
    }, {
      onlyVisible: false,
      truncateDrawRange: false,
      forceIndices: true
    });
  }
  

  display() {
    var template = `<div id="customizeCharacterFragment" class="customizeContainer">
        <h1>Personnalise ton héro !</h1>
        <div class="contentWrapper">
          <div class="left">
              <div class="categoriesContainer">
                <div class="categories">
                  <button class="categoryItem" id="csqe">Casque</button>
                  <button class="categoryItem" id="tete">Tete</button>
                  <button class="categoryItem" id="crps">Corps</button>
                  <button class="categoryItem" id="bras">Bras</button>
                  <button class="categoryItem" id="jmbe">Jambe</button>
                </div>
                <div id="armorChoice" class="armorChoice">
                </div>
              </div>
          </div>
          <div class="right">
            <form action="">
                <select name="slct" id="slct" class="title">
                  <option>Titre de ton héro</option>
                  <option value="1">Chevalier</option>
                  <option value="2">Chevaleresse</option>
                  <option value="3">Prince</option>
                  <option value="4">Princesse</option>
                </select>
                <input type="text" id="name" placeholder="Nom de ton héro">
            </form>
          </div>
        </div>
        <form action="">
          <button class="validate" id="validate">C'est parti</button>  
        </form>
      </div>`

    var fakeElement = document.createElement("fake");
    fakeElement.innerHTML = template;

    this.element = fakeElement.firstChild;
    document.body.appendChild(this.element);
    this.categories = document.querySelectorAll('.categoryItem')
    for (let i = 0; i < this.categories.length; i++) {
      const element = this.categories[i];
      element.addEventListener('click', this.displayItems.bind(this, element.id))
    }
  }

  hide() {
    this.element.parentNode.removeChild(this.element);
  }

  displayItems(currentType) {
    this.armorChoiceContainer = document.querySelector('.armorChoice')
    this.armorChoiceContainer.innerHTML = ''
    
    for (let i = 0; i < 4; i++) {
      let btn = document.createElement("BUTTON");
      btn.id = currentType+(i+1)
      btn.innerHTML = btn.id
      btn.classList.add('armorItem')
      btn.addEventListener('click', this.changeElement.bind(this, btn.id))
      
      this.armorChoiceContainer.appendChild(btn)
    }
  }

  changeElement(selectedElement) {
    if (this.character) {
     for (let i = 0; i < this.bodyParts[selectedElement.slice(0,4)].length; i++) {
       let element = this.bodyParts[selectedElement.slice(0,4)][i]
       element.visible = false
       if(element.name == selectedElement) {
        element.visible = true
       }
     }
    }
  }
}

export default CharacterCustomizer;
