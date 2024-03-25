export const load = async (name, loadModule, context = document) => {
  if (context.getElementsByTagName(name).length > 0) {
    await loadModule();
  }
};

export const isNodeList = (nodes) => {
  var stringRepr = Object.prototype.toString.call(nodes);

  return (
    typeof nodes === "object" &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    typeof nodes.length === "number" &&
    (nodes.length === 0 ||
      (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
  );
};
