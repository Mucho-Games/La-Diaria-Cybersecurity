//UTILS

export function truncate(num, digits) {
    var multiplier = Math.pow(10, digits);
    return (Math[num < 0 ? 'ceil' : 'floor'](num * multiplier) / multiplier);
}
export function inverseLerp (val, a, b) {
    return clamp((val - a) / (b - a), 0, 1);
}
export function lerp(a, b, t) {
  return a + (b - a) * t;
}
export function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}
export function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}