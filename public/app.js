'use strict';

let MOCK_GIFT_LISTS = {
	"giftLists": [{
		"name": "Steve",
		"gift": "Plant pot"
	}, {
		"name": "Mike",
		"gift": "Cheese hamper"
	}, {
		"name": "Mel",
		"gift": "Air freshener"
	}]
};

function getGiftListsData() {
	return MOCK_GIFT_LISTS;
}

function createGiftListsHtml(data) {
	let giftLists = data.giftLists;
	let giftListsHtml;
	giftLists.forEach(giftList => {
		giftListsHtml += `
		<h2>${giftList.name}</h2>
		<p>${giftList.gift}</p>
		`
	})
	return giftListsHtml;
}

function showGiftLists() {
	let giftListsData = getGiftListsData();
	let giftListsHtml = createGiftListsHtml(giftListsData);
	$('.js-gift-lists').html(giftListsHtml);
}

showGiftLists();