/**
 * Load a component dynamically
 * @param name - Custom element tag name (e.g., 'c-button')
 * @param component - Function that returns a Promise importing the component
 * @param context - Context element to search for components
 */
export function load(
  name: string,
  component: () => Promise<any>,
  context?: Document | Element,
): Promise<void>;

/**
 * Check if element is a NodeList
 * @param el - Value to check
 */
export function isNodeList(el: any): el is NodeList;
