
/*

CHILLAX — vertical parallax engine

*/

import {
	clamp,
	makeArray,
	getPageScroll,
	getViewportHeight,
	getTopOffsetRelativeToPage,
	getScrollProgressThroughElement
} from "./parallax-utilities"

/**
 * Parameters to create a new chillax instance
 */
export interface ChillaxParams {

	/** HTML elements in which to apply parallax effects */
	views?: HTMLElement[] | NodeList

	/** Whether to allow gyroscope-based parallax effects, if it's available */
	allowGyroscope?: boolean
}

/**
 * Parallax scene object, a group of elements and information related to one
 * area of parallax effects
 */
export interface ChillaxScene {

	/** Containing element of a parallax scene, effects are calculated relative to
	    this element */
	view: HTMLElement

	/** Layers which are translated vertically to achieve parallax effect */
	layers: HTMLElement[]

	/** Percentage of view height reserved for parallax layer sliding action */
	leeway: number
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
	private static readonly getDefaultParams = (): Partial<ChillaxParams> => ({

		// query all chillax views on the page
		views: document.querySelectorAll("[data-chillax]"),

		// only allow gyro on ios devices
		allowGyroscope: !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
	})

	/** Parallax scenes represent areas to calculate and apply parallax effects */
	private readonly scenes: ChillaxScene[]

	/** Whether or not to initially install event listeners for gyroscopic
	    activity */
	private readonly allowGyroscope: boolean

	/** Causal source of parallax actuation */
	private mode: "scroll" | "gyroscope" = "scroll"

	/**
	 * Apply parallax effects to a chillax scene
	 */
	private readonly applyParallaxToView = (progress: number, {view, layers, leeway}: ChillaxScene) => {
		const centeredProgress = (progress * 2) - 1

		for (const {view, layers, leeway} of this.scenes) {
			const viewHeight = view.offsetHeight
			const leewayPixels = (leeway / 100) * viewHeight

			for (const layer of layers) {
				const depth = parseFloat(layer.getAttribute("data-chillax-layer"))
				const parallax = (centeredProgress * (leewayPixels / 2) * depth) / 10
				layer.style.transform = `translate3d(0px, ${parallax}px, 0px)`
			}
		}
	}

	/**
	 * Apply parallax based on scolling activity
	 */
	private readonly handleScrollParallax = () => {
		if (this.mode !== "scroll") return

		const scroll = getPageScroll()
		const viewportHeight = getViewportHeight()

		for (const scene of this.scenes) {
			const progress = getScrollProgressThroughElement({scroll, viewportHeight, element: scene.view})
			this.applyParallaxToView(progress, scene)
		}
	}

	/**
	 * Apply parallax based on gyroscope activity
	 */
	private readonly handleGyroscopeParallax = (event: DeviceOrientationEvent) => {
		const {alpha, beta, gamma} = event
		if (isNaN(alpha) || isNaN(beta) || isNaN(gamma)) return
		this.mode = "gyroscope"

		const angle = gamma
		const angleStart = -10
		const angleEnd = -60
		const angleRange = angleEnd - angleStart
		const unclampedProgress = (angle - angleStart) / angleRange
		const invertedProgress = clamp(unclampedProgress, 0, 1)
		const progress = 1 - invertedProgress

		for (const scene of this.scenes) {
			this.applyParallaxToView(progress, scene)
		}
	}

	/**
	 * Create a chillax instance for parallax effects
	 */
	constructor(params?: ChillaxParams) {
		const {views, allowGyroscope} = <ChillaxParams>{...Chillax.getDefaultParams(), ...params}

		this.allowGyroscope = allowGyroscope

		if (!views) throw new Error("chillax requires an array of views")
		this.scenes = makeArray(views).map((view: HTMLElement): ChillaxScene => {
			const layers = makeArray(view.querySelectorAll("[data-chillax-layer]"))
			const leeway = parseFloat(view.getAttribute("data-chillax")) || 100
			return {view, layers, leeway}
		})

		window.addEventListener("scroll", this.handleScrollParallax)
		window.addEventListener("resize", this.handleScrollParallax)
		this.handleScrollParallax()

		if (this.allowGyroscope) {
			window.addEventListener("deviceorientation", this.handleGyroscopeParallax)
		}
	}

	/**
	 * Disable chillax instance, stopping all parallax effects
	 */
	dispose() {
		window.removeEventListener("scroll", this.handleScrollParallax)
		window.removeEventListener("resize", this.handleScrollParallax)
		if (this.allowGyroscope) {
			window.removeEventListener("deviceorientation", this.handleGyroscopeParallax)
		}
	}
}
