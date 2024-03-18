export const load = (name, src) => {
  if (document.getElementsByTagName(name).length > 0) {
    
    // console.log(name)
    dynamicLoad(src)
  }
};

async function dynamicLoad(src) {
  await import(src);
}
