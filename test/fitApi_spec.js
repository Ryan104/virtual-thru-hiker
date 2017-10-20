// testing the API requires an accessToken

const expect = require('chai').expect;
const request = require('request');

const accessToken = "ya29.GmLqBMSMXfwoEV3GsP7DPzgwS5Nv1yiskIAqA6NEXjYx2h8L27fdm9YLA1pnGAtpp_QriFn-rXdknb13ow_0IGVJhn1WolG5HtVOU55k74V2CJBWDAlUrwE2MjSRSsAFBI_8iw"; // hard code accessToken for testing

let testAPI = true; // set to false when not testing the API

if(testAPI){
	let apiBody;
	before((done) => {
		const options = {
			url:'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived%3Acom.google.step_count.delta%3Acom.google.android.gms%3Aestimated_steps/datasets/1507096800000000000-1507106365767000000?key=AIzaSyBuk-lBklIXJa-RMbLUgv73c5IbBbgvWD8',
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		};
		request(options, (err, response, body) => {
			apiBody = JSON.parse(body);
			done();
		});
	});

	describe('Fit API', () => {
		it('should not return with an error', () => {
			expect(apiBody).to.not.have.property('error');
		});
		it('should contain a property points', () => {
			expect(apiBody).to.have.property('point');
		});
		it('should have a points array', () => {
			expect(apiBody.point).to.be.an('array');
		});
	});
}