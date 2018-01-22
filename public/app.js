'use strict';

const MOCK_USER_DATA = {
	"budget": "30",
	"giftLists": [{
		"name": "Sarah",
		"gender": "female",
		"events": [{
			"eventName": "Christmas",
			"eventDate": "25 Dec 2018",
			"finalDecision": "none",
			// default 30 days, but use can alternative
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
		// Could be presented as order of preference in UI:
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
};


// To make dates easy to read
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Will ask user for their email on login and use it as a variable?
let userEmail = `robertaxelkirby@gmail.com`;

function handleLogin() {
	let user = "Rob"
	// if (notLoggedIn) {
	if (true) { 
		loadLoginOrRegisterHtml();
		handleLoginOrRegister();
	} else {
		loadPersonalisedPage(user);
	}
}

function loadLoginOrRegisterHtml() {
	let loginOrRegisterHtml = `
	<h1>Gift App</h1>
				<form>
					<label for="username">Username:</label>
					<input type="text" id="username" name="username" class="js-username-input"><br>
					<label for="password">Password:</label>
					<input type="password" id="password" name="password" class="js-password-input"><br>
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
		let usernameInput = $('.js-username-input').val();
		// ??? Seem insecure!  For testing only until best practise found:
		let userPassword = $('.js-password-input').val();
	});

	$('.js-register-button').on('click', function(event) {
		event.preventDefault();
		loadRegisterHtml();
	});
}

// loads registration page
function loadRegisterHtml() {
	let registerHtml = `
	`
	$(".js-login-or-register").html(registerHtml);	
}

function loadPersonalisedPage(user) {
	showGiftLists(user);
  showCalendar();
}

// Kickstarts chain of functions that show gift list. Called on pageload.
function showGiftLists() {
	// console.log('showGiftLists');
	let userData = getUserData();
	let giftListsHtml = createGiftListsHtml(userData);
  $('.js-gift-lists').html(giftListsHtml);
	showBudget(userData);
}

// Mock GET request
function getUserData() {
	return MOCK_USER_DATA;
}

// Organises and displays html (relies on other functions for html sub-sections)
function createGiftListsHtml(data) {
	// console.log('createGiftListsHtml');
	let giftListsArr = data.giftLists, giftListsHtml = `<h1>Gift List</h1>`;
	// Html sub-sections populated by other functions
	let upcomingEventsListHtml, addToCalendarHtml, giftIdeasHtml;

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
	// console.log('createUpcomingEventsListHtml');
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

	let budgetHtml = `
				<h2>Your Budget</h2>
				<p>So far, you've spent £${spendSoFar} of your budget of £${totalBudget} (${percentageSpend}%).</p>
				<div class="budget-meter">
  				<span class="budget-span" style="width: ${spanWidth}%"></span>
				</div>`;

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
handleLogin();

// loadPersonalisedPage();

