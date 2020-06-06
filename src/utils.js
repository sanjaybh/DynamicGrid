function mergeObjects() {
  var result = {};
  for (var i = 0; i < arguments.length; i++) {
    var keys = Object.keys(arguments[i]),
      object = arguments[i] || {};
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      result[key] = object[key];
    }
  }
  return result;
}

function createElement(tag, styleClasses) {
  var element = document.createElement(tag);
  if (styleClasses && styleClasses.length) {
    styleClasses.forEach(styleClass => {
      element.classList.add(styleClass);
    });
  }
  return element;
}

module.exports = {
  mergeObjects: mergeObjects,
  createElement: createElement
};
