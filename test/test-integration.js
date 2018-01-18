const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const {app, runServer, closeServer} = require('../server');
chai.use(chaiHttp);

// --------- TEST PRECONDITIONS --------
describe('server test', function() {
	
	before(function() {
		return runServer();
	});
	
	after(function() {
		return closeServer();
	});

	// --------- TESTS --------
	describe('Root url', function() {
		it('should give 200 status code', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				})
		});
	});
			
});

