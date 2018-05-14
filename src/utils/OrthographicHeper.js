// import * as THREE from "three";

export default {
  
  fitToScreen(ratio, camera, offset = 8) {
    var height, width, aspect, vFov;
    
    vFOV = camera.fov * Math.PI / 180;
    
    // Get the visible height 
    height = camera.top + offset;

    // If we want a width that follows the aspect ratio of the camera, then get the aspect ratio and multiply by the height.
    aspect = window.innerWidth / window.innerHeight;
    
    width = height * aspect;
    height = width / ratio; 

    return {
      x: width,
      y: height
    }
  }

}
