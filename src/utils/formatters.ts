export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export const formatDimensions = (ft: number, inches: number) => {
	if (ft === 0 && inches === 0) return 'Not specified'
	return `${ft}' ${inches}"`
}

export const truncate = (str: string, maxLength: number) => {
	if (str.length <= maxLength) return str
	return str.slice(0, maxLength) + '...'
}
