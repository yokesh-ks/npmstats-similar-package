import { handleFetch } from ".";

const BUNDLEPHOBIA_API_ENDPOINT = "https://bundlephobia.com";

// Get bundle size from bundlephobia
export async function getBundleSize(packageName) {
	const url =
		BUNDLEPHOBIA_API_ENDPOINT +
		`/api/size?package=${encodeURIComponent(packageName)}&record=true`;
	return handleFetch(url);
}
