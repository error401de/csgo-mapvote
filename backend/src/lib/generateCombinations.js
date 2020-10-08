function* generateCombinations(arr) {
	function* doGenerateCombinations(offset, combination) {
		if (combination.length) {
			yield combination;
		}
		for (let i = offset; i < arr.length; i++) {
			yield* doGenerateCombinations(i + 1, combination.concat(arr[i]));
		}
	}
	yield* doGenerateCombinations(0, []);
}

module.exports = generateCombinations;
