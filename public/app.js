'use strict';

// Object constructor for new users;
function User(username, email) {
	this.username = username;
	this.email = email;
	this.giftLists = [];
	this.budget = 0;
};


const MOCK_USER_DATA = { "rob": {	
		"username": "rob",
		"email": "robertaxelkirby@gmail.com",
		"budget": "0",
		"giftLists": [{
			"name": "Sarah",
			"gender": "female",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "1 Jan 2019",
				"finalDecision": {
					"giftName": "Cocoa Powder",
					"giftLink": "https://www.amazon.co.uk/Organic-Raw-Cacao-Powder-250g/dp/B005GT94GG",
					"cost": "7.55"
				},
				"remindBefore": "30"
			}],
			"giftIdeas": ["Cocoa Powder", "Sweater", "Tartan Scarf", "Ski boots", "Bottle Of Red Wine"]
		}, {
			"name": "Dan",
			"gender": "male",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "20 Feb 2018",
				"finalDecision": {
					"giftName": "Pot Plant",
					"giftLink": "https://www.amazon.co.uk/Ceramic-Ancient-Succulent-Container-Planter/dp/B01EMXFCJE/ref=sr_1_1_sspa?ie=UTF8&qid=1516359016&sr=8-1-spons&keywords=plant+pot&psc=1",
					"cost": "9.50"
				},
				"remindBefore": "30"
			}],
			"giftIdeas": ["Plant Pot", "Headphones", "Espresso Cups"]
		}, {
			"name": "Angie",
			"gender": "female",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "10 Mar 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}],
			"giftIdeas": ["Swimming hat", "Woollen Hat", "Bicycle Helmet", "Remote Control Car", "Bucket and Spade"]
		}]
	},
	"gemma": {	
		"username": "gemma",
		"email": "gemmakirby16@gmail.com",
		"budget": "40",
		"giftLists": [{
			"name": "Mike",
			"gender": "Male",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "1 Jan 2019",
				"finalDecision": {
					"giftName": "Potpourri",
					"giftLink": "https://www.amazon.co.uk/Various-Dried-Flowers-lavender-marigold/dp/B00ENG2DAC/ref=sr_1_2?s=kitchen&ie=UTF8&qid=1516614907&sr=1-2&refinements=p_4%3ADried+Flowers",
					"cost": "4"
				},
				"remindBefore": "30"
			}],
			"giftIdeas": ["Potpourri", "Shopping bags", "Coffee table", "Toolkit"]
		}, {
			"name": "Rebecca",
			"gender": "Female",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "20 Feb 2018",
				"finalDecision": {
					"giftName": "Samsung Galaxy J5",
					"giftLink": "https://www.carphonewarehouse.com/samsung/galaxy-j5-2017.html",
					"cost": "20"
				},
				"remindBefore": "30"
			}],
			"giftIdeas": ["Samsung Galaxy J5", "Paintbrushes", "Coffee pods"]
		}, {
			"name": "Nadia",
			"gender": "female",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "10 Mar 2018",
				"finalDecision": "none",
				"remindBefore": "30"
			}],
			"giftIdeas": ["Tennis racket", "Pool cue", "Snooker table", "Beats headphones"]
		}]
	}
};


// To make dates easy to read
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Will ask user for their email on login and use it as a variable?
let userEmail = `robertaxelkirby@gmail.com`;

function checkUserLoggedIn() {
	// Aspirational: app remembers whether user is logged in.
	// for now, we assume user isn't logged in: 
	loadLoginOrRegisterHtml();
	handleLoginOrRegister();
}

function loadLoginOrRegisterHtml() {
	let loginOrRegisterHtml = `
	<h1>Gift App</h1>
				<form>
					<label for="username">Username:</label>
					<input type="text" id="username" name="username" class="js-username-input" required><br>
					<label for="password">Password:</label>
					<input type="password" id="password" name="password" class="js-password-input" required><br>
					<button class="js-login-button">Login</button>
					<button class="js-register-button">Register</button>
				</form>
	`
	$(".js-login-or-register").html(loginOrRegisterHtml);
}

// For when user clicks 'login' or 'register'
function handleLoginOrRegister() {
	$('.js-login-button').on('click', function(event) {
		event.preventDefault();
		let usernameInput = $('.js-username-input').val().toLowerCase();
		// ??? Seem insecure!  For testing only until best practise found:
		let passwordInput = $('.js-password-input').val();
		attemptLogin(usernameInput, passwordInput);
	});

	$('.js-register-button').on('click', function(event) {
		event.preventDefault();
		loadRegisterHtml();
	});
}

function attemptLogin(usernameInput, passwordInput) {
	// Aspirational: talk to server to validate login fields username/password... 
	// For now:
	if (usernameInput) {
		// remove login page
		$(".js-login-or-register").html('');
		// load user's giftlist!
		loadPersonalisedPage(usernameInput)
	} 
}

// -------------------------- LOAD REGISTRATION PAGE --------------------------------
function loadRegisterHtml() {
	let newUserDetails, setupHtml, registerHtml = `
						<h2>Register</h2>
				<form id="test">
					<label for="username">Username:</label>
					<input type="text" name="username" id="username" class="js-username-input" required><br>
					<label for="password">Password:</label>
					<input type="password" name="password" id="password" class="js-password-input" required><br>
					<label for="email">Email:</label>
					<input type="text" name="email" id="email" class="js-email-input" required><br>
					<input type="submit" class="js-register-submit-button">
				</form>
	`
	$(".js-login-or-register").html(registerHtml);	

	$(".js-register-submit-button").on("click", function(event) {
		event.preventDefault();

		// <input> 'required' attribute doesn't work in some browsers when loaded asynchronously
		// So the form is validated here:
		let emailInput, usernameInput, passwordInput, registeringUser;
		emailInput = $('.js-email-input').val();
		// deactivated for now: passwordInput = $('.js-password-input').val();
		usernameInput = $('.js-username-input').val().toLowerCase();
			
		if (checkFormIsCompleted(usernameInput, passwordInput, emailInput)) {;
			
			newUserDetails = new User(usernameInput, emailInput);
			
			// Do something with this new user! Send to Db! 
			alert('Registration complete!')

			// remove login page
			$(".js-login-or-register").html('');
			// Load user's gift list!
			loadPersonalisedPage(usernameInput);
		} 
	});
}


// ------------------------------ FORM VALIDATION -----------------------------------
function checkFormIsCompleted(usernameInput, passwordInput, emailInput) {
	if (!validateUsername(usernameInput)) {
		alert('Please ensure you have given a valid username. \nYour username should be between 3 and 18 characters.');
		return false;
	} /* deactivated for now: else if (!passwordInput) {
		alert('Please ensure that you have filled in the password field correctly!');	
	}*/ 
	else if (!validateEmail(emailInput)) {
		alert('Please check that you have provided a valid email address.');
		return false;
	} 
	return true;
 }

function validateUsername(usernameInput) {
	return usernameInput.length >= 3 && usernameInput.length <= 18;
}

function validateEmail(emailInput) {
	let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
	return re.test(emailInput.toLowerCase());
}




// ---------------------------- LOAD GIFT LISTS ---------------------------------
// Kickstarts functions that rely on user json
function loadPersonalisedPage(username) {
	showGiftLists(username);
  showCalendar(username);
}

// Kickstarts chain of functions that show gift list.
function showGiftLists(username) {
	let userData = getUserData(username);
	let giftListsHtml = createGiftListsHtml(userData);
  $('.js-gift-lists').html(giftListsHtml);
	showBudget(userData);
}

// Mock GET request
function getUserData(username) {
	return MOCK_USER_DATA[username];
}

// Organises and displays html (relies on other functions for html sub-sections)
function createGiftListsHtml(data) {
	let giftListsArr = data.giftLists, giftListsHtml = `<h1>Gift List</h1>`;
	// Html sub-sections populated by other functions
	let upcomingEventsListHtml, addToCalendarHtml, giftIdeasHtml = ``;

	giftListsArr.forEach(giftListArrItem => {

		// Populate html subsection variables using other functions
		giftIdeasHtml += createGiftIdeasHtml(giftListArrItem.giftIdeas).join(', ');
		upcomingEventsListHtml = createUpcomingEventsListHtml(giftListArrItem);

		// Final Html returned to showGiftLists()
		giftListsHtml +=
			`<h2>${giftListArrItem.name}</h2>
			<h3>Gift Ideas So Far <a target="_blank" href="javascript:;"><span class="js-edit-gift-ideas edit">edit</span></a></h3> 
			${giftIdeasHtml}
			<h3>Upcoming Events <a target="_blank" href="javascript:;"><span class="js-edit-events edit">edit</span></a></h3>
			${upcomingEventsListHtml}`;
	});
	return giftListsHtml;
}

function createUpcomingEventsListHtml(giftListArrItem) {
	// *** Opening ul tag *** 
	//
	let upcomingEventsListHtml = `<ul>`, addToCalendarHtml, monthName;
	giftListArrItem.events.forEach(event => {
		let eventDate = new Date(event.eventDate);
		monthName = monthNames[eventDate.getMonth()];
		let eventDateText = `${eventDate.getDate()} ${monthName}, ${eventDate.getFullYear()}`;
		upcomingEventsListHtml += `<li>- ${event.eventName} on ${eventDateText}.`
		if (event.finalDecision !== "none") {
			upcomingEventsListHtml += 
				` Gift chosen: <a target="_blank" href="${event.finalDecision.giftLink}">${event.finalDecision.giftName}</a>`
		};
		upcomingEventsListHtml += `</li>`;
	addToCalendarHtml = prepareAddToCalendarHtml(event, giftListArrItem);
	});

	// *** Closing ul tag *** 
	upcomingEventsListHtml += `</ul>`;
	
	
	upcomingEventsListHtml += addToCalendarHtml;

	return upcomingEventsListHtml;
};


// prepares 
function prepareAddToCalendarHtml(event, giftListArrItem) {
	let encodedBodyText, giftIdeasHtml, encodedGiftIdeasHtml, addToCalendarHtml;
	let eventDate = new Date(event.eventDate);
	// To get the right format for Google Calendar URLs
  let	eventDatePlusOneDay = new Date(eventDate.getYear(),eventDate.getMonth(),eventDate.getDate()+1);
	eventDate = eventDate.toISOString().slice(0,10).replace(/-/g,"");
	eventDatePlusOneDay = eventDatePlusOneDay.toISOString().slice(0,10).replace(/-/g,"");
	let addToCalendarLink = 
		`https://www.google.com/calendar/render?action=TEMPLATE&
		sf=true&output=xml&
		text=${event.eventName}:+${giftListArrItem.name}&
		dates=${eventDate}/${eventDatePlusOneDay}&
		details=`
	if (event.finalDecision !== "none") { 
		// Will display shoppingsite link for chosen gift if provided by user... 
		encodedBodyText = encodeURIComponent(
			`You've decided to get this gift: ` + 
			`<a target="_blank" href="${event.finalDecision.giftLink}">` +
			`${event.finalDecision.giftName}</a>`
		);
		addToCalendarLink += encodedBodyText;
	} else { 
		// ... or will display shopping search links for gift ideas. 
		giftIdeasHtml = createGiftIdeasHtml(giftListArrItem.giftIdeas).join(', '); 
		encodedBodyText = encodeURIComponent(
			`You still need to decide on a gift!\n\nGift ideas so far: ${giftIdeasHtml}`
		);
		addToCalendarLink += encodedBodyText;
	}

	addToCalendarHtml = `<a target="_blank" href="${addToCalendarLink}">Add to your Google Calendar (opens new tab)</a>`;	
	return addToCalendarHtml;
}


// Creates text and link for user's gift ideas
function createGiftIdeasHtml(giftIdeas) {
	// console.log('createGiftIdeasHtml');
	let giftIdeasHtmlArr = [], giftIdeaHtml, shoppingUrl;
	giftIdeas.forEach(giftIdea => {
		shoppingUrl = `https://www.google.co.uk/search?tbm=shop&q=${giftIdea}`
		giftIdeaHtml = `<a target="_blank" href="${shoppingUrl}">${giftIdea}</a>`
		giftIdeasHtmlArr.push(giftIdeaHtml);
	});
	return giftIdeasHtmlArr;
}

// Needs refactor for conciseness
function showBudget(data) {
	let budgetHtml;
	if (data.budget < 1) {
		budgetHtml = `
		<h2>Your Budget</h2>
		<p>Click <span class="js-edit-budget edit-budget">here</span> to enter your budget!</p>`
	} else {
		let totalBudget = data.budget;
		let giftLists = data.giftLists;
		let eventsArr = [], spendSoFar = 0, spanWidth = 0, percentageSpend;
		giftLists.forEach(giftList => {
			for (let event in giftList.events) { 
				eventsArr.push(giftList.events[event]);
			}
		})
		eventsArr.forEach(event => {
			if (event.finalDecision !== "none") { 
				spendSoFar += Number(event.finalDecision.cost);
			}
		})
		
		spanWidth = spendSoFar/totalBudget*100;
		percentageSpend = Math.floor(spanWidth);
		// in case they are over budget
		if (spanWidth > 100) {
			spanWidth = 100;
		}
	
		budgetHtml = `
					<h2>Your Budget</h2>
					<p>So far, you've spent £${spendSoFar} of your budget of £${totalBudget} (${percentageSpend}%).</p>
					<div class="budget-meter">
	  				<span class="budget-span" style="width: ${spanWidth}%"></span>
					</div>`;
	}
	$('.js-budget').append(budgetHtml);

}

function showCalendar() {
	$('.calendar')
		.html(`
			<h2>Your Calendar</h2>
			<iframe class="calendar" src="https://calendar.google.com/calendar/embed?
			src=${userEmail}" style="border: 0" width="800" height="600" 
			frameborder="0" scrolling="no"></iframe>`);
}




// Starts chain of functions on pageload
checkUserLoggedIn();
// for testing loadPersonalisedPage("rob");

