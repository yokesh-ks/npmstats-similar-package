// Format date to YYYY-MM-DD
export function formatDate(date) {
	return date.toISOString().split("T")[0];
}

// Get start of week
export function getStartOfWeek(date) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day;
	return new Date(d.setDate(diff));
}
