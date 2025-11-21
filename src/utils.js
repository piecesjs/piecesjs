/**
 * Load a component dynamically
 * @param {string} name - Custom element tag name (e.g., 'c-button')
 * @param {Function} loadModule - Function that returns a Promise importing the component
 * @param {Document|Element} [context=document] - Context element to search for components
 * @returns {Promise<void>}
 */
export const load = async (name, loadModule, context = document) => {
  if (context.getElementsByTagName(name).length > 0) {
    await loadModule();
  }
};

/**
 * Check if element is a NodeList
 * @param {any} nodes - Value to check
 * @returns {boolean}
 */
export const isNodeList = (nodes) => {
  var stringRepr = Object.prototype.toString.call(nodes);

  return (
    typeof nodes === 'object' &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    typeof nodes.length === 'number' &&
    (nodes.length === 0 ||
      (typeof nodes[0] === 'object' && nodes[0].nodeType > 0))
  );
};
