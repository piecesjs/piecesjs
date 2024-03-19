export const load = async (name, loadModule) => {
  if (document.getElementsByTagName(name).length > 0) {
    await loadModule();
  }
};