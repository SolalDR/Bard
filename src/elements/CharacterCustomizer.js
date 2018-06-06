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
    this.selector = args.selector ? args.selector : null;
    this.character = args.character ? args.character : null;
    this.autoDisplay = false;
    this.element = null;
    if( this.selector ) {
      this.element = document.querySelector(this.selector);
    }

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
      if( this.character.loaded ){
        this.loaded = true;
        this.dispatch("load")
        this.init();
      } else {
        this.character.on("load", ()=>{
          this.loaded = true;
          this.dispatch("load")
          this.init();
        })
      }
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

  init(){
    console.log(this.character)
    this.character.mesh.traverse(child => {
      if (child.isMesh) {
        if(child['material']) {
          // Manage name & classification
          child.name = child.parent.parent.name.replace('-', '').slice(0,5)
          
          if( this.bodyParts[child.name.slice(0,4)] ){
            this.bodyParts[child.name.slice(0,4)].push(child)
          }
          
          
          var matches = child.name.match(/\d+/);
          if (matches[0] != 2) {
            child.visible = false
          }
        }
      }
    })
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
  

  display(value) {
      var template = `<div class="customization customization--hidden">
        <div id="body-part-categories-container" class="customization__list  customization__list--depth-1">
          <button id="csqe" class="customization__list-item"><%= image_tag "personnalisation/asset-head-shield" %></button>
          <button id="tete" class="customization__list-item"><%= image_tag "personnalisation/asset-head" %></button>
          <button id="crps" class="customization__list-item"><%= image_tag "personnalisation/asset-body" %></button>
          <button id="bras" class="customization__list-item"><%= image_tag "personnalisation/asset-arm" %></button>
          <button id="jmbe" class="customization__list-item"><%= image_tag "personnalisation/asset-leg" %></button>
        </div>
        <div id="body-part-choices-container" class="customization__list customization__list--depth-2"></div>
      </div>`

    if( !this.element ){
      var fakeElement = document.createElement("fake");
      fakeElement.innerHTML = template;
      this.element = fakeElement.firstChild;
      document.body.appendChild(this.element);
    }
    
    this.categories = document.querySelectorAll('#body-part-categories-container .customization__list-item')
    for (let i = 0; i < this.categories.length; i++) {
      const element = this.categories[i];
      element.addEventListener('click', this.displayItems.bind(this, element.id))
    }
    this.fragment.book.dispatch("customize:display", { element: this })
    this.element.classList.remove("customization--hidden");
  }

  hide() {
    this.element.parentNode.removeChild(this.element);
    this.element.classList.add("customization--hidden");
    this.fragment.book.dispatch("customize:hide", { element: this })
  }

  displayItems(currentType) {
    this.armorChoiceContainer = document.querySelector('#body-part-choices-container')
    this.armorChoiceContainer.innerHTML = ''
    
    for (let i = 0; i < 4; i++) {
      let btn = document.createElement("button");
      btn.id = currentType+(i+1)
      btn.innerHTML = btn.id
      btn.setAttribute("data-partcode", btn.id);
      btn.classList.add('customization__list-item')
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
     this.dispatch("change", { element: selectedElement }); 
    }
  }
}

export default CharacterCustomizer;
