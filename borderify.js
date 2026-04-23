console.log("borderify running on", location.href);
debugger;

const BORDER_COLOR = "#ff9500";
const BORDER_WIDTH = "4px";

document.documentElement.style.boxSizing = "border-box";
document.documentElement.style.border = `${BORDER_WIDTH} solid ${BORDER_COLOR}`;