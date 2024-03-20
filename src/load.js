export const load = async (name, loadModule, context = document) => {
  if (context.getElementsByTagName(name).length > 0) {
    await loadModule();
  }
};