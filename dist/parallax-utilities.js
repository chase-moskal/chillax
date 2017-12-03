"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getVerticalPageScroll() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return top;
}
exports.getVerticalPageScroll = getVerticalPageScroll;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
function makeArray(arraylike) {
    return Array.prototype.slice.call(arraylike);
}
exports.makeArray = makeArray;
function getElementVerticalPagePosition(element) {
    var top = 0;
    do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
    } while (element);
    return top;
}
exports.getElementVerticalPagePosition = getElementVerticalPagePosition;
function calculateProgress(_a) {
    var value = _a.value, start = _a.start, end = _a.end;
    var range = end - start;
    var journey = value - start;
    return journey / range;
}
exports.calculateProgress = calculateProgress;
function getScrollProgressOverElement(element) {
    var scroll = getVerticalPageScroll();
    var viewportHeight = window.innerHeight;
    var viewportMidpoint = scroll + (viewportHeight / 2);
    var top = getElementVerticalPagePosition(element);
    var height = element.offsetHeight;
    var bottom = top + height;
    var value = viewportMidpoint;
    var start = top - (viewportHeight / 2);
    var end = bottom + (viewportHeight / 2);
    return calculateProgress({ value: value, start: start, end: end });
}
exports.getScrollProgressOverElement = getScrollProgressOverElement;
//# sourceMappingURL=parallax-utilities.js.map