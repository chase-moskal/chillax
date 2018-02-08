
export function getVerticalPageScroll() {
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

export function getElementVerticalPagePosition(element): number {
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

export function getScrollProgressOverElement(element: HTMLElement) {
	const scroll = getVerticalPageScroll();
	const viewportHeight = window.innerHeight;

	const viewportMidpoint = scroll + (viewportHeight / 2)
	const top = getElementVerticalPagePosition(element)
	const height = element.offsetHeight
	const bottom = top + height

	const value = viewportMidpoint
	const start = top - (viewportHeight / 2)
	const end = bottom + (viewportHeight / 2)
	return calculateProgress({value, start, end})
}
