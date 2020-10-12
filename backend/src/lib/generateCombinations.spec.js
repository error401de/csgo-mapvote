const { expect } = require('chai');

const generateCombinations = require('./generateCombinations');

describe('generateCombinations', () => {
	const input = ['a', 'b', 'c'];

	const expectedValues = [
		['a'],
		['a', 'b'],
		['a', 'b', 'c'],
		['a', 'c'],
		['b'],
		['b', 'c'],
		['c'],
	];

	it('should return a Generator to iterate over all possible non-empty combinations', () => {
		const generator = generateCombinations(input);

		expectedValues.forEach((combination) => {
			const { value } = generator.next();
			expect(combination).deep.equal(value);
		});

		expect(generator.next().done).equal(true);
	});
});
