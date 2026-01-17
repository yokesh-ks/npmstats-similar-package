import { getSimilarPackages } from "./services/similar-packages.js";

// CORS headers
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

export default {
	async fetch(request) {
		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		const url = new URL(request.url);
		const path = url.pathname;

		// Health check endpoint
		if ((path === "/" || path === "/health") && request.method === "GET") {
			return new Response(
				JSON.stringify({
					status: "ok",
					message: "NPM Similar Packages API",
				}),
				{
					headers: {
						"Content-Type": "application/json",
						...corsHeaders,
					},
				},
			);
		}

		// POST endpoint for similar packages: accepts { "package": "packageName" }
		if (request.method === "POST" && path === "/") {
			console.log("package");
			try {
				const body = await request.json();
				const packageName = body.package;

				if (!packageName || typeof packageName !== "string") {
					return new Response(
						JSON.stringify({
							error:
								"Package name is required in request body as 'package' field",
						}),
						{
							status: 400,
							headers: {
								"Content-Type": "application/json",
								...corsHeaders,
							},
						},
					);
				}

				const similarPackages = await getSimilarPackages(packageName);

				return new Response(JSON.stringify(similarPackages), {
					headers: {
						"Content-Type": "application/json",
						"Cache-Control": "public, max-age=3600",
						...corsHeaders,
					},
				});
			} catch (error) {
				console.error("Error fetching similar packages:", error);
				return new Response(
					JSON.stringify({
						error: "Failed to fetch similar packages",
					}),
					{
						status: 500,
						headers: {
							"Content-Type": "application/json",
							...corsHeaders,
						},
					},
				);
			}
		}

		// 404 for unknown routes
		return new Response(
			JSON.stringify({
				error: "Not found",
				availableEndpoints: [
					"GET /health - Health check",
					'POST / - Get similar packages (body: { "package": "packageName" })',
				],
			}),
			{
				status: 404,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders,
				},
			},
		);
	},
};
