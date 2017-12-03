
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
	}[]

	/** Function handler to apply parallax effects to all 'views' */
	private readonly applyParallax = event => {
		const scroll = getPageScroll()
		const viewportHeight = getViewportHeight()
		for (const {view, layers} of this.views) {
			const progress = getScrollProgressThroughElement({scroll, viewportHeight, element: view})
			const centeredProgress = (progress * 2) - 1
			for (const layer of layers) {
				const magnitude = parseFloat(layer.getAttribute("data-chillax-layer"))
				const parallax = centeredProgress * magnitude * (view.offsetHeight / 10)
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
			return {view, layers}
		})
		window.addEventListener("scroll", this.applyParallax)
		window.addEventListener("resize", this.applyParallax)
	}

	/** Deactivate and shutdown this chillax instance and all associated
		parallax effects */
	dispose() {
		window.removeEventListener("scroll", this.applyParallax)
		window.removeEventListener("resize", this.applyParallax)
	}
}
