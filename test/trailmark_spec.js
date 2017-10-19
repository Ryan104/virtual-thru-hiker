const expect = require('chai').expect;
const db = require('../models');

// NOTE: start mongod and run seedTrail.js before testing

describe('Trailmark Collection', () => {
	let data;
	before((done) => {
		// get data to test
		db.Trailmark.find({}, (err, res) => {
			data = res;
			done();
		});
	});
	it('Should have a documents in the collection', () => {
		expect(data.length).to.be.above(0);
	});

	it('Should have 446 documents', () => {
		expect(data.length).to.equal(446);
	});

	describe('Trailmark Document', () => {
		let testMark;
		before((done) => {
			// get random data point to test
			let random = Math.floor(Math.random()*446);
			testMark = data[random];
			done();
		});
		it('Should have a name property that is a String', () => {
			expect(testMark.name).to.be.a('string');
		});
		it('Should have a type property that is a String', () => {
			expect(testMark.type).to.be.a('string');
		});
		it('Should have a location.lon property that is an object', () => {
			expect(testMark.location.lon).to.be.a('number');
		});
		it('Should have a location.lat property that is a number', () => {
			expect(testMark.location.lat).to.be.a('number');
		});
		it('Should have a toStart property that is a number', () => {
			expect(testMark.toStart).to.be.a('number');
		});
		it('Should have a toEnd property that is a number', () => {
			expect(testMark.toEnd).to.be.a('number');
		});
	});
});