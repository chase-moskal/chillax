"use strict";
/*

CHILLAX — vertical parallax engine

*/
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parallax_utilities_1 = require("./parallax-utilities");
/**
 * CHILLAX — vertical parallax engine
 *
 * - provide 'view' elements to apply parallax effects within.
 *   they should have the `[data-chillax]` attribute, which describes 'leeway',
 *   the percentage of parallax sliding action allowable, relative to the height
 *   of the view (default leeway is 100)
 *
 * - parallax effect will be applied to layer elements which have the
 *   `[data-chillax-layer]` attribute
 *
 * - the numerical value of the `[data-chillax-layer]` attribute will define the
 *   speed and direction of the parallax effect
 *
 * - the parallax effect is achieved by the application of css `transform` rules
 *   using the `translate3d` css feature
 */
var Chillax = /** @class */ (function () {
    /**
     * Create a chillax instance for parallax effects
     */
    function Chillax(params) {
        var _this = this;
        /** Causal source of parallax actuation */
        this.mode = "scroll";
        /**
         * Apply parallax effects to a chillax scene
         */
        this.applyParallaxToView = function (progress, _a) {
            var view = _a.view, layers = _a.layers, leeway = _a.leeway;
            var centeredProgress = (progress * 2) - 1;
            for (var _i = 0, _b = _this.scenes; _i < _b.length; _i++) {
                var _c = _b[_i], view_1 = _c.view, layers_1 = _c.layers, leeway_1 = _c.leeway;
                var viewHeight = view_1.offsetHeight;
                var leewayPixels = (leeway_1 / 100) * viewHeight;
                for (var _d = 0, layers_2 = layers_1; _d < layers_2.length; _d++) {
                    var layer = layers_2[_d];
                    var depth = parseFloat(layer.getAttribute("data-chillax-layer"));
                    var parallax = (centeredProgress * (leewayPixels / 2) * depth) / 10;
                    layer.style.transform = "translate3d(0px, " + parallax + "px, 0px)";
                }
            }
        };
        /**
         * Apply parallax based on scolling activity
         */
        this.handleScrollParallax = function () {
            if (_this.mode !== "scroll")
                return;
            var scroll = parallax_utilities_1.getVerticalPageScroll();
            var viewportHeight = window.innerHeight;
            for (var _i = 0, _a = _this.scenes; _i < _a.length; _i++) {
                var scene = _a[_i];
                var progress = parallax_utilities_1.getScrollProgressOverElement(scene.view);
                var clampedprogress = parallax_utilities_1.clamp(progress, 0, 1);
                _this.applyParallaxToView(clampedprogress, scene);
            }
        };
        /**
         * Apply parallax based on gyroscope activity
         */
        this.handleGyroscopeParallax = function (event) {
            var alpha = event.alpha, beta = event.beta, gamma = event.gamma;
            if (isNaN(alpha) || isNaN(beta) || isNaN(gamma))
                return;
            _this.mode = "gyroscope";
            var angle = gamma;
            var angleStart = -10;
            var angleEnd = -60;
            var angleRange = angleEnd - angleStart;
            var unclampedProgress = (angle - angleStart) / angleRange;
            var invertedProgress = parallax_utilities_1.clamp(unclampedProgress, 0, 1);
            var progress = 1 - invertedProgress;
            for (var _i = 0, _a = _this.scenes; _i < _a.length; _i++) {
                var scene = _a[_i];
                _this.applyParallaxToView(progress, scene);
            }
        };
        var _a = __assign({}, Chillax.getDefaultParams(), params), views = _a.views, allowGyroscope = _a.allowGyroscope;
        this.allowGyroscope = allowGyroscope;
        if (!views)
            throw new Error("chillax requires an array of views");
        this.scenes = parallax_utilities_1.makeArray(views).map(function (view) {
            var layers = parallax_utilities_1.makeArray(view.querySelectorAll("[data-chillax-layer]"));
            var leeway = parseFloat(view.getAttribute("data-chillax")) || 100;
            return { view: view, layers: layers, leeway: leeway };
        });
        window.addEventListener("scroll", this.handleScrollParallax);
        window.addEventListener("resize", this.handleScrollParallax);
        this.handleScrollParallax();
        if (this.allowGyroscope) {
            window.addEventListener("deviceorientation", this.handleGyroscopeParallax);
        }
    }
    /**
     * Disable chillax instance, stopping all parallax effects
     */
    Chillax.prototype.dispose = function () {
        window.removeEventListener("scroll", this.handleScrollParallax);
        window.removeEventListener("resize", this.handleScrollParallax);
        if (this.allowGyroscope) {
            window.removeEventListener("deviceorientation", this.handleGyroscopeParallax);
        }
    };
    /** Get default parameters for chillax */
    Chillax.getDefaultParams = function () { return ({
        // query all chillax views on the page
        views: document.querySelectorAll("[data-chillax]"),
        // only allow gyro on ios devices
        allowGyroscope: !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    }); };
    return Chillax;
}());
exports.default = Chillax;
//# sourceMappingURL=chillax.js.map