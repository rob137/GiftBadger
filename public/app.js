'use strict';

let globalUserData;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Object constructors to enable PUT requests
function Event(eventArr) {
	this.eventName = eventArr[0];
	this.eventDate = eventArr[1];
	this.giftsPicked = [];
}
function GiftPicked(giftsPickedDataArr) {
	this.giftName = giftsPickedDataArr[0];
	this.giftLink = giftsPickedDataArr[1];
	this.cost = giftsPickedDataArr[2];
} 
function GiftList(giftsListName) {
	this.name = giftsListName;
	this.events = [];
	this.giftIdeas = [];
} 

function checkUserLoggedIn() {
	// ===== Aspiration: app remembers whether user is logged in. ===== 
	/* if (user is logged in) {
		getDataUsingUsername(for user)
	} else {
	*/
	// for now, we assume user isn't logged in: 
	loadLoginOrRegisterHtml();
	handleLoginOrRegister();
}



// ------------------------------ LOGIN PAGE ------------------------------
function loadLoginOrRegisterHtml() {
	let loginOrRegisterHtml = `
	<h1>Gift Organiser</h1>
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
		listenForRegistrationClicks();
	});
}

// When user submits username/password
function attemptLogin(usernameInput, passwordInput) {
	// ===== Aspiration: talk to server to validate login with username/password =====
	// For now:
	if (usernameInput) {
		// remove login page
		$(".js-login-or-register").html('<p>Loading...</p>');
		// load user's giftlist!
		getDataUsingUsername(usernameInput)
	} 
}



// -------------------------- REGISTRATION PAGE --------------------------------
function loadRegisterHtml() {
	let newUserDetails, setupHtml, registerHtml = `
				<h1>Gift Organiser</h1>
				<h2>Register</h2>
				<form class="js-registration registration">
					<label for="username">Username:</label>
					<input type="text" name="username" id="username" class="js-username-input" required><br>
					<label for="firstName">First Name:</label>
					<input type="text" id="first-name" name="first name" class="js-first-name-input" required><br>
					<label for="email">Email:</label>
					<input type="text" name="email" id="email" class="js-email-input" required><br>
					<label for="password">Password:</label>
					<input type="password" name="password" id="password" class="js-password-input" required><br>
					<input type="submit" class="js-register-submit-button register-button">
					<button class="js-registration-back register-button">Back</button>
				</form>
	`
	$(".js-login-or-register").html(registerHtml);	
}

function listenForRegistrationClicks() {
	$(".js-registration").on("click", function(event) {
		event.stopPropagation();
		event.preventDefault();
		if ($(event.target).hasClass('js-register-submit-button')) {
			handleRegistrationSubmission()
		} else if ($(event.target).hasClass('js-registration-back')) {
			resetHtml();
			checkUserLoggedIn()
		};
	});
}

// Runs validation using other functions (see below), submits registration 
// and then calls getDataUsingUsername()
function handleRegistrationSubmission() {
	
	// <input> 'required' attribute doesn't work in some browsers when loaded asynchronously
	// So we check these fields are completed:
	let emailInput, usernameInput, firstNameInput, passwordInput, registeringUser;
	emailInput = $('.js-email-input').val();
	// ===== deactivated for now: passwordInput = $('.js-password-input').val(); =====
	usernameInput = $('.js-username-input').val().toLowerCase();
	firstNameInput = $('.js-first-name-input').val().toLowerCase();
			
	if (checkFormIsCompleted(usernameInput, firstNameInput, /*passwordInput,*/ emailInput)) {
		$.ajax({
			url: "/users",
			contentType: 'application/json',
			data: JSON.stringify({
				username: usernameInput,
				firstName: firstNameInput,
				email: emailInput
			}),
			success: function(data) {
			},
			error: function (){
				console.log('Error')
			},
			type: 'POST'
		});
	
		// remove login page
		resetHtml();
		// Load user's gift list!
		setTimeout(getDataUsingUsername(usernameInput), 500);

	} 

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
function getDataUsingUsername(usernameInput) {
	$.getJSON(`/users/${usernameInput}`, function(userJson) {
		globalUserData = userJson;
		setTimeout(function() {
			loadPersonalisedPage();
  	}, 300);
	});
}

function loadPersonalisedPage() {
	let firstName = globalUserData.firstName, email = globalUserData.email;
	resetHtml();
	showPersonalisedHeader(firstName);
	showGiftLists(firstName);
  showCalendar(email);
  handleOpenEditPanelClicks();
};

// Returns user to login page
function listenForClicksToHeader() {
	$('.js-personalised-header').on('click', function(event) {
		// For logging out
		if ($(event.target).hasClass('js-logout')) {
			resetHtml();
			checkUserLoggedIn();
		
		// for deleting user profile
		} else if ($(event.target).hasClass('js-delete-profile')) {
			handleDeleteProfile();
		}
	});
}

function handleDeleteProfile() {
	if (window.confirm(`This will permanently delete your profile! Are you sure?`)) {
		$.ajax({
			url: `/users/${globalUserData.id}`,
			contentType: 'application/json',
			data: JSON.stringify({
				id: globalUserData.id
			}),
			success: function(data) {
				alert('Your profile was deleted!');
				resetHtml();
				checkUserLoggedIn();
			},
			error: function (){
				console.log('Error')
			},
			type: 'DELETE'
		});
	}		
}

// Wipes all dynamically loaded html from DOM
function resetHtml() {
	$('.js-personalised-header').html('');
	$('.js-login-or-register').html('');
	$('.js-budget').html('');
	$('.js-gift-lists').html('');
	$('.js-calendar').html('');
	hideAndWipeEditPanel();
}

// displays page banner with user's first name 
function showPersonalisedHeader(firstName) {
	let titleName = firstName.charAt(0).toUpperCase() + firstName.slice(1, firstName.length);
	$('.js-personalised-header')
		.html(`<h1>${titleName}'s Gift Organiser</h1>
					<p><a  class="js-logout" target="_blank" href="javascript:;">Logout</a></p>
					<p><a  class="js-delete-profile" target="_blank" href="javascript:;">Delete your profile</a></p>`);
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

// Returns html for user's gift lists to showGiftsLists() (calls other functions for html sub-sections)
function createGiftListsHtml() {
	let giftListsArr = globalUserData.giftLists, giftListsHtml = `<h2>Gift Lists</h2>`, giftIdeasHtmlArr;
	// Html sub-sections populated by other functions
	let upcomingEventsListHtml, addToCalendarHtml, giftIdeasHtml = ``;
	giftListsHtml += `
			<p>Click <a  class="js-create-new-gift-list js-edit edit-alt" target="_blank" href="javascript:;">here</a> to add/remove people!</p>`
	
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

// Prepares events html for each gift list in user's profile; returns it to createGiftListsHtml()
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
				` Gift(s) chosen: <span id="js-${dynamicHtmlIdentifier}">${generateGiftsPickedHtml(event)}</span>
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

// As above, but html is for gifts picked for specific events
function generateGiftsPickedHtml(event) {
	let giftsPickedHtml = ``, giftLink, giftPrice;
	(event.giftsPicked).forEach(giftPicked => {
		if (giftPicked.giftLink != "") {
			giftLink = giftPicked.giftLink;
		} else {
			giftLink = createGoogleShoppimgUrl(giftPicked.giftName);
		}
		giftPrice = giftPicked.cost;
		giftsPickedHtml += 
		`<a target="_blank" href="${giftLink}" class="js-gift-picked"><span class="js-gift-picked-name">${giftPicked.giftName}</span></a> (£<span class="js-gift-price">${giftPrice}</span>), `
	});
	giftsPickedHtml += ``
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

// Called by showGiftLists(). Creates and shows a budget 'progress bar' and numbers  
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

// Loads iFrame for google calendar using user's email account 
function showCalendar(email) {
	$('.calendar')
		.html(`
			<h2>Your Calendar</h2>
			<iframe class="calendar" src="https://calendar.google.com/calendar/embed?
			src=${email}" style="border: 0" width="800" height="600" 
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
			userEventName = $(event.target).parent().parent().find('.js-event-name').html();
			userEventDate = $(event.target).parent().parent().find('.js-event-date').html();
			editHtml = generateEditGiftPickedHtml(recipientName, userEventName, userEventDate);
		}
		// Populate the edit panel with the HTML, and show the panel.
		$('.js-edit-panel').show();
		$('.js-edit-panel-inner').append(editHtml);
		handleClicksWithinEditPanel();

		// for 'gifts picker' edit panel  
		if ($(event.target).hasClass('js-edit-gift-picked')) {
			let newHtml = getGiftsAlreadyPicked();
			$('.js-edit-panel-gifts-picked-list').html(newHtml);
			listenForClickToAddGiftIdeaToEvent();
		}
	});
}


// ---------------- EDIT PANEL CLICK HANDLERS ----------------------
// Handles clicks in edit panel (add, save, cancel etc)	
function handleClicksWithinEditPanel() {
	let usersNewGiftIdea, usersNewGiftIdeaHtml, usersNewGiftName, usersNewGiftPrice, 
	usersNewGiftPickedHtml, usersNewGiftUrl, usersNewGiftlistName,

	//Events
	userEventName, userEventDate, userEventHtml;

	$(".js-edit-panel").on('click', function(event) {
		if ($(event.target).is('button') || $(event.target).is('input')) {
			event.stopPropagation();
			event.preventDefault();
		}
		// Gift decision: when user submits shopping url of gift for a specific event
		if ($(event.target).hasClass('js-add-to-giftlist-name-list')) {
			usersNewGiftlistName = $('.js-giftlist-input').val();
			if (usersNewGiftlistName.length > 0) {
				$('.js-giftlist-name-list').append(generateGiftlistsLi(usersNewGiftlistName));
			}
		} else if ($(event.target).hasClass('js-add-to-gift-picked-list')) {
			// Validation
			usersNewGiftName = $('.js-user-gift-picked').val(); 
			usersNewGiftUrl = $('.js-user-gift-picked-url').val();
			usersNewGiftPrice = $('.js-user-gift-picked-price').val();
			
			// Google shopping search url: for gifts with no url from user
			if (usersNewGiftUrl === "") {
				 usersNewGiftUrl = createGoogleShoppimgUrl(usersNewGiftName);
			}

			// If user provides an (optional) url, check it
			if (usersNewGiftUrl.length > 0) {
				if (!validateUrl(usersNewGiftUrl)) {
					alert('Incomplete Url!  Please either copy-paste a valid url or leave url field blank.');
					return;
				}
			}
			// Then check the other fields and add relevant html, and wipe the input fields
			if (usersNewGiftName && usersNewGiftPrice) {
				usersNewGiftPickedHtml = `
				<li class="js-gift-picked-edit-list-item">
					<a target="_blank" href="${usersNewGiftUrl}">
						<span class="js-gift-picked-input js-gift-picked-name">${usersNewGiftName}</span></a> (£<span class="js-gift-picked-price">${usersNewGiftPrice}</span>) 
						<a target="_blank" href="javascript:;" class="js-remove remove">remove</a>,
					</li>`
				$('.js-edit-panel-gifts-picked-list').append(usersNewGiftPickedHtml);
				$('.js-user-gift-picked').val('');
				$('.js-user-gift-picked-url').val('');
				$('.js-user-gift-picked-price').val('');
			} else {
				alert('Please enter a gift and its price!')
			}
		} else if ($(event.target).hasClass('js-submit-edit')) {
			handleEditSubmit(event.target);
		} else if ($(event.target).hasClass('js-cancel-edit')) {
				hideAndWipeEditPanel();
		// Gift Ideas: For when user clicks 'Add' button to add a gift idea
		}	else if ($(event.target).hasClass('js-add-to-gift-idea-list')) {
			// Validation
			if ($('.js-user-gift-idea').val()) {
				usersNewGiftIdea = $('.js-user-gift-idea').val(); 
				usersNewGiftIdeaHtml = `<li><span class="js-gift-idea-input">${usersNewGiftIdea}</span>  <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
				$('.gift-idea-list').append(usersNewGiftIdeaHtml);
			} else {
				alert('Please enter a gift idea!')
			}
		// Events: For when user clicks to 'Add' button to add changes to event list
		} else if ($(event.target).hasClass('js-add-to-event-list')) {
			// Validation
			if ($('.js-user-event-name').val()  && checkEventDateIsInFuture()) {
				userEventName = $('.js-user-event-name').val();
				userEventDate =  $('.js-user-event-date').val();
				userEventHtml = `
				<li><span class="js-event-list-input">${userEventName} on ${userEventDate}</span> 
				<a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
				$('.event-list').append(userEventHtml);
			} else {
				alert('Please enter an event name and future date!');
			}
		// Remove from edit panel: for when user clicks 'Remove' on an existing gift idea or upcoming event
		}	else if ($(event.target).hasClass('js-remove')) {
			handleRemoveClick(event.target); 
		};
	});
};

function handleRemoveClick(target) {
	let toDelete = $(event.target).closest("li"); 
	let toDeleteName = $(event.target).closest("li").find('span').text();
	if (window.confirm(`Are you sure you want to permanently delete ${toDeleteName}?`)) {
		$(toDelete).remove();
	}
}

function handleEditSubmit(target) {
	let newBudget, newGiftIdeaListArr = [], newEventListArr = [], 
	newEventListObjArr = [], eventDateArr = [], eventDateObjArr = [], giftsPicked,
	newGiftName, newGiftUrl, aElement, giftPickedName,

	// Gift ideas?
	currentNamesInDb = [], currentNamesInEditPanel =[], replacementGiftList = [], giftListName, newGiftList,
	itemForRemoval, i, length,
	
	// GiftLists
	recipient, giftListToChange,

	// Gift Picked
	giftPickedPrice, giftPickedUrl, giftsPickedDataArr, newGiftsPickedArr = [], 
	eventName, eventDate, targetEvent, j;

	
		// for saving changes to budget
	if ($(target).hasClass('js-submit-edit-budget')) {
		newBudget = $('.js-budget-input').val();
		globalUserData.budget = newBudget;

		// for saving changes to giftlists 
		// (i.e. adding/deleting a recipient name)
	} else if ($(target).hasClass('js-submit-edit-giftlist')) {
		$('.js-giftlist-name').each((index,value) => {
			currentNamesInEditPanel.push($(value).text());
		});
		globalUserData.giftLists.forEach(list => {
			currentNamesInDb.push(list.name);
		});

		// If a name is in db but not in edit panel, delete from db
		currentNamesInDb.forEach(nameInDb => {
			if (currentNamesInEditPanel.indexOf(nameInDb) < 0) {
				itemForRemoval = globalUserData.giftLists.find(item => {
					return item.name === nameInDb;
				});
				i = globalUserData.giftLists.indexOf(itemForRemoval);
				length = globalUserData.giftLists.length;
				globalUserData.giftLists[i] = globalUserData.giftLists[length-1];
				globalUserData.giftLists.pop(); 
			}
		});

		// If a name is in edit panel but not in db, add to db
		currentNamesInEditPanel.forEach(nameInEditPanel => {
			if (currentNamesInDb.indexOf(nameInEditPanel) < 0) {
				globalUserData.giftLists.push(new GiftList(nameInEditPanel));
			}
		})
		// for saving changes to gift ideas within a giftlist
	} else if ($(target).hasClass('js-submit-edit-gift-idea-list')) {
		$('.js-gift-idea-input').each( (index, value) => {
			newGiftIdeaListArr.push($(value).text())
		});
		recipient = $('.js-giftlist-recipient').text()
		giftListToChange = globalUserData.giftLists.find(item => {return item.name === recipient})
		i = globalUserData.giftLists.indexOf(giftListToChange);
		globalUserData.giftLists[i].giftIdeas = newGiftIdeaListArr; 
		// for saving changes to the events list
	} else if ($(target).hasClass('js-submit-edit-event-list')) {
		$('.js-event-list-input').each( (index, value) => {
			newEventListArr.push($(value).text())
		});
		newEventListArr.forEach(newEvent => {
			let eventDateArr = newEvent.split(' on ');
			let eventDateObjArr = new Event(eventDateArr);
			newEventListObjArr.push(eventDateObjArr)
		});
		recipient = $('.js-recipient-name').text();
		recipient = globalUserData.giftLists.find(item => {return item.name === recipient})
		i = globalUserData.giftLists.indexOf(recipient);
		globalUserData.giftLists[i].events = newEventListObjArr;
		
		// for saving changes to the 'picked items' list 
	} else if ($(target).hasClass('js-submit-edit-gift-picked')) {
		
		
		$('.js-gift-picked-edit-list-item').each( (index, value) => {
			giftsPickedDataArr = [];
			aElement = $(value).html();
			giftPickedName = $(value).find('.js-gift-picked-name').text();;
			giftPickedUrl = $(aElement).attr("href");
			giftPickedPrice = $(value).find('.js-gift-price').text();
			giftsPickedDataArr.push(giftPickedName);
			giftsPickedDataArr.push(giftPickedUrl);
			giftsPickedDataArr.push(giftPickedPrice);
			newGiftsPickedArr.push(new GiftPicked(giftsPickedDataArr));
		})

		// Repitition here - refactor out.
		recipient = $('.js-recipient-name').text();
		recipient = globalUserData.giftLists.find(item => {return item.name === recipient})
		i = globalUserData.giftLists.indexOf(recipient);

		eventName = $('.js-event-name-edit').text();
		eventDate = new Date($('.js-event-date-edit').text());
		console.log(i);
		console.log(eventName);
		console.log(eventDate);
		targetEvent = globalUserData.giftLists[i].events.find(event => {
			return event.eventName === eventName && event.eventDate == eventDate;
		});
		console.log(targetEvent);
		j =	globalUserData.giftLists[i].events.indexOf(targetEvent);
		globalUserData.giftLists[i].events[j].giftsPicked = newGiftsPickedArr;
		console.log(globalUserData);

	//	===== Need to submit newGiftsPickedArr as the value for 'giftsPicked' in each giftList in Put request ======
		
	} else {
		console.error('Submission type error!');
	}
	submitAndRefresh();
	hideAndWipeEditPanel();
}

function submitAndRefresh() {
	$.ajax({
			url: `/users/${globalUserData.id}`,
			contentType: 'application/json',
			data: JSON.stringify({
				id: globalUserData.id,
				username: globalUserData.username,
				budget: globalUserData.budget,
				giftLists: globalUserData.giftLists
			}),
			success: function(data) {
				globalUserData = data;
				loadPersonalisedPage();
			},
			error: function (){
				console.log('Error')
			},
			type: 'PUT'
		});
}

// For edit panel:  takes the heading of the edit panel for 'gifts picked' and
// returns links/text of other gifts already picked
function getGiftsAlreadyPicked() {
	let giftsPickedHtml;
	let giftsPickedLocator = $('.js-event-header').text().toLowerCase()
		.replace(',', '').replace('on ', '').replace(/ /g, '-')
		.replace('js-gifts-picked-list', 'js-edit-panel-gifts-picked-list');
	// Recreates the dynamically generated identifier used for event html - eg 'js-birthday-1-january-2019' 
	giftsPickedLocator = `#js-${giftsPickedLocator}`;
	giftsPickedHtml = $(giftsPickedLocator).html();
	if (giftsPickedHtml !== undefined && giftsPickedHtml.length > 0) {
		giftsPickedHtml = giftsPickedHtml	
			.replace(/<a target="_blank" h/g,'<li class="js-gift-picked-edit-list-item"><a target="_blank" h')
			.replace(/span>,/g, 'span>,</li>');
	}
	return giftsPickedHtml;
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
	let editNewGiftListHtml = `<form>
					<label for="name">Enter the name of someone you will need to buy a gift for:</label>
					<input type="text" name="name" id="name" class="js-giftlist-input">
					<button class="js-add-to-giftlist-name-list">Add</button>
					<input type="submit" class="js-submit-edit js-submit-edit-giftlist" name="submit" value="Save Changes and Close">
					<button class="js-cancel-edit">Discard Changes</button>
				</form>
				<p>People added so far:</p>
				`;
	let lis = ``;
	globalUserData.giftLists.forEach(giftList => {
		lis += generateGiftlistsLi(giftList.name);
	});
	let ul = `
		<ul class="js-giftlist-name-list">${lis}</ul
	`;
	return editNewGiftListHtml + ul;
}

function generateGiftlistsLi(name) {
	return `<li><span class="js-giftlist-name">${name}</span> <a target="_blank" href="javascript:;" class="js-remove remove">remove</a></li>`
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
					<p>Gift ideas for <span class="js-giftlist-recipient">${recipient.name}</span> so far:</p> 
					${ul}
				</form>`;
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
					<span>Upcoming events for <span class="js-recipient-name">${recipient.name}</span>:</span>
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
						<h3><span class="js-recipient-name">${recipientName}</span>: <span class="js-event-header"><span class="js-event-name-edit">${userEventName}</span> on <span class="js-event-date-edit">${userEventDate}</span></span></h3>
						<p>Gifts chosen so far:</p><ul class="js-edit-panel-gifts-picked-list"></ul>
						<label for="gift-picked">The name of a new gift you will get for this event:</label>
						<input type="text" name="gift-picked" id="gift-picked" class="js-user-gift-picked" value="" required>
						<br>
						<label for="gift-picked-url">Paste the link to an online shopping page for this gift</label>
						<input type="text" name="gift-picked-url" id="gift-picked-url" class="js-user-gift-picked-url" required>
						<label for="gift-picked-price">Enter the price for this gift</label>
						<input type="number" name="gift-picked-price" id="gift-picked-price" class="js-user-gift-picked-price" required>
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
function listenForClickToAddGiftIdeaToEvent() {
	let giftForGiving;
	$('.js-give').on('click', function(event) {
		giftForGiving = $(event.target).siblings(".js-gift-idea").text();
		$(event.target).closest('div').find('.js-added-message').remove();;
		$(event.target).after('<span class="js-added-message"> Added - scroll up!</span>');
		$(event.target).closest('div').find('.js-user-gift-picked').attr('value', giftForGiving);
	});
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


listenForEscapeOnEditPanel();
listenForClicksToHeader();
// For testing:
getDataUsingUsername('rob');