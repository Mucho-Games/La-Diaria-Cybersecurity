//UTILS

function truncate(num, digits) {
    var multiplier = Math.pow(10, digits);
    return (Math[num < 0 ? 'ceil' : 'floor'](num * multiplier) / multiplier);
}
function inverseLerp (val, a, b) {
    return clamp((val - a) / (b - a), 0, 1);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}
function clamp01(num) {
  return Math.max(0, Math.min(num, 1));
}
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

//Vectors and positions

function getElementScreenPosition (elem) {
    var e = elem.getBoundingClientRect();
    return {
        x: e.left + e.width/2,
        y: e.top + e.height/2
    };
}

function normalize(x, y) {
    const len = Math.hypot(x, y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
}