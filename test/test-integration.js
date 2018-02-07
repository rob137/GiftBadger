const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const faker = require('faker');
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const {UserData} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// ---------- CREATE DUMMY DATA ----------------
function generateGiftPickedObj() {
  return {
  	'giftName': faker.random.word(),
  	'giftLink': faker.internet.url(),
  	'price': Math.floor(Math.random() * 10)
  }
}

function generateGiftsPickedArr() {
	let giftsPickedArr = [];
	for (let i=1; i<=3; i++) {
    giftsPickedArr.push(generateGiftPickedObj());
  }
}

function generateEventData() {
  return {
    'eventName': faker.random.word(),
    'eventDate': faker.date.future(),
    'giftsPicked': generateGiftsPickedArr()
  }
}

function generateEventsArr() {
  let eventsArr =[];
  for (let i=1; i<=3; i++) {
    eventsArr.push(generateEventData());
  }
  return eventsArr;
}

function generateGiftIdeas() {
  let giftIdeasArr = [];
  for (let i=1; i<=5; i++) {
    giftIdeasArr.push(faker.random.word());
  } 
  return giftIdeasArr;
}

function generateGiftList() {
  return {
    'name': faker.name.firstName(),
    'giftIdeas': generateGiftIdeas(),
    'events': generateEventsArr()
  }
}

function generateGiftListArr() {
  let giftListArr = [];
  for (let i=1; i<=3; i++) {
    giftListArr.push(generateGiftList());
  }
  return giftListArr;
}

function generateUserData() {
  return {
  	'firstName': faker.name.firstName(),
    'email': faker.internet.email(),
    'budget': Math.floor(Math.random() * 300),
    'giftLists': generateGiftListArr()
  }
}


// ---------- SEED/TEARDOWN TEST DB ----------------
function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i=1; i<=5; i++) {
    seedData.push(generateUserData());
  }
  return UserData.insertMany(seedData);
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}



// ---------- TESTS ----------------

describe('User data API resource', function() {

  before(function() {
  	return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
  	return seedUserData();
  })

  afterEach(function() {
  	return tearDownDb();
  });

  after(function() {
  	return closeServer();
  });

  
  // Get a profile; then request it by email; check response matches original
  describe('GET endpoint', function() {
    it ('should return appropriate user profile by email', function() {
    let reqEmail;
    
    return UserData
      .findOne()
      .then(function(userData) {
        reqEmail = userData.email;
        return userData; 
      })
      .then(function(userData) {
        return chai.request(app) 
          .get(`/users/${reqEmail}`)
          .then(function (res) {
            expect(res).to.have.status(200);
            console.log(res.body.firstName);
            console.log(userData.firstName);
            expect(res.body.firstName).to.equal(userData.firstName);
            expect(res.body.budget).to.equal(userData.budget);
            expect(res.body.email).to.equal(userData.email);
          })
      })
    })
  });
  
  // Create a profile with name & email; then check that response name/email match
  describe('POST endpoint', function() {
  	it('should add a new user profile', function() {
  		const newUser = generateUserData();
  		
  		return chai.request(app)
  		  .post('/users')
  		  .send(newUser)
  		  .then(function(res) {
  		  	expect(res).to.have.status(201);
  		  	expect(res).to.be.json;
  		  	expect(res.body).to.include.keys(
  		  		'id', 'email', 'firstName');
  		  	expect(res.body.firstName).to.equal(newUser.firstName);
  		  	expect(res.body.email).to.equal(newUser.email);

  		  })
  	});
  });

  // Edit an entry, note its Id and then check that that the entry stored under that id has changed
  // appropriately.  Note that dates prevent comparisons, so we manually pick a couple of fields.
  describe('PUT endpoint', function() {
  	it('should update fields when sent', function() {
  		const updateData = {
  			'budget': 500,
        giftLists: generateGiftListArr()
  		}
  	
  	  return UserData
  	  	.findOne()
  	  	.then(function(userData) {
  	  		updateData.id = userData.id;;
  	  		return chai.request(app)
  	  		  .put(`/users/${userData.id}`)
  	  		  .send(updateData);
  	  	})
  	  	.then(function(res) {
  	  		expect(res).to.have.status(200);
  	  		return UserData.findById(updateData.id)
  	  	})
  	  	.then(function(userData) {
  	  		expect(userData.budget).to.equal(updateData.budget);
  	  		expect(userData.giftLists[0].events[0].eventName).to.equal(updateData.giftLists[0].events[0].eventName);
  	  		expect(userData.giftLists[2].giftIdeas[2]).to.equal(updateData.giftLists[2].giftIdeas[2]);
  	  	});

  	});
  });

  // Find one; send a delete request (by id); check that it's gone
  describe('Delete endpoint', function() {
    it('delete a user by id', function() {
    	let userData;
    	return UserData
    	  .findOne()
    	  .then(function(_userData) {
    	  	userData = _userData;
    	  	return chai.request(app).delete(`/users/${userData.id}`);
    	  })
    	  .then(function(res) {
    	  	expect(res).to.have.status(204);
    	  	return UserData.findById(userData.id);
    	  })
    	  .then(function(_userData) {
    	  	expect(_userData).to.be.null;
    	  })
    });
  });
});