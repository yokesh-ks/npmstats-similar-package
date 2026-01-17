import { categories } from "../constants/fixtures.js";
import { getBundleSize } from "../fetcher/bundlephobia-api.js";
import { getDownloadPoint, getPackageDetails } from "../fetcher/npm-api.js";
import { getPackageAnalysis } from "../fetcher/npmio-api.js";
import { getCategory } from "../helpers/get-category.js";
import { formatDate, getStartOfWeek } from "../utils/date.js";

export async function getSimilarPackages(packageName) {
	// Get package details from npm registry
	const packageDetails = await getPackageDetails(packageName);

	if (!packageDetails) {
		return [];
	}

	const description = packageDetails.description || "";
	console.log({ description });
	const keywords = packageDetails.keywords || [];

	// Get matched category
	const matchedCategory = await getCategory(packageName, description, keywords);

	console.log({ matchedCategory });

	if (!matchedCategory.label) {
		return [];
	}

	const categoryData = categories[matchedCategory.label];
	if (!categoryData) {
		return [];
	}

	// Filter out the current package from similar packages
	const similar = categoryData.similar.filter((pack) => pack !== packageName);

	// Calculate date range for downloads
	const startDate = formatDate(getStartOfWeek(new Date("2015-01-10")));
	const endDate = formatDate(new Date());
	const period = `${startDate}:${endDate}`;

	// Fetch detailed analysis for each similar package
	const detailedAnalysis = await Promise.all(
		similar.map(async (item) => {
			try {
				const [analysisRes, pointsResponse, bundleResponse] = await Promise.all(
					[
						getPackageAnalysis(item),
						getDownloadPoint(period, item),
						getBundleSize(item),
					],
				);

				if (analysisRes?.score) {
					return {
						...analysisRes,
						downloads: pointsResponse?.downloads,
						size: bundleResponse?.size,
					};
				}
				return null;
			} catch (error) {
				console.error(`Error fetching data for ${item}:`, error);
				return null;
			}
		}),
	);

	// Build the final result
	const finalResult = similar.map((item) => {
		const foundDetail = detailedAnalysis.find(
			(i) => i?.collected?.metadata?.name === item,
		);

		return {
			name: item,
			version: foundDetail?.collected?.metadata?.version || "1.0.0",
			description: foundDetail?.collected?.metadata?.description || "",
			score: foundDetail?.score
				? {
						final: foundDetail.score,
						detail: {
							quality: foundDetail.score * 0.4,
							popularity: foundDetail.score * 0.4,
							maintenance: foundDetail.score * 0.2,
						},
					}
				: {
						final: 0,
						detail: {
							quality: 0,
							popularity: 0,
							maintenance: 0,
						},
					},
			stats: [
				{ label: "Weekly Downloads", value: foundDetail?.downloads || 0 },
				{ label: "Bundle Size", value: foundDetail?.size || 0 },
				{
					label: "GitHub Stars",
					value: foundDetail?.collected?.github?.starsCount || 0,
				},
				{
					label: "Last Release",
					value: Date.now(),
				},
			],
		};
	});

	return finalResult;
}
