export async function handleFetch(url) {
	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch {
		return null;
	}
}
