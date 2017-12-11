
export function getPageScroll() {
	const doc = document.documentElement
	const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
	return top
}

export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max)
}

export function makeArray(arraylike: any) {
	return Array.prototype.slice.call(arraylike)
}

export function getViewportHeight() {
	return window.innerHeight
}

export function getTopOffsetRelativeToPage(element) {
		let top = 0
		do {
				top += element.offsetTop || 0;
				element = element.offsetParent;
		} while (element)
		return top
}

export function getScrollProgressThroughElement({scroll, viewportHeight, element}) {
	const top = getTopOffsetRelativeToPage(element)
	const height = element.offsetHeight
	const bottom = top + height
	const progressTop = top - viewportHeight
	const progressHeight = height + viewportHeight
	const progress = (scroll - progressTop) / progressHeight
	return clamp(progress, 0, 1)
}
