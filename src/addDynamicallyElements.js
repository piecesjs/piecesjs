export const loadDynamically = (name, src) => {
  if (document.getElementsByTagName(name).length > 0) {
    // dynamically insert script (if doesn't already exist)
    if (!document.getElementById(name)) {
      const script = document.createElement("script");
      script.src = src;
      script.id = name;
      script.type = "module";
      document.body.appendChild(script);
    }
  }
};
