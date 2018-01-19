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
			"eventDate": "1 Jan",
			"finalDecision": {
				"giftName": "Cocoa Powder",
				"giftLink": "https://www.amazon.co.uk/Organic-Raw-Cacao-Powder-250g/dp/B005GT94GG",
				"cost": "7.55"
			},
			"budget": "10",
			"remindBefore": "30"
		}],
		// Could be presented as order of preference in UI:
		"giftIdeas": ["Cocoa Powder", "Sweater", "Bottle Of Red Wine"]
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
		"giftIdeas": ["Spice Rack", "Woollen Hat", "Bicycle Helmet"]
	}]
};

// To make dates easy to read
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Kickstarts chain of functions. Called on pageload.
function showGiftLists() {
	console.log('showGiftLists');
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
	console.log('createGiftListsHtml');
	let giftListsArr = data.giftLists;
	let giftListsHtml = ``;

	// Html subsections populated by other functions
	let upcomingEventsListHtml, giftIdeasHtml;

	giftListsArr.forEach(giftListArrItem => {

		// Populate html subsection variables using other functions
		giftIdeasHtml = createGiftIdeasHtml(giftListArrItem.giftIdeas);
		upcomingEventsListHtml = createUpcomingEventsListHtml(giftListArrItem.events);

		// Final Html returned to showGiftLists()
		giftListsHtml +=
			`<h2>${giftListArrItem.name}</h2>
			<h3>Gift Ideas</h3>
			${giftIdeasHtml}
			<h3>Upcoming Events</h3>
			${upcomingEventsListHtml}`;
	});

	return giftListsHtml;
}

function createUpcomingEventsListHtml(events) {
	console.log('createUpcomingEventsListHtml');
	let giftListsHtml = `<ul>`, monthName;
	events.forEach(event => {
		let eventDate = new Date(event.eventDate);
		monthName = monthNames[eventDate.getMonth()];
		let eventDateText = `${eventDate.getDate()} ${monthName}, ${eventDate.getFullYear()}`;
		giftListsHtml += `<li>-${event.eventName} on ${eventDateText}.`
		if (event.finalDecision !== "none") {
			giftListsHtml += 
				` Gift: <a href="${event.finalDecision.giftLink}">${event.finalDecision.giftName}"<a>`
		};
		giftListsHtml += `</li>`;
	});
	giftListsHtml += `</ul>`
	return giftListsHtml;
};

function createGiftIdeasHtml(giftIdeas) {
	console.log('createGiftIdeasHtml');
	let shoppingUrl;
	let giftIdeasHtml = `<ul>`;
	// https://www.google.co.uk/search?tbm=shop&q=pen&tbs=vw:g,mr:1,price:1,ppr_min:50,ppr_max:100
	// giftIdeas.join(', ');
	giftIdeas.forEach(giftIdea => {
		shoppingUrl = `https://www.google.co.uk/search?tbm=shop&q=${giftIdea}`
		giftIdeasHtml += `<li><a href="${shoppingUrl}">${giftIdea}"</a></li>
		`
	})
	giftIdeasHtml += `</ul>`;
	return giftIdeasHtml;
}

// Starts chain of functions on pageload
showGiftLists();