class ParallaxControl {
  constructor(params) {
    this.canvas = params.canvas
    this.camera = params.camera

    this.spherical = new THREE.Spherical();
	  this.sphericalDelta = new THREE.Spherical();

    this.rotateSpeed = params.rotateSpeed ? params.rotateSpeed: 0.005
    this.rotateStart =   new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)
    this.rotateEnd = new THREE.Vector2()
    this.rotateDelta = new THREE.Vector2()

    this.winWidth = window.innerWidth
    this.winHeight = window.innerHeight
    this.scenePosition = params.scenePosition
    console.log(params.scenePosition)
    this.initListeners()
  }
  initListeners() {
    this.canvas.addEventListener('mousemove', this.rotateFromMouseMove.bind(this));
  }

  resize() {

  }

  rotateLeft(angle) {
    this.sphericalDelta.theta -= angle;
    
  }   

  rotateUp(angle) {
    this.sphericalDelta.phi -= angle;
    // console.log(angle)
  }

  rotateFromMouseMove(e) {
    this.rotateEnd.set( e.clientX, e.clientY );
    // this.rotateStart.x = this.rotateStart.x+this.scenePosition.x
    // this.rotateStart.y = this.rotateStart.y+this.scenePosition.y
    this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

    this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / (this.winWidth+this.scenePosition.x) * this.rotateSpeed );
    this.rotateUp( 2 * Math.PI * this.rotateDelta.y / (this.winHeight+this.scenePosition.y) * this.rotateSpeed );

    this.rotateStart.copy( this.rotateEnd );
    
  }

  update(scenePosition) {
    this.scenePosition = scenePosition
    this.offset = new THREE.Vector3()
    this.offset.copy(this.camera.position)

    this.spherical.setFromVector3( this.offset );

    this.camera.lookAt(new THREE.Vector3(scenePosition.x,0,0))
    
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    this.offset.setFromSpherical( this.spherical );
 
    this.camera.position.x = this.offset.x
    this.camera.position.y = this.offset.y
    this.camera.position.z = this.offset.z

    this.sphericalDelta.theta *= ( 1 - 0.1 );
		this.sphericalDelta.phi *= ( 1 - 0.1 );

    // this.sphericalDelta.set(0,0,0)

  }
}

export default ParallaxControl
