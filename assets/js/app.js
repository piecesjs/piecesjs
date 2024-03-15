import { addDynamicallyElements } from './utils/addDynamicallyElements.js';
import { paths } from "/piecesconfig.json" assert { type: "json" };

// 
// IMPORT pieces
// 
// ------------------------------------------------------------
addDynamicallyElements('c-more', `${paths.js.components}/More.js`);
addDynamicallyElements('c-header', `${paths.js.components}/Header.js`);
// ------------------------------------------------------------