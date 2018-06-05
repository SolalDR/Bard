/**
 * A simple textnode
 */
class TextNode {

	/**
	 * @param text (string)
	 * @param rank (int)
	 */
	constructor(args){
		this.el;
		this.text = args.text; 
    this.speechs = [];
    this.recorders = [];
    this.parent = args.parent;
	}


	/** 
	 * Helper to strip html tag
	 */
	static strip(html){
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}


	init() {
    
		this.el = document.createElement("div");
		this.el.classList.add("text-node");	
		this.el.classList.add("text-node--hide");	
		this.el.innerHTML = this.text;
		
		var speechEls = this.el.querySelectorAll("*[data-speech]:not(.recorder)");
		speechEls.forEach(el => this.speechs.push({
			command: TextNode.strip(el.innerHTML),
			action: el.getAttribute("data-speech"),
			count: 0
    }));

    var recorderEls = this.el.querySelectorAll(".recorder");
    
		recorderEls.forEach(el => this.recorders.push({
      element: el,
			command: el.id,
			action: el.getAttribute("data-speech"),
			count: 0
    }));

    var dico = this.parent.fragment.book.dictionnary;
    this.manageDictionnary(dico);
    this.initListener(dico);
  }
  
  manageDictionnary(dico){
    var reg;
    for(var i=0; i<dico.length; i++) {
      reg = new RegExp(dico[i].match, "g");
      if( this.el.innerHTML.match(reg) ){
        this.el.innerHTML = this.el.innerHTML.replace(reg, "<a href='#' data-word='"+dico[i].id+"' class='clickable'>$1</a>")
      }
    }
  }
  
  initListener(dico){
    var clickables = this.el.querySelectorAll(".clickable");
  

    clickables.forEach(item => {
      var id = item.getAttribute("data-word");
      var word = null;
      for(var i=0; i<dico.length; i++)
        if(dico[i].id == id)
          word = dico[i]

      var splitedText = item.innerHTML.split("")
      for(var i=0; i<splitedText.length; i++)
        splitedText[i] = "<span class='clickable__letter'>"+splitedText[i]+"</span>";

      item.innerHTML = splitedText.join("");
      item.addEventListener("click", (e)=>{
        this.parent.dispatch("word:click", {
          element: item,
          word: word
        })
        e.preventDefault();
      })
    })
  }

	display() {

		this.el.classList.remove("text-node--hide")
		this.el.classList.add("text-node--before-display")
		this.el.classList.add("text-node--display")
		setTimeout(() => {
			this.el.classList.remove("text-node--before-display")
		}, 500)

	}

	hide() {

		this.el.classList.add("text-node--before-hide")
		this.el.classList.remove("text-node--display")
		setTimeout(() => {
			this.el.classList.remove("text-node--before-hide")
			this.el.classList.add("text-node--hide")
		}, 500)

	}

}


export default TextNode;
