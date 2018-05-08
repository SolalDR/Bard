
/**
 * Provide an interface control
 */

class Control {

  constructor() {

    this.menu = document.querySelector("#controller");
    this.items = this.menu.querySelectorAll(".control__menu-item");
    this.btn = this.menu.querySelector("#control-menu-btn"); 
    this._display = false;

    this.initEvents();
    
  }

  toggle() {
    this.display = this.display ? false : true
  }


  get display() {
    return this._display;
  }


  set display(value) {
    if (value) {
      this._display = true; 
      this.menu.classList.replace("control--hide", "control--display")
    } else {
      this._display = false;
      this.menu.classList.replace("control--display", "control--hide") 
    }
  }


  initEvent(btn) {

    var target = btn.getAttribute("data-target");
    if( target ){
      var view = document.querySelector("#"+target+"-panel");
      
      if( view ){
        var closeView = view.querySelector(".panel__close");
        if( closeView ){
          closeView.addEventListener("click", function(){
            view.classList.toggle("panel--hidden");
          })     
        }
      }
    }

    btn.addEventListener("click", function(e){
      if( view && target ) {
        view.classList.toggle("panel--hidden");
      }
      if( !this.href ){
        e.preventDefault();
      }
    })
  }

  initEvents() {

    this.btn.addEventListener("click", () => {
      this.toggle();
    })

    for(var i=0; i<this.items.length; i++){
      this.initEvent(this.items[i]);
    }

  }

}


export default Control
