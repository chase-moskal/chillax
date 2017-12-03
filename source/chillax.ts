
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

export interface ChillaxParams {

	/** HTML elements in which to apply parallax effects */
	views: HTMLElement[]
}

/**
 * CHILLAX — vertical parallax engine
 *
 * - provide 'view' elements to apply parallax effects within
 *   they should have the `[data-chillax]` attribute, which describes 'leeway',
 *   the percentage of parallax sliding action allowable, relative to the
 *   height of the view
 *
 * - parallax effect will be applied to child elements of the views which have
 *   the `[data-chillax-layer]` attribute
 *
 * - the numerical value of the `[data-chillax-layer]` attribute will define
 *   the speed and direction of the parallax effect
 *
 * - the parallax effect is achieved by the application of css `transform`
 *   rules using the `translate3d` css feature
 */
export default class Chillax {

	/** Parallax context areas, places to apply parallax effects */
	private readonly views: {

		/** Containing element of a parallax context, effects are calculated
			relative to this element */
		view: HTMLElement

		/** Layers which are translated vertically to achieve parallax effect */
		layers: HTMLElement[]

		/** Percentage of view height reserved for parallax layer sliding action */
		leeway: number
	}[]

	/** Function handler to apply parallax effects to all 'layers' relative to
		their containing 'view' */
	private readonly applyParallax = () => {
		const scroll = getPageScroll()
		const viewportHeight = getViewportHeight()

		for (const {view, layers, leeway} of this.views) {
			const progress = getScrollProgressThroughElement({scroll, viewportHeight, element: view})
			const centeredProgress = (progress * 2) - 1
			const viewHeight = view.offsetHeight

			for (const layer of layers) {
				const depth = parseFloat(layer.getAttribute("data-chillax-layer"))
				const leewayPixels = (leeway / 100) * viewHeight

				// the money shot
				const parallax = (centeredProgress * (leewayPixels / 2) * depth) / 10
				layer.style.transform = `translate3d(0px, ${parallax}px, 0px)`
			}
		}
	}

	/** Create a chillax instance which applies parallax effects onto the
		provided html element 'views' */
	constructor({views = []}) {
		if (!views) throw new Error("chillax requires an array of views")
		this.views = makeArray(views).map(view => {
			const layers = makeArray(view.querySelectorAll("[data-chillax-layer]"))
			const leeway = parseFloat(view.getAttribute("data-chillax"))
			return {view, layers, leeway}
		})
		window.addEventListener("scroll", this.applyParallax)
		window.addEventListener("resize", this.applyParallax)
		this.applyParallax()
	}

	/** Deactivate and shutdown this chillax instance and all associated
		parallax effects */
	dispose() {
		window.removeEventListener("scroll", this.applyParallax)
		window.removeEventListener("resize", this.applyParallax)
	}
}
