'use strict';

let userData;

// Object constructor for new users;
function User(username, firstName, email) {
	this.userName = firstName;
	this.firstName = firstName;
	this.email = email;
	this.giftLists = [];
	this.budget = 0;
};


const MOCK_USER_DATA = { 
	// Final form: {"users": [rob, gemma]}?
	"rob": {	
		"username": 'rob',
		"firstName": "rob",
		"email": "robertaxelkirby@gmail.com",
		"budget": "20",
		"giftLists": [{
			"name": "Sarah",
			"gender": "female",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "1 Jan 2019",
				"GiftPicked": {
					"giftName": "Cocoa Powder",
					"giftLink": "",
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
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {	
				"eventName": "Birthday",
				"eventDate": "20 Feb 2018",
				"GiftPicked": {
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
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "10 Mar 2018",
				"GiftPicked": "none",
				"remindBefore": "30"
			}],
			"giftIdeas": ["Swimming hat", "Woollen Hat", "Bicycle Helmet", "Remote Control Car", "Bucket and Spade"]
		}]
	},
	"gemma": {	
		"username": 'gemma',
		"firstName": "gemma",
		"email": "gemmakirby16@gmail.com",
		"budget": "80",
		"giftLists": [{
			"name": "Mike",
			"gender": "Male",
			"events": [{
				"eventName": "Christmas",
				"eventDate": "25 Dec 2018",
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "1 Jan 2019",
				"GiftPicked": {
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
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "20 Feb 2018",
				"GiftPicked": {
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
				"GiftPicked": "none",
				"remindBefore": "30"
			}, {
				"eventName": "Birthday",
				"eventDate": "10 Mar 2018",
				"GiftPicked": "none",
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

function checkUserLoggedIn() {
	// ===== Aspiration: app remembers whether user is logged in. ===== 
	/* if (user is logged in) {
		loadPersonalisedPage(for user)
	} else {
	*/
	// for now, we assume user isn't logged in: 
	loadLoginOrRegisterHtml();
	handleLoginOrRegister();
}

// ------------------------------ LOGIN PAGE ------------------------------
function loadLoginOrRegisterHtml() {
	let loginOrRegisterHtml = `
	<h1>Gift App</h1>
				<form>
					<h2>Login</h2>
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
		// ===== ??? Seem insecure!  For testing only until best practise found: =====
		let passwordInput = $('.js-password-input').val();
		attemptLogin(usernameInput, passwordInput);
	});

	$('.js-register-button').on('click', function(event) {
		event.preventDefault();
		loadRegisterHtml();
		handleRegistrationSubmission();
	});
}

// When user submits username/password
function attemptLogin(usernameInput, passwordInput) {
	// ===== Aspiration: talk to server to validate login fields username/password... =====
	// For now:
	if (usernameInput) {
		// remove login page
		$(".js-login-or-register").html('');
		// load user's giftlist!
		loadPersonalisedPage(usernameInput)
	} 
}

// -------------------------- REGISTRATION PAGE --------------------------------
function loadRegisterHtml() {
	let newUserDetails, setupHtml, registerHtml = `
						<h2>Register</h2>
				<form id="test">
					<label for="username">Username:</label>
					<input type="text" name="username" id="username" class="js-username-input" required><br>
					<label for="firstName">First Name:</label>
					<input type="text" id="first-name" name="first name" class="js-first-name-input" required><br>
					<label for="password">Password:</label>
					<input type="password" name="password" id="password" class="js-password-input" required><br>
					<label for="email">Email:</label>
					<input type="text" name="email" id="email" class="js-email-input" required><br>
					<input type="submit" class="js-register-submit-button">
				</form>
	`
	$(".js-login-or-register").html(registerHtml);	
}

// Runs validation using other functions (see below), submits registration 
// and then calls loadPersonalisedPage()
function handleRegistrationSubmission() {
	$(".js-register-submit-button").on("click", function(event) {
		event.preventDefault();

		// <input> 'required' attribute doesn't work in some browsers when loaded asynchronously
		// So we check these fields are completed:
		let emailInput, usernameInput, firstNameInput, passwordInput, registeringUser;
		emailInput = $('.js-email-input').val();
		// ===== deactivated for now: passwordInput = $('.js-password-input').val(); =====
		usernameInput = $('.js-username-input').val().toLowerCase();
		firstNameInput = $('.js-first-name-input').val().toLowerCase();
			
		if (checkFormIsCompleted(usernameInput, firstNameInput, /*passwordInput,*/ emailInput)) {;
			
			newUserDetails = new User(usernameInput, firstNameInput, emailInput);
			
			// ===== Aspiration: create new user in Db! ===== 
			alert('Registration complete!')

			// remove login page
			$(".js-login-or-register").html('');
			// Load user's gift list!
			loadPersonalisedPage(usernameInput);
		} 
	});

}


// ------------------------------ FORM VALIDATION -----------------------------------
function checkFormIsCompleted(usernameInput, firstNameInput, /*, passwordInput*/ emailInput) {
	
	if (!validateName(usernameInput)) {
		alert('Please ensure you have given a valid username. \nYour username should be between 3 and 18 characters and must not contain whitespace (" ").');
		return false;
	} else if (!validateName(firstNameInput)) {
		alert('Please ensure you have given a valid first name. \nThe name provided should be between 3 and 18 characters and must not contain whitespace (" ").');
		return false;
	}
	 /* =====  deactivated for now: else if (!passwordInput) {
		alert('Please ensure that you have filled in the password field correctly!');	
	}*/ 
	else if (!validateEmail(emailInput)) {
		alert('Please check that you have provided a valid email address.');
		return false;
	} 
	return true;
 }

function validateName(name) {
	return name.length >= 2 && name.length <= 18 && name.indexOf(' ') <= 0;
}

function validateEmail(emailInput) {
	let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
	return re.test(emailInput.toLowerCase());
}

// Called when user submits an online shopping site to accompany a gift choice.
function validateUrl(input) {
	let re = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	return re.test(input);
}

// Kickstarts functions that rely on user json
function loadPersonalisedPage(username) {
	showPersonalisedHeader(username);
	showGiftLists(username);
  showCalendar(username);
  handleOpenEditPanelClicks();
  listenForEscapeOnEditPanel();
}

function showPersonalisedHeader(username) {
	let titleName = username.charAt(0).toUpperCase() + username.slice(1, username.length);
	$('.js-personalised-header').html(`<h1>${titleName}'s Gift Organiser</h1>`)
}

// ---------------------------- LOAD GIFT LISTS ---------------------------------
/*
Each gift list is associated with a recipient and takes the following form:
[Name of recipient]
[Gift Ideas So Far](editable)
	[For each gift idea: a link to google shopping search for that gift]
[Upcoming events (editable), listing gifts chosen for those specific events (also editable)]
	[For gift chosen for an event: 
		either: a link to a specific online shopping page (provided user provides one)
		or: a link to a google shopping search for that gift]
	[For Each event - a link to add to user's google calendar]
*/ 

// Kickstarts the chain of functions that render user's gift lists.
function showGiftLists(username) {
	userData = getUserData(username);
	let giftListsHtml = createGiftListsHtml();
  $('.js-gift-lists').html(giftListsHtml);
	showBudget();
}

// GET request 
// ===== Currently to mock data.  Will hook up to MongoDb later =====
function getUserData(username) {
	return MOCK_USER_DATA[username];
}

// Organises and displays html (relies on other functions for html sub-sections)
function createGiftListsHtml() {
	let giftListsArr = userData.giftLists, giftListsHtml = `<h1>Gift List</h1>`, giftIdeasHtmlArr;
	// Html sub-sections populated by other functions
	let upcomingEventsListHtml, addToCalendarHtml, giftIdeasHtml = ``;

		giftListsArr.forEach(giftListArrItem => {

		// Creates Html for gift ideas: create a gift idea list for each gift list in user's profile
		giftIdeasHtmlArr = [];
		// Populate html subsection variables using other functions
		((giftListArrItem.giftIdeas)).forEach(giftIdea => {
			giftIdeasHtmlArr.push(createGiftIdeasHtml(giftIdea));
		});
		giftIdeasHtml = giftIdeasHtmlArr.join(', ');
		
		// Creates Html for the events list:
		upcomingEventsListHtml = createUpcomingEventsListHtml(giftListArrItem);

		// Final Html returned to showGiftLists()
		giftListsHtml +=
			`
			<div class="js-recipient-list">
			<h2>${giftListArrItem.name}</h2>
			<h3>Gift Ideas So Far <a target="_blank" href="javascript:;"><span class="js-edit-gift-ideas js-edit edit">edit</span></a></h3> 
			${giftIdeasHtml}
			<h3>Upcoming Events <a target="_blank" href="javascript:;"><span class="js-edit-events js-edit edit">edit</span></a></h3>
			${upcomingEventsListHtml}
			</div>`;
	});
	return giftListsHtml;
}

// Prepares events html for each gift list in user's profile
function createUpcomingEventsListHtml(giftListArrItem) {
	// *** Opening ul tag *** 
	let upcomingEventsListHtml = `<ul>`, addToCalendarHtml, monthName, shoppingUrl, giftPickedHtml;
	giftListArrItem.events.forEach(event => {
		
		// Renders human readable dates
		let eventDate = new Date(event.eventDate);
		monthName = monthNames[eventDate.getMonth()];
		let eventDateText = `${eventDate.getDate()} ${monthName}, ${eventDate.getFullYear()}`;
		
		// The class 'js-event-name' allows us to to look up giftLists.recipient.events[this event]
		// when the user clicks to choose a gift for the event.
		upcomingEventsListHtml += `<li>- <span class="js-event-name">${event.eventName}</span> on <span class="js-event-date">${eventDateText}</span>.`
		if (event.GiftPicked !== "none") {
			upcomingEventsListHtml += 
				` Gift(s) chosen: <a target="_blank" href="${event.GiftPicked.giftLink}">${event.GiftPicked.giftName}</a>
				<a target="_blank" class="js-edit js-edit-gift-picked edit" href="javascript:;">edit</a>`
		} else {
			upcomingEventsListHtml += 
				`<br><span>(Psst! Chosen them a gift yet? Click <a target="_blank" class="js-edit js-edit-gift-picked" href="javascript:;">here</a> to save your decision.)</span>`;
		}
		upcomingEventsListHtml += `</li>`;
	addToCalendarHtml = prepareAddToCalendarHtml(event, giftListArrItem);
	});

	// *** Closing ul tag *** 
	upcomingEventsListHtml += `</ul>`;
	upcomingEventsListHtml += addToCalendarHtml;
	return upcomingEventsListHtml;
};


// prepares link for adding event (and gift chosen) to calendar
function prepareAddToCalendarHtml(event, giftListArrItem) {
	let encodedBodyText, giftIdeasHtml, giftIdeasHtmlArr = [], encodedGiftIdeasHtml;
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
	
	if (event.GiftPicked !== "none") { 
		// Will either display link for chosen gift(s)... 
		encodedBodyText = encodeURIComponent(
			`You've decided to get this gift: ` + 
			`<a target="_blank" href="${event.GiftPicked.giftLink}">` +
			`${event.GiftPicked.giftName}</a>`
		);
		addToCalendarLink += encodedBodyText;
	} else { 
		// ... or will display links to google shopping searches for gift ideas. 
		((giftListArrItem.giftIdeas)).forEach(giftIdea => {
			giftIdeasHtmlArr.push(createGiftIdeasHtml(giftIdea));
		});
		giftIdeasHtml = giftIdeasHtmlArr.join(', ');
		encodedBodyText = encodeURIComponent(
			`You still need to decide on a gift!\n\nGift ideas so far: ${giftIdeasHtml}`
		);
		addToCalendarLink += encodedBodyText;
	}

	return `<a target="_blank" href="${addToCalendarLink}">Add to your Google Calendar (opens new tab)</a>`;	
	;
}


// Creates text and link for user's gift ideas
function createGiftIdeasHtml(giftIdea) {
	let giftIdeasHtmlArr = [], shoppingUrl;
	shoppingUrl = createGoogleShoppimgUrl(giftIdea);
	return `<a target="_blank" href="${shoppingUrl}">${giftIdea}</a>`
}

function createGoogleShoppimgUrl(gift) {
	return `https://www.google.co.uk/search?tbm=shop&q=${gift}`
}

// Needs refactor for conciseness
function showBudget() {
	let budgetHtml;
	if (userData.budget < 1) {
		budgetHtml = `
		<h2>Your Budget</h2>
		<p>Click <span class="js-edit-budget js-edit edit-budget">here</span> to enter your budget!</p>`
	} else {
		let totalBudget = userData.budget;
		let giftLists = userData.giftLists;
		let eventsArr = [], spendSoFar = 0, spanWidth = 0, percentageSpend;
		giftLists.forEach(giftList => {
			for (let event in giftList.events) { 
				eventsArr.push(giftList.events[event]);
			}
		})
		eventsArr.forEach(event => {
			if (event.GiftPicked !== "none") { 
				spendSoFar += Number(event.GiftPicked.cost);
			}
		})
		
		percentageSpend = Math.floor(spendSoFar/totalBudget*100);
		spanWidth = 100 - percentageSpend;
		// in case they are over budget
		if (spanWidth > 100) {
			spanWidth = 100;
		}
	
		budgetHtml = `
					<h2>Your Budget</h2>
					<p>So far, you've spent £${spendSoFar} (${percentageSpend}%) of your £${totalBudget} budget.
					<a target="_blank" href="javascript:;"><span class="js-edit-budget js-edit edit">edit</span></a></p>
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
			src=${userData.email}" style="border: 0" width="800" height="600" 
			frameborder="0" scrolling="no"></iframe>`);
}


// --------------------- EDIT CLICKS & ASSOCIATED HTML ------------------------------
// The edit panel is hidden & blank until user clicks an edit option.  
function handleOpenEditPanelClicks() {
	let editHtml = '', userGiftIdea, userGiftIdeaHtml, recipientName, userEventName, userEventDate, userEventHtml, giftForGiving;

	// Get the appropriate edit panel html...
	$('.js-edit').on('click', function(event) {
		hideAndWipeEditPanel();
		recipientName = $(event.target).closest(".js-recipient-list").find("h2").text();
		
		// edit panel for changing budget
		if ($(event.target).hasClass('js-edit-budget')) {
			editHtml = generateEditBudgetHtml();
		// edit panel for changing gift ideas
		} else if ($(event.target).hasClass('js-edit-gift-ideas')) {
			editHtml = generateEditGiftIdeasHtml(recipientName);
		// edit panel for changing upcoming events
		} else if ($(event.target).hasClass('js-edit-events')) {
			editHtml = generateEditEventsHtml(recipientName);
		// edit panel for changing gifts picked for a particular event
		} else if ($(event.target).hasClass('js-edit-gift-picked')) {
			// Gets the event name from the dom - used to look up event object in json
			userEventName = $(event.target).parent().parent().find('.js-event-name').html();
			userEventDate = $(event.target).parent().parent().find('.js-event-date').html()
			
			editHtml = generateEditGiftPickedHtml(recipientName, userEventName, userEventDate);

		}
		// ... and populate the edit panel with it, and show the panel.
		$('.js-edit-panel').show()
		$('.js-edit-panel-inner').append(editHtml);
		listenForClickToGiftIdeaToEvent();
		handleClicksWithinEditPanel();
	})
}

// Handles clicks in edit panel (add, save, cancel etc)	
function handleClicksWithinEditPanel() {
			
	$(".js-edit-panel").on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();

		// For when user clicks 'Save Changes' input button
		if ($(event.target).hasClass('js-submit-edit')) {
			// for when user submits url for a gift they have picked for an event
			if ($(event.target).hasClass('js-check-url')) {	
					// Validation
				if (!validateUrl($(event.target).parent().find('.js-user-gift-picked-url').val())) {				
					alert('Please copy-paste a valid url');
				} else {
				// ===== save the data somehow here! =====
				// add this to database if they haven't provided a url to a shopping page;  createGoogleShoppimgUrl(their gift decision);
				console.log("sending imaginary put request for user's gift decision!");

				hideAndWipeEditPanel();
				}
			}
		// For when user clicks 'Discard Changes' button		
		} else if ($(event.target).hasClass('js-cancel-edit')) {
				hideAndWipeEditPanel();
		// For when user clicks 'Add' button to add a gift idea
		}	else if ($(event.target).hasClass('js-add-to-gift-idea-list')) {
			// Validation
			if ($('.js-user-gift-idea').val()) {
				userGiftIdea = $('.js-user-gift-idea').val(); 
				userGiftIdeaHtml = `<li>${userGiftIdea}  <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
				$('.gift-idea-list').append(userGiftIdeaHtml);
			} else {
				alert('Please enter a gift idea!')
			}
		// For when user clicks to 'Add' button to add changes to event list
		} else if ($(event.target).hasClass('js-add-to-event-list')) {
			// Validation
			if ($('.js-user-event-name').val()  && checkEventDateIsInFuture()) {
				userEventName = $('.js-user-event-name').val();
				userEventDate =  $('.js-user-event-date').val();
				userEventHtml = `<li>${userEventName} on ${userEventDate} <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
				$('.event-list').append(userEventHtml);
			} else {
				alert('Please enter an event name and future date!');
			}
		// For when user click 'Remove' on an existing gift idea or upcoming event
		} else if ($(event.target).hasClass('js-remove')) {
			$(event.target).closest("li").remove();
		};
	})
};

function hideAndWipeEditPanel() {
	$('.js-edit-panel').hide();
	$('.js-edit-panel-inner').html('');
}

function checkEventDateIsInFuture() {
	let userDate = new Date($('.js-user-event-date').val());
	let now = new Date;
	return userDate > now;
}

function generateEditBudgetHtml() {
	return `<form>
					<label for="budget">Enter your budget:</label>
					<input type="number" min="0" name="budget" id="budget" placeholder="${userData.budget}">
					<input type="submit" class="firstNameInput" name="submit" value="Save changes">
					<button class="js-cancel-edit">Discard Changes</button>
				</form>`;
};

function generateEditGiftIdeasHtml(recipientName) {
// creates editable list of gift ideas so far for the recipient 
	let lis = '', ul = '', recipient;
	recipient = userData.giftLists.find(item => item.name == recipientName);
	recipient.giftIdeas.forEach(giftIdea => {
		lis += `<li>${giftIdea} <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
	})
	ul = `<ul class="gift-idea-list">
						${lis}
					</ul>`
	return `<form>
					<label for="gift-idea">Add a gift idea:</label>
					<input type="text" name="gift-idea" id="gift-idea" class="js-user-gift-idea" required>
					<button class="js-add-to-gift-idea-list">Add</button>
					<input type="submit" class="js-submit-edit" value="Save Changes" name="submit">
					<button class="js-cancel-edit">Discard Changes</button>
					<br><br>
					<p>Gift ideas for ${recipient.name} so far:</p> 
					${ul}
				</form>
`;
};

function generateEditEventsHtml(recipientName) {
	let lis = '', ul = '', recipient;
	recipient = userData.giftLists.find(item => item.name == recipientName);
	recipient.events.forEach(event => {
		lis += `<li>${event.eventName} on ${event.eventDate} <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
	})

	ul = `<ul class="event-list">
						${lis}
					</ul>`
	return `<form>
					<label for="event">Add an event:</label>
					<input type="text" name="event-name" id="event-name" class="js-user-event-name" required>
					<label for="event">Date:</label>
					<input type="date" name="event-date" id="event-date" class="js-user-event-date" required>
					<button class="js-add-to-event-list">Add</button>
					<input type="submit" class="js-submit-edit" value="Save Changes" name="submit">
					<button class="js-cancel-edit">Discard Changes</button>
					<br><br> 
					<span>Upcoming events for ${recipient.name}:</span>
					${ul}
				</form>
	`;
};

// ============ Recipient should be declared early and passed down ============
function generateEditGiftPickedHtml(recipientName, userEventName, userEventDate) {
	// Pick up from here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// recipientName argument probably won't cut it - need recipientName.events.eventName
	// Will need gift name (and option to pick from ideas?),
	// shopping link, manually enter cost.
	// Consider multiple gifts: will need a UL to which users can add/remove, 
	// like with gift ideas. 

	let lis = '', ul = '', recipient;
	recipient = userData.giftLists.find(item => item.name == recipientName);
	recipient.giftIdeas.forEach(giftIdea => {
		lis += `<li><span class="js-gift-idea">${giftIdea}</span> <a target="_blank" href="javascript:;" class="js-give give">Give this gift</a></li>`
	})
	ul = `<ul class="gift-idea-list">
						${lis}
					</ul>`
	return `					<form>
						<h3>${recipientName}: ${userEventName} on ${userEventDate}</h3>
						<label for="gift-picked">The name of a gift you are choosing for this event:</label>
						<input type="text" name="gift-picked" id="gift-picked" class="js-user-gift-picked" value="" required>
						<br>
						<label for="gift-picked-url">Paste the link to the online shopping page for this gift</label>
						<input type="text" name="gift-picked-url" id="gift-picked-url" class="js-user-gift-picked-url" required>
						<input type="submit" class="js-submit-edit js-check-url" value="Save changes" name="submit">
						<button class="js-cancel-edit">Discard Changes</button>
						<br>
						<p>... Or choose a gift from your ideas for ${recipient.name} so far:</p> 
						${ul}
					</form>`;
};

// For adding gift ideas to 'gifts picked for event'. 
// Gets the gift name and puts it in the gift name input box.
function listenForClickToGiftIdeaToEvent() {
	let giftForGiving;
	$('.js-give').on('click', function(event) {
		giftForGiving = $(event.target).siblings(".js-gift-idea").text();
		$(event.target).closest('div').find('.js-added-message').remove();;
		$(event.target).after('<span class="js-added-message"> Added - scroll up!</span>');
		$(event.target).closest('div').find('.js-user-gift-picked').attr('value', giftForGiving);
	})
}


// allows user to close edit panel (and discard changes) by hitting esc key
function listenForEscapeOnEditPanel() {
	$('body').keyup(function(event){
		if (event.which == 27) {
			hideAndWipeEditPanel()
		}
	});
}

// Starts chain of functions on pageload
// checkUserLoggedIn();

loadPersonalisedPage("rob");