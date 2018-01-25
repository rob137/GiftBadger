'use strict';

let globalUserData;
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
		// ===== ??? Seem insecure!  For testing only until best practice found =====
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
	// ===== Aspiration: talk to server to validate login with username/password =====
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
			
		if (checkFormIsCompleted(usernameInput, firstNameInput, /*passwordInput,*/ emailInput)) {
			// ===== Aspiration: create new user in Db! ===== 
			$.ajax({
				url: "/users",
				contentType: 'application/json',
				data: JSON.stringify({
					username: usernameInput,
					firstName: firstNameInput,
					email: emailInput
				}),
				success: function(data) {
					alert('Registration complete!');
				},
				error: function (){
					console.log('Error')
				},
				type: 'POST'
			});

			// remove login page
			$(".js-login-or-register").html('');
			// Load user's gift list!
			loadPersonalisedPage(usernameInput);
		} 
	});

}


// --------------------- REGISTRATION FORM VALIDATION ----------------------------
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

// -------------------------- LOAD PERSONALISED CONTENT ---------------------------
// Kickstarts functions that rely on user json
function loadPersonalisedPage(usernameInput) {
	let firstName;
	$.getJSON(`/users/${usernameInput}`, function(userJson) {
		globalUserData = userJson;
		firstName = globalUserData.firstName;
		setTimeout(function() {
			showPersonalisedHeader(firstName);
			showGiftLists(firstName);
  		showCalendar(firstName);
  		handleOpenEditPanelClicks();
  		listenForEscapeOnEditPanel();
  	}, 1000);
	});
}

function showPersonalisedHeader(firstName) {
	let titleName = firstName.charAt(0).toUpperCase() + firstName.slice(1, firstName.length);
	$('.js-personalised-header').html(`<h1>${titleName}'s Gift Organiser</h1>`)
}

// ---------------------------- LOAD GIFT LISTS ---------------------------------
/*
Each gift list is associated with a recipient and takes the following form:
[Name of recipient]
[Gift Ideas So Far](editable)
	- For each gift idea: a link to google shopping search for that gift
[Upcoming events] (editable), listing gifts chosen for those specific events (also editable)
	- For each event:
		- A link to add to user's google calendar]
		- For gift(s) chosen for the event: 
			- either: a link to a specific online shopping page (if user has provided one)
			- or: a link to a google shopping search for that gift
	*/ 

// Kickstarts the chain of functions that render user's gift lists.
function showGiftLists(firstName) {
	let giftListsHtml = createGiftListsHtml();
  $('.js-gift-lists').html(giftListsHtml);
	showBudget();
}

// Organises and displays html (relies on other functions for html sub-sections)
function createGiftListsHtml() {
	let giftListsArr = globalUserData.giftLists, giftListsHtml = `<h1>Gift List</h1>`, giftIdeasHtmlArr;
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
	giftListsHtml += `
			<p>Click <a  class="js-create-new-gift-list js-edit edit-alt" target="_blank" href="javascript:;">here</a> to add a new person to the list!</p>`
	
	return giftListsHtml;
}

// Prepares events html for each gift list in user's profile
function createUpcomingEventsListHtml(giftListArrItem) {
	// *** Opening ul tag *** 
	let upcomingEventsListHtml = `<ul>`, addToCalendarHtml, monthName, shoppingUrl, giftPickedHtml, eventDateText, eventDate;
	giftListArrItem.events.forEach(event => {
		// Renders human readable dates
		eventDate = new Date(event.eventDate);
		monthName = monthNames[eventDate.getMonth()];
		eventDateText = `${eventDate.getDate()} ${monthName}, ${eventDate.getFullYear()}`;
		// Dynamic html class/id to help lookup from edit forms
		let dynamicHtmlIdentifier = (`${event.eventName} ${eventDateText}`).toLowerCase()
			.replace(',', '').replace(/ /g, '-');
		// The class 'js-event-name' allows us to to look up giftLists.recipient.events[this event]
		// when the user clicks to choose a gift for the event.
		upcomingEventsListHtml += `<li class="js-${dynamicHtmlIdentifier}"> <span class="js-event-name">${event.eventName}</span> on <span class="js-event-date">${eventDateText}</span>.`
		if (event.giftsPicked.length > 0) {
			upcomingEventsListHtml += 
				` Gift(s) chosen: <span id="js-${dynamicHtmlIdentifier}">${generateGiftsPickedHtml(event, 'js-gifts-picked-list')}</span>
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

function generateGiftsPickedHtml(event, elementClass) {
	let giftsPickedHtml = `<span class="${elementClass}">`;
	(event.giftsPicked).forEach(giftPicked => {
		giftsPickedHtml += 
		`<a target="_blank" class="js-gift-picked" href="${giftPicked.giftLink}">${giftPicked.giftName}</a>, `
	});
	giftsPickedHtml += `</span>`
	return giftsPickedHtml
}


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
	
	if (event.giftsPicked.length > 0) { 
		// Will either display link for chosen gift(s)... 
		encodedBodyText = encodeURIComponent(
			`You've decided to get this gift: ` + 
			`<a target="_blank" href="${event.giftsPicked.giftLink}">` +
			`${event.giftsPicked.giftName}</a>`
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
	let budgetHtml, totalBudget, giftLists, eventsArr, spendSoFar, spanWidth, percentageSpend;
	// default budget is 0, so this checks user has provided a budget
	if (!globalUserData.budget || !(globalUserData.budget > 0)) {
		budgetHtml = `
		<h2>Your Remaining Budget</h2>
		<p>Click <a class="js-edit-budget js-edit edit-alt" target="_blank" href="javascript:;">here</a> to enter your budget!</p>`
	} else {
		totalBudget = globalUserData.budget;
		giftLists = globalUserData.giftLists;
		eventsArr = [], spendSoFar = 0, spanWidth = 0, percentageSpend;
		giftLists.forEach(giftList => {
			for (let event in giftList.events) { 
				eventsArr.push(giftList.events[event]);
			}
		})
		eventsArr.forEach(event => {
			if (event.giftsPicked.length > 0) { 
				(event.giftsPicked).forEach(giftPicked => {
					spendSoFar += Number(giftPicked.cost);
				})
			}
		})
		
		percentageSpend = Math.floor(spendSoFar/totalBudget*100);
		spanWidth = 100 - percentageSpend;
		// in case they are over budget
		if (spanWidth > 100) {
			spanWidth = 100;
		}
	
		budgetHtml = `
					<h2>Your Remaining Budget</h2>
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
			src=${globalUserData.email}" style="border: 0" width="800" height="600" 
			frameborder="0" scrolling="no"></iframe>`);
}


// ------------------ OPEN EDIT PANEL & ASSOCIATED HTML ------------------------------
// The edit panel is hidden & blank until user clicks an edit option.  
function handleOpenEditPanelClicks() {
	let editHtml = '', userGiftIdea, userGiftIdeaHtml, recipientName, 
	userEventName, userEventDate, userEventHtml, giftForGiving;

	// Get the appropriate edit panel html...
	$('.js-edit').on('click', function(event) {
		hideAndWipeEditPanel();
		recipientName = $(event.target).closest(".js-recipient-list").find("h2").text();
		
		// edit panel for changing budget
		if ($(event.target).hasClass('js-edit-budget')) {
			editHtml = generateEditBudgetHtml();
		// edit panel for adding a new gift list
		} else if ($(event.target).hasClass('js-create-new-gift-list')) { 
			editHtml = generateEditNewGiftListHtml();
		// edit panel for changing gift ideas
		} else if ($(event.target).hasClass('js-edit-gift-ideas')) {
			editHtml = generateEditGiftIdeasHtml(recipientName);
		// edit panel for changing upcoming events
		} else if ($(event.target).hasClass('js-edit-events')) {
			editHtml = generateEditEventsHtml(recipientName);
		// edit panel for changing gifts picked for a particular event
		} else if ($(event.target).hasClass('js-edit-gift-picked')) {
			// Gets the event name from the dom - used to look up event object in json
			userEventName = $(event.target).parent().find('.js-event-name').html();
			userEventDate = $(event.target).parent().find('.js-event-date').html();
			editHtml = generateEditGiftPickedHtml(recipientName, userEventName, userEventDate);
		}
		// ... and populate the edit panel with it, and show the panel.
		$('.js-edit-panel').show();
		$('.js-edit-panel-inner').append(editHtml);
		let newHtml = getGiftsAlreadyPicked()
			.replace(/<a target="_blank" c/g, '<li><a target="_blank" c')
			.replace(/<\/a>,/g, '</a> <a target="_blank" href="javascript:;" class="js-remove remove">remove</a><br></li>')
			.replace(/class="js-gift-picked"/g, 'class="js-gift-picked-edit-list-items"');
		$('.js-edit-panel-gifts-picked-list').html(newHtml);
		listenForClickToGiftIdeaToEvent();
		handleClicksWithinEditPanel();
	})
}


// ---------------- EDIT PANEL CLICK HANDLERS ----------------------
// Handles clicks in edit panel (add, save, cancel etc)	
function handleClicksWithinEditPanel() {
	let usersNewGiftIdea, usersNewGiftIdeaHtml, usersNewGiftName, usersNewGiftPrice, 
	usersNewGiftPickedHtml, usersNewGiftUrl;
	$(".js-edit-panel").on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();
	// for events - when user submits shopping url of gift for a specific event
		if ($(event.target).hasClass('js-add-to-gift-picked-list')) {
			// Validation
			usersNewGiftName = $('.js-user-gift-picked').val(); 
			usersNewGiftUrl = $('.js-user-gift-picked-url').val();
			usersNewGiftPrice = $('.js-user-gift-picked-price').val();
			console.log(usersNewGiftName, usersNewGiftUrl, usersNewGiftPrice);
			if (usersNewGiftName && usersNewGiftPrice && usersNewGiftUrl && validateUrl(usersNewGiftUrl)) {
				usersNewGiftPickedHtml = `<a href="${usersNewGiftUrl}"><span class="js-gift-picked-input">${usersNewGiftName}</span></a> (£${usersNewGiftPrice}) <a target="_blank" href="javascript:;" class="js-remove remove">remove</a>`
				$('.js-edit-panel-gifts-picked-list').append(usersNewGiftPickedHtml);
				$('.js-user-gift-picked').val('');
				$('.js-user-gift-url').val('');
				$('.js-user-gift-price').val('');
			} else {
				alert('Please enter a gift, its price and copy/paste a valid url!')
			}
		} else if ($(event.target).hasClass('js-check-url')) {	
				// Validation
			if (!validateUrl($(event.target).parent().find('.js-user-gift-picked-url').val())) {				
				alert('Please copy-paste a valid url');
				return;
			}
		} else if ($(event.target).hasClass('js-submit-edit')) {
			handleEditSubmit(event.target);
		} else if ($(event.target).hasClass('js-cancel-edit')) {
				hideAndWipeEditPanel();
		// For when user clicks 'Add' button to add a gift idea
		}	else if ($(event.target).hasClass('js-add-to-gift-idea-list')) {
			// Validation
			console.log(1);
			if ($('.js-user-gift-idea').val()) {
				usersNewGiftIdea = $('.js-user-gift-idea').val(); 
				usersNewGiftIdeaHtml = `<li><span class="js-gift-idea-input">${usersNewGiftIdea}</span>  <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
				$('.gift-idea-list').append(usersNewGiftIdeaHtml);
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
		}	else if ($(event.target).hasClass('js-remove')) {
			$(event.target).closest("li").remove();
		};
	});
};

function handleEditSubmit(target) {
	let newBudget, newGiftList, newGiftIdeaListArr = [], newEventListArr = [], 
	newEventListObjArr = [], eventDateArr = [], eventDateObjArr = [], giftsPicked,
	newGiftName, newGiftUrl, newGiftsPickedArr = [];
	
		// for saving changes to budget
	if ($(target).hasClass('js-submit-edit-budget')) {
		newBudget = $('.js-budget-input').val();
		// ===== Need to submit newBudget in put request ======
		
		// for saving delete/add giftlists 
		// (i.e. adding/removing a recipient name)
	} else if ($(target).hasClass('js-submit-edit-giftlist')) {
		newGiftList = $('.js-giftlist-input').val();
		// ===== Need to submit newGiftList in put request ======

		// for saving changes to gift ideas within a giftlist
	} else if ($(target).hasClass('js-submit-edit-gift-idea-list')) {
		$('.js-gift-idea-input').each( (index, value) => {
			newGiftIdeaListArr.push($(value).text())
		});
		
		// for saving changes to the events list
	} else if ($(target).hasClass('js-submit-edit-event-list')) {
		$('.js-event-list-input').each( (index, value) => {
			newEventListArr.push($(value).text())
		});
		function Event(eventArr) {
			this.eventName = eventArr[0];
			this.eventDate = eventArr[1];
		}
		newEventListArr.forEach(newEvent => {
			let eventDateArr = newEvent.split(' on ');
			let eventDateObjArr = new Event(eventDateArr);
			newEventListObjArr.push(eventDateObjArr)
		});
		// ===== Need to submit newGiftList as part of giftlist in Put request ======

		
		// for saving changes to the 'picked items' list 
	} else if ($(target).hasClass('js-submit-edit-gift-picked')) {
		$('.js-gift-picked-edit-list-items').each( (index, value) => {
			newGiftIdeaListArr.push($(value).text())
		});
		
		//  WANT TO SUBMIT an object to the db: {}
		/*
			"giftsPicked": [{
					"giftName": "Cocoa Powder",
					"giftLink": "",
					"cost": "7.55"
				},
				etc
			] 
		

		function GiftPicked(giftName, giftLink, cost) {
			this.giftName = ;
			this.giftLink = ;
			this.cost = ;
		} 
		
		$('.js-gift-idea-input').each( (index, value) => {
			newGiftIdeaListArr.push($(value).text())
		});


		giftPicked = new GiftPicked(giftName, giftLink, cost);
		giftsPicked.push(giftPicked)

*/
		
	} else {
		console.error('Submission type error!');
	}
	hideAndWipeEditPanel();
}

// For edit panel:  takes the heading of the edit panel for 'gifts picked' and
// returns links/text of other gifts already picked
function getGiftsAlreadyPicked() {
	let giftsPickedLocator = $('.js-event-header').text().toLowerCase()
		.replace(',', '').replace('on ', '').replace(/ /g, '-')
		.replace('js-gifts-picked-list', 'js-edit-panel-gifts-picked-list');
	// Recreates the dynamically generated identifier used for event html - eg 'js-birthday-1-january-2019' 
	giftsPickedLocator = `#js-${giftsPickedLocator}`;
	return $(giftsPickedLocator).html();
}

function hideAndWipeEditPanel() {
	$('.js-edit-panel').off()
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
					<input type="number" min="0" value="${globalUserData.budget}" name="budget" id="budget" class="js-budget-input" placeholder="${globalUserData.budget}">
					<input type="submit" class="js-submit-edit js-submit-edit-budget" name="submit" value="Save Changes and Close">
					<button class="js-cancel-edit">Discard Changes</button>
				</form>`;
};

function generateEditNewGiftListHtml() {
	return `<form>
					<label for="name">Enter the name of someone you will need to buy a gift for:</label>
					<input type="text" name="name" id="name" class="js-giftlist-input">
					<input type="submit" class="js-submit-edit js-submit-edit-giftlist" name="submit" value="Save Changes and Close">
					<button class="js-cancel-edit">Discard Changes</button>
				</form>`
}
// creates editable list of gift ideas so far for the recipient
function generateEditGiftIdeasHtml(recipientName) {
 
	let lis = '', ul = '', recipient;
	recipient = globalUserData.giftLists.find(item => item.name == recipientName);
	recipient.giftIdeas.forEach(giftIdea => {
		lis += `<li><span class="js-gift-idea-input">${giftIdea}</span> <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
	})
	ul = `<ul class="gift-idea-list">
						${lis}
					</ul>`
	return `<form>
					<label for="gift-idea">Add a gift idea:</label>
					<input type="text" name="gift-idea" id="gift-idea" class="js-user-gift-idea" required>
					<button class="js-add-to-gift-idea-list">Add</button>
					<input type="submit" class="js-submit-edit js-submit-edit-gift-idea-list" value="Save Changes and Close" name="submit">
					<button class="js-cancel-edit">Discard Changes</button>
					<br><br>
					<p>Gift ideas for ${recipient.name} so far:</p> 
					${ul}
				</form>
`;
};

function generateEditEventsHtml(recipientName) {
	let lis = '', ul = '', recipient;
	recipient = globalUserData.giftLists.find(item => item.name == recipientName);
	recipient.events.forEach(event => {
		lis += `<li><span class="js-event-list-input">${event.eventName} on ${event.eventDate}</span> <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
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
					<input type="submit" class="js-submit-edit js-submit-edit-event-list" value="Save Changes and Close" name="submit">
					<button class="js-cancel-edit">Discard Changes</button>
					<br><br> 
					<span>Upcoming events for ${recipient.name}:</span>
					${ul}
				</form>
	`;
};

// ============ Recipient should be declared early and passed down ============
function generateEditGiftPickedHtml(recipientName, userEventName, userEventDate) {
	let lis = '', ul = '', recipient, giftsPickedAlready;
	recipient = globalUserData.giftLists.find(item => item.name == recipientName);
	recipient.giftIdeas.forEach(giftIdea => {
		lis += `<li><span class="js-gift-idea">${giftIdea}</span> <a target="_blank" href="javascript:;" class="js-give give">Give this gift</a></li>`
	});
	ul = `<ul class="gift-idea-list">
						${lis}
					</ul>`
	giftsPickedAlready = recipient.events.find(function(event) { 
		return event.eventName === userEventName 
	});
	return `					<form>
						<h3>${recipientName}: <span class="js-event-header">${userEventName} on ${userEventDate}</span></h3>
						<p>Gifts chosen so far:<br> <span class="js-edit-panel-gifts-picked-list"></span></p>
						<label for="gift-picked">The name of a new gift you will get for this event:</label>
						<input type="text" name="gift-picked" id="gift-picked" class="js-user-gift-picked" value="" required>
						<br>
						<label for="gift-picked-url">Paste the link to the online shopping page for this gift</label>
						<input type="text" name="gift-picked-url" id="gift-picked-url" class="js-user-gift-picked-url" required>
						<label for="gift-picked-price">Enter the price for this gift</label>
						<input type="text" name="gift-picked-price" id="gift-picked-price" class="js-user-gift-picked-price" required>
						<button class="js-add-to-gift-picked-list js-check-url">Add</button>
						<input type="submit" class="js-submit-edit js-submit-edit-gift-picked" value="Save Changes and Close" name="submit">
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

// kickstarts chain of functions
// checkUserLoggedIn();
// For testing:
loadPersonalisedPage('rob');