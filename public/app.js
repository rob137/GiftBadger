'use strict';

const MOCK_GIFT_LISTS = {
	"giftLists": [{
		"name": "Sarah",
		"gender": "female",
		"events": [{
			"eventName": "Christmas",
			"eventDate": "25 Dec 2018",
			"finalDecision": "none",
			"budget": "10",
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
			"budget": "10",
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
			"budget": "10",
			"remindBefore": "30"
		}, {
			"eventName": "Birthday",
			"eventDate": "20 Feb 2018",
			"finalDecision": {
				"giftName": "Pot Plant",
				"giftLink": "https://www.amazon.co.uk/Ceramic-Ancient-Succulent-Container-Planter/dp/B01EMXFCJE/ref=sr_1_1_sspa?ie=UTF8&qid=1516359016&sr=8-1-spons&keywords=plant+pot&psc=1",
				"cost": "9.50"
			},
			"budget": "10",
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
			"budget": "10",
			"remindBefore": "30"
		}, {
			"eventName": "Birthday",
			"eventDate": "10 Mar 2018",
			"finalDecision": "none",
			"budget": "10",
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

function loadPersonalisedPage() {
	showGiftLists();
	showCalendar();
}

// Kickstarts chain of functions that show gift list. Called on pageload.
function showGiftLists() {
	// console.log('showGiftLists');
	let giftListsData = getGiftListsData();
	let giftListsHtml = createGiftListsHtml(giftListsData);
	$('.js-gift-lists').html(giftListsHtml);
}

// Mock GET request
function getGiftListsData() {
	return MOCK_GIFT_LISTS;
}

// Organises and displays html (relies on other functions for html subsections)
function createGiftListsHtml(data) {
	// console.log('createGiftListsHtml');
	let giftListsArr = data.giftLists, giftListsHtml = ``;
	// Html subsections populated by other functions
	let upcomingEventsListHtml, addToCalendarHtml, giftIdeasHtml;

	giftListsArr.forEach(giftListArrItem => {

		// Populate html subsection variables using other functions
		giftIdeasHtml = createGiftIdeasHtml(giftListArrItem.giftIdeas).join(', ');
		upcomingEventsListHtml = createUpcomingEventsListHtml(giftListArrItem.events, giftListArrItem.name, giftListArrItem);

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

function createUpcomingEventsListHtml(events, name, giftListArrItem) {
	// console.log('createUpcomingEventsListHtml');
	let upcomingEventsListHtml = `<ul>`, addToCalendarHtml, monthName;
	events.forEach(event => {
		let eventDate = new Date(event.eventDate);
		monthName = monthNames[eventDate.getMonth()];
		let eventDateText = `${eventDate.getDate()} ${monthName}, ${eventDate.getFullYear()}`;
		upcomingEventsListHtml += `<li>- ${event.eventName} on ${eventDateText}.`
		if (event.finalDecision !== "none") {
			upcomingEventsListHtml += 
				` Gift chosen: <a target="_blank" href="${event.finalDecision.giftLink}">${event.finalDecision.giftName}</a>`
		};
		upcomingEventsListHtml += `</li>`;
	addToCalendarHtml = prepareAddToCalendarHtml(event, name, giftListArrItem);
	});
	upcomingEventsListHtml += `</ul>`;
	
	
	upcomingEventsListHtml += addToCalendarHtml;

	return upcomingEventsListHtml;
};


// prepares 
function prepareAddToCalendarHtml(event, name, giftListArrItem) {
	let encodedBodyText, giftIdeasHtml, encodedGiftIdeasHtml, encodedGiftLink, encodedGiftName;
	let eventDate = new Date(event.eventDate);
	// To get the right format for Google Calendar URLs
  let	eventDatePlusOneDay = new Date(eventDate.getYear(),eventDate.getMonth(),eventDate.getDate()+1);
	eventDate = eventDate.toISOString().slice(0,10).replace(/-/g,"");
	eventDatePlusOneDay = eventDatePlusOneDay.toISOString().slice(0,10).replace(/-/g,"");
	let addToCalendarLink = 
		`https://www.google.com/calendar/render?action=TEMPLATE&
		sf=true&output=xml&
		text=${event.eventName}:+${name}&
		dates=${eventDate}/${eventDatePlusOneDay}&
		details=`
	// Will display link for chosen gift if provided by user
	if (event.finalDecision !== "none") {
		encodedGiftLink = encodeURIComponent(event.finalDecision.giftLink); 
		encodedBodyText = encodeURI(`You've decided to get this gift: <a target="_blank" href="${encodedGiftLink}">${event.finalDecision.giftName}</a>`)
		addToCalendarLink += encodedBodyText;
	} else { 
		giftIdeasHtml = createGiftIdeasHtml(giftListArrItem.giftIdeas).join(', '); 
		// To prevent URL issues with ampersands:
		encodedGiftIdeasHtml =  encodeURIComponent(giftIdeasHtml);
		encodedBodyText = encodeURI(`You still need to decide on a gift!\n\nGift ideas so far: `) + encodedGiftIdeasHtml;
		addToCalendarLink += encodedBodyText;
	}

	let addToCalendarHtml = `<a target="_blank" href="${addToCalendarLink}">Add to your Google Calendar (opens new tab)</a>`;	

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

function showCalendar() {
	$('.calendar')
		.html(`<iframe src="https://calendar.google.com/calendar/embed?
			src=${userEmail}" style="border: 0" width="800" height="600" 
			frameborder="0" scrolling="no"></iframe>`);
}

//
// Starts chain of functions on pageload
loadPersonalisedPage();

