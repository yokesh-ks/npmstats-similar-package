import flatten from "flatten";
import * as natural from "natural";
import { categories } from "../constants/fixtures.js";

import { stripMarkdown } from "./stripe-markdown";

function getInCategoryMap(packageName) {
	return Object.keys(categories).find((label) =>
		categories[label].similar.some(
			(similarPackage) => similarPackage === packageName,
		),
	);
}

function getScore(categoryTokens, packageTokens) {
	const packageTokenWithoutDupes = Array.from(new Set(packageTokens));
	return packageTokenWithoutDupes.reduce((acc, curToken) => {
		const match = categoryTokens.find((token) => token.tag === curToken);
		if (match) {
			return acc + match.weight;
		}
		return acc;
	}, 0);
}

export const getCategory = async (packageName, description, keywords) => {
	if (getInCategoryMap(packageName)) {
		return {
			label: getInCategoryMap(packageName),
			score: 999,
		};
	}

	const tokenizer = new natural.WordTokenizer();
	const tokenString = `${await stripMarkdown(description)} ${keywords.join(" ")}`;
	const packageTokens = tokenizer
		.tokenize(tokenString)
		.map((token) => token.toLowerCase())
		.map(natural.PorterStemmer.stem)
		.concat(tokenizer.tokenize(packageName).map(natural.PorterStemmer.stem));

	const scores = {};
	let maxScoreCategory = {
		category: "",
		score: 0,
	};

	Object.keys(categories).forEach((label) => {
		const categoryTokens = flatten(
			categories[label].tags.map((tagObj) =>
				tokenizer.tokenize(tagObj.tag).map((tokenizedTag) => ({
					tag: natural.PorterStemmer.stem(tokenizedTag).toLowerCase(),
					weight: tagObj.weight,
				})),
			),
		);

		const score = getScore(categoryTokens, packageTokens);
		scores[label] = score;
		if (score > maxScoreCategory.score) {
			maxScoreCategory = {
				label,
				score,
			};
		}
	});

	return maxScoreCategory;
};
