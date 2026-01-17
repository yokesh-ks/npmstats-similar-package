import { handleFetch } from ".";

const NPMIO_API_ENDPOINT = "https://api.npms.io/v2";

// Get package analysis from npms.io
export async function getPackageAnalysis(packageName) {
	const url = `${NPMIO_API_ENDPOINT}/package/${encodeURIComponent(packageName)}`;
	return handleFetch(url);
}
