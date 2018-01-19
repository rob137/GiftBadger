'use strict';

let MOCK_GIFT_LIST = {
	"name": "Steve"
};

function getGiftLists() {
	$('p').text(MOCK_GIFT_LIST.name);	
}

getGiftLists();