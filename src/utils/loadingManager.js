class loadingManager {
  constructor(params){
      this.loader = new THREE.JSONLoader()
      this.paths = []
  }

  loadObject(paths) {
      this.paths = paths
      this.loaded = false;
      this.count = 0;
      this.geometries = [];
      this.materials = []
      this.object = []
      return new Promise (resolve => {
          for(let i = 0; i < this.paths.length; i++) {

              this.loader.load(paths[i], (object, material)=>{

  
                  this.count ++
                  this.geometries.push(object)
                  if(material) {
                    this.materials.push(material)
                  }                    

                  if(this.count == this.paths.length) {
                      this.loaded = true;
                      if (material) {
                        this.object.push(this.geometries, this.materials)
                        resolve((this.object))
                      } else {
                        reolve(this.geometries)
                      }
                     
                  }
              })
  
             
          }        
      })
      
  }
}

export default loadingManager
