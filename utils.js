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

function copyDiv(source, target) 
{
  const rect = source.getBoundingClientRect();

  target.style.position = "fixed";
  target.style.left = rect.left + "px";
  target.style.top = rect.top + "px";
  target.style.width = rect.width + "px";
  target.style.height = rect.height + "px";
}

function normalize(x, y) {
    const len = Math.hypot(x, y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
}

//executions
function cancellable(fn) {
    const controller = new AbortController();
    return {
        run: (...args) => fn(...args, controller.signal),
        cancel: () => controller.abort()
    };
}

function waitFor(condition, signal) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject("aborted");

        function check() {
            if (signal?.aborted) return reject("aborted");
            if (condition()) resolve();
            else requestAnimationFrame(check);
        }

        check();
    });
}
function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}