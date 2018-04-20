
export default {

  /**
   * Parse a string into a HTMLElement or A HTMLCollection
   */
  fromString(content) {

    var element = document.createElement("fragment");
    element.innerHTML = content;

    return element.children.length > 1 ? element.children : element.firstChild

  }

}
