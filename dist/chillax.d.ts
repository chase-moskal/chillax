/**
 * Parameters to create a new chillax instance
 */
export interface ChillaxParams {
    /** HTML elements in which to apply parallax effects */
    views?: HTMLElement[] | NodeList;
    /** Whether to allow gyroscope-based parallax effects, if it's available */
    allowGyroscope?: boolean;
}
/**
 * Parallax scene object, a group of elements and information related to one
 * area of parallax effects
 */
export interface ChillaxScene {
    /** Containing element of a parallax scene, effects are calculated relative to
        this element */
    view: HTMLElement;
    /** Layers which are translated vertically to achieve parallax effect */
    layers: HTMLElement[];
    /** Percentage of view height reserved for parallax layer sliding action */
    leeway: number;
}
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
export default class Chillax {
    /** Get default parameters for chillax */
    private static readonly getDefaultParams;
    /** Parallax scenes represent areas to calculate and apply parallax effects */
    private readonly scenes;
    /** Whether or not to initially install event listeners for gyroscopic
        activity */
    private readonly allowGyroscope;
    /** Causal source of parallax actuation */
    private mode;
    /**
     * Apply parallax effects to a chillax scene
     */
    private readonly applyParallaxToView;
    /**
     * Apply parallax based on scolling activity
     */
    private readonly handleScrollParallax;
    /**
     * Apply parallax based on gyroscope activity
     */
    private readonly handleGyroscopeParallax;
    /**
     * Create a chillax instance for parallax effects
     */
    constructor(params?: ChillaxParams);
    /**
     * Disable chillax instance, stopping all parallax effects
     */
    dispose(): void;
}
