import { addDynamicallyElements } from './utils/addDynamicallyElements.js';
import piecesconfig from "/piecesconfig.json" assert { type: "json" };
const { paths } = piecesconfig;

// 
// IMPORT pieces
// 
// ------------------------------------------------------------
addDynamicallyElements('c-more', `${paths.js.components}/More.js`);
addDynamicallyElements('c-header', `${paths.js.components}/Header.js`);
// ------------------------------------------------------------