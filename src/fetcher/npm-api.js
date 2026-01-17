import { handleFetch } from ".";

const NPM_API_ENDPOINT = "https://api.npmjs.org/downloads";
const NPM_REGISTRY_ENDPOINT = "https://registry.npmjs.org";

// Helper to handle fetch errors

// Get download count for a period
export async function getDownloadPoint(period, packageName) {
	const url = `${NPM_API_ENDPOINT}/point/${period}/${encodeURIComponent(packageName)}`;
	return handleFetch(url);
}

// Get package details from npm registry
export async function getPackageDetails(packageName) {
	const url = `${NPM_REGISTRY_ENDPOINT}/${encodeURIComponent(packageName)}`;
	const response = await handleFetch(url);

	if (!response?._id) {
		return null;
	}

	return response;
}
