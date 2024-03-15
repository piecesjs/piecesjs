import { paths } from "/piecesconfig.json" assert { type: "json" };

// Import a folder
import.meta.glob(`/assets/css/settings/*.css`, {eager: true});

// Import a file
import '/assets/css/global.css';
