import * as THREE from "three"; 
import * as Bard from "./src/bard.js";
import fragmentConstructor1 from "./examples/fragment_start.js"
import fragmentConstructor2 from "./examples/fragment_second.js"

window.Bard = Bard

// Custom Fragment
var fragment1 = new fragmentConstructor1();
fragment1.id = 1;
fragment1.childrenLinks = [2];

var fragment2 = new fragmentConstructor2();
fragment2.id = 2;
fragment2.childrenLinks = [3, 4];

window.addEventListener("load", function(){

  var book = new Bard.Book({
    debug: false,
    canvas: document.querySelector("#canvas")
  });

  book.on("customize:display", (element)=>{
    console.log(element)
  })

  book.dictionnary = [
    {
      "id": 1,
      "name": "Cockpit",
      "match": "(notre)",
      "url": "/examples/img/clouds/nuage1.png"
    }
  ]

  book.addFragment(fragment1);
  book.addFragment(fragment2);
  

  book.start();
  book.on("fragment:start", (e)=>{
    console.log(e)
  })

  document.body.addEventListener(" dblclick", ()=>{
    book.currentFragment.next(true)
  })

  document.body.addEventListener("keydown", (e)=>{
    console.log(e)
    if(e.keyCode == 39) book.currentFragment.next(true)
  })

  window.book = book
})
