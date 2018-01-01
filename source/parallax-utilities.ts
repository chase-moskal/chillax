
export function getPageScroll() {
	const doc = document.documentElement
	const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
	return top
}

export function clamp(value, min, max): number {
	return Math.min(Math.max(value, min), max)
}

export function makeArray<T = any>(arraylike: any): Array<T> {
	return Array.prototype.slice.call(arraylike)
}

export function getViewportHeight(): number {
	return window.innerHeight
}

export function getTopOffsetRelativeToPage(element): number {
		let top = 0
		do {
				top += element.offsetTop || 0;
				element = element.offsetParent;
		} while (element)
		return top
}

export function calculateProgress({value, start, end}: {
	value: number
	start: number
	end: number
}): number {
	const range = end - start
	const journey = value - start
	return journey / range
}

export function getScrollProgressThroughElement(params: {
	scroll?: number
	viewportHeight: number
	element: HTMLElement
}) {
	const {viewportHeight, element, scroll = window.scrollY} = params
	const top = getTopOffsetRelativeToPage(element)
	const height = element.offsetHeight

	return calculateProgress({
		value: scroll,
		start: top - viewportHeight,
		end: height + viewportHeight
	})
}
