let globalUserData;
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const weekDaysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Object constructors to enable PUT requests
function Event(eventArr) {
  const [name, date] = eventArr;
  this.eventName = name;
  this.eventDate = new Date(date).toString();
  this.giftsPicked = [];
}
function GiftPicked(giftsPickedDataArr) {
  const [name, link, price] = giftsPickedDataArr;
  this.giftName = name;
  this.giftLink = link;
  this.price = price;
}
function GiftList(giftsListName) {
  const name = giftsListName;
  this.name = name;
  this.events = [];
  this.giftIdeas = [];
}


function wipeListenerFromClass(target) {
  $(target).off('click');
}

function checkEventDateIsInFuture(dateProvided) {
  const dateToTest = new Date(dateProvided);
  const now = new Date();
  return dateToTest > now;
}

function generateEditBudgetHtml() {
  let budget;
  if (globalUserData.budget === undefined) {
    budget = 0;
  } else {
    this.budget = globalUserData;
  }
  return `
    <form>
      <label for="budget">Enter your budget: </label>
      <input type="number" min="0" value="${budget}" name="budget" id="budget" class="js-budget-input" placeholder="${globalUserData.budget}">
      <input type="submit" class="js-submit-edit js-submit-edit-budget" name="submit" value="Save Changes and Close">
      <button class="js-cancel-edit">Discard Changes</button>
      <p class="js-validation-warning validation-warning"></p>
    </form>`;
}

function generateGiftlistsLi(name) {
  return `<li><span class="js-giftlist-name">${name}</span> <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a></li>`;
}

function generateSavedEventsHtml() {
  // defaults to returning an empty ul
  let ul = '<ul class="js-giftlist-name-list"></ul>';
  // if gifts are already listed, adds them to the ul
  if ($('.js-upcoming-events').length > 0) {
    const lisArr = globalUserData.giftLists.map(x => generateGiftlistsLi(x.name));
    const lis = lisArr.join('');
    ul = `<ul class="js-giftlist-name-list">${lis}</ul>`;
  }
  return ul;
}

function generateEditNewGiftListHtml() {
  let editNewGiftListHtml = `
    <form>
      <label for="name">Enter the name of someone you will need to buy a gift for: </label>
      <input type="text" name="name" id="name" class="js-giftlist-input">
      <button class="js-add-to-giftlist-name-list">Add</button>
      <input type="submit" class="js-submit-edit js-submit-edit-giftlist" name="submit" value="Save Changes and Close">
      <button class="js-cancel-edit">Discard Changes</button>
      <p class="js-validation-warning validation-warning"></p>
    </form>
    <p>People added so far: </p>`;
  const ul = generateSavedEventsHtml();
  // provided there are events already saved, list them in the edit panel
  editNewGiftListHtml += ul;
  return editNewGiftListHtml;
}

// GUD!
// creates editable list of gift ideas so far for the giftList
function generateEditGiftIdeasHtml(giftListName) {
  let ul = '';
  let html;
  const giftList = globalUserData.giftLists.find(item => item.name === giftListName);
  const lisArr = giftList.giftIdeas.map((x) => {
    html = `<li>
              <span class="js-gift-idea-input">${x}</span> 
              <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a>
            </li>`;
    return html;
  });
  const lis = lisArr.join('');
  ul = `<ul class="gift-idea-list">${lis}</ul>`;
  return `<p>If you have ideas for gifts, record them here.  You can use this list to help make a decision later.</p> 
          <form>
            <label for="gift-idea">Write a gift idea here: </label>
            <input type="text" name="gift-idea" id="gift-idea" class="js-user-gift-idea" required>
            <button class="js-add-to-gift-idea-list">Add</button>
            <input type="submit" class="js-submit-edit js-submit-edit-gift-idea-list" value="Save Changes and Close" name="submit">
            <button class="js-cancel-edit">Discard Changes</button>
            <p class="js-validation-warning validation-warning"></p>
            <br><br>
            <p>Gift ideas for <span class="js-giftlist-name">${giftList.name}</span> so far: </p> 
            ${ul}
          </form>`;
}

function makeHumanReadableDate(date) {
  const d = new Date(date);
  const output = `${weekDaysArr[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  return output;
}

function generateEventListLi(event) {
  const date = makeHumanReadableDate(event.eventDate);
  return `<li>
             <span class="js-event-list-input">${event.eventName} on ${date}</span> 
             <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a>
           </li>`;
}

function generateEditEventsHtml(giftListName) {
  let ul = '';
  const giftList = globalUserData.giftLists.find(item => item.name === giftListName);
  const lisArr = giftList.events.map(event => generateEventListLi(event));
  const lis = lisArr.join('');
  ul = `<ul class="event-list">
          ${lis}
        </ul>`;
  return `<form>
            <p class="js-validation-warning validation-warning"></p>
            <label for="event">Add an event: </label>
            <input type="text" name="event-name" id="event-name" class="js-user-event-name" required>
            <label for="event">Date: </label>
            <input type="date" name="event-date" id="event-date" class="js-user-event-date" required>
            <button class="js-add-to-event-list">Add</button>
            <input type="submit" class="js-submit-edit js-submit-edit-event-list" value="Save Changes and Close" name="submit">
            <button class="js-cancel-edit">Discard Changes</button>
            <br><br> 
            <span>Upcoming events for <span class="js-gift-list-name">${giftList.name}</span>: </span>
            ${ul}
          </form>
  `;
}

function generateGiftIdeaLi(giftIdea) {
  const li = `<li>
              <span class="js-gift-idea">${giftIdea}</span>
              <a target="_blank" href="javascript:;" class="js-give give">Give this gift</a>
            </li>`;
  return li;
}

function createUlFromArr(arr, htmlClassName) {
  const lis = arr.join('');
  return `<ul class="${htmlClassName}">
            ${lis}
          </ul>`;
}

function generateGiftIdeaUl(giftIdeas) {
  const lisArr = giftIdeas.map(giftIdea => generateGiftIdeaLi(giftIdea));
  const ul = createUlFromArr(lisArr, 'gift-idea-list');
  return ul;
}
function findRecipientObject(giftListName, userData) {
  return userData.giftLists.find(item => item.name === giftListName);
}

// GUD!
function generateEditGiftPickedHtml(giftListName, userEventName, userEventDate) {
  const giftList = findRecipientObject(giftListName, globalUserData);
  const giftIdeasUl = generateGiftIdeaUl(giftList.giftIdeas);
  return `<form>
            <p class="js-validation-warning validation-warning"></p>
            <h3><span class="js-gift-list-name">${giftListName}</span>: <span class="js-event-header"><span class="js-event-name-edit">${userEventName}</span> on <span class="js-event-date-edit">${userEventDate}</span></span></h3>
            <p>Gifts chosen so far: </p><ul class="js-edit-panel-gifts-picked-list"></ul>
            <label for="gift-picked">The name of a new gift you will get for this event: </label>
            <input type="text" name="gift-picked" id="gift-picked" class="js-user-gift-picked" value="" required>
            <br>
            <label for="gift-picked-url">Paste the link to an online shopping page for this gift: </label>
            <input type="text" name="gift-picked-url" id="gift-picked-url" class="js-user-gift-picked-url" required>
            <label for="gift-picked-price">Enter the price for this gift: </label>
            <input type="number" name="gift-picked-price" id="gift-picked-price" class="js-user-gift-picked-price" required>
            <button class="js-add-to-gift-picked-list js-check-url">Add</button>
            <input type="submit" class="js-submit-edit js-submit-edit-gift-picked" value="Save Changes and Close" name="submit">
            <button class="js-cancel-edit">Discard Changes</button>
            <br>
            <p>... Or choose a gift from your ideas for ${giftList.name} so far: </p> 
            ${giftIdeasUl}
          </form>`;
}

function handleRemoveClick(target) {
  const toDelete = $(target).closest('li');
  $(toDelete).remove();
}

// Called when user submits an online shopping site to accompany a gift choice.
function validateUrl(input) {
  const re = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return re.test(input);
}

// For adding gift ideas to 'gifts picked for event'.
// Gets the gift name and puts it in the gift name input box.
function listenForClickToAddGiftIdeaToEvent() {
  let giftForGiving;
  $('.js-give').on('click', (event) => {
    giftForGiving = $(event.target).siblings('.js-gift-idea').text();
    $(event.target).closest('div').find('.js-added-message').remove();
    $(event.target).after('<span class="js-added-message"> Added - scroll up!</span>');
    $(event.target).closest('div').find('.js-user-gift-picked').attr('value', giftForGiving);
  });
}

// displays page banner with user's first name
function showPersonalisedHeader(firstName) {
  const titleName = firstName.charAt(0).toUpperCase() + firstName.slice(1, firstName.length);
  $('.js-personalised-header')
    .html(`<h1>Gift Organiser For ${titleName}'s Google Calendar</h1>
          <p><a  class="js-logout" target="_blank" href="javascript:;">Logout</a></p>
          <p><a  class="js-delete-profile" target="_blank" href="javascript:;">Delete your profile</a></p>`);
}

// Called by showGiftLists(). Creates and shows a budget 'progress bar' and numbers
function showBudget() {
  let budgetHtml;
  let totalBudget;
  let giftLists;
  let eventsArr;
  let spendSoFar;
  let spanWidth;
  let percentageSpend;
  // default budget is 0, so this checks user has provided a budget
  if (!globalUserData.budget || !(globalUserData.budget > 0)) {
    budgetHtml = `
      <h2>Your Remaining Budget</h2>
      <p>Click <a class="js-edit-budget js-edit edit-alt" target="_blank" href="javascript:;">here</a> to enter your budget!</p>`;
  } else {
    totalBudget = globalUserData.budget;
    ({ giftLists } = globalUserData);
    eventsArr = [];
    spendSoFar = 0;
    spanWidth = 0;

    // !!!!! Use reduce
    giftLists.forEach((giftList) => {
      giftList.events.forEach((event) => {
        eventsArr.push(event);
      });
    });

    // !!!!! Use reduce
    eventsArr.forEach((event) => {
      if (event.giftsPicked.length > 0) {
        (event.giftsPicked).forEach((giftPicked) => {
          spendSoFar += Number(giftPicked.price);
        });
      }
    });

    percentageSpend = Math.floor((spendSoFar / totalBudget) * 100);
    spanWidth = 100 - percentageSpend;
    // in case they are over budget
    if (spanWidth > 100) {
      spanWidth = 100;
    }

    budgetHtml = `
      <h2>Your Remaining Budget</h2>
      <p>So far, you've spent £${spendSoFar} (${percentageSpend}%) of your £${totalBudget} budget.
        <a target="_blank" href="javascript:;"><span class="js-edit-budget js-edit edit">edit</span></a>
      </p>
      <div class="budget-meter">
        <span class="budget-span" style="width: ${spanWidth}%"></span>
      </div>`;
  }
  $('.js-budget').append(budgetHtml);
}

function createGoogleShoppingUrl(gift) {
  return `https://www.google.co.uk/search?tbm=shop&q=${gift}`;
}

// Creates text and link for user's gift ideas
function createGiftsPickedHtml(giftPicked) {
  const { giftName, giftLink, price } = giftPicked;
  return `<a target="_blank" href="${giftLink}">${giftName}</a> (£${price})`;
}
// Creates text and link for user's gift ideas
function createGiftIdeasHtml(giftIdea) {
  const shoppingUrl = createGoogleShoppingUrl(giftIdea);
  return `<a target="_blank" href="${shoppingUrl}">${giftIdea}</a>`;
}

function prepareGoogleCalendarDate(eventDate) {
  const year = eventDate.getYear() + 1900;
  const month = eventDate.getMonth();
  const theDate = eventDate.getDate();
  const resultsArr = [];
  const eventDatePlusOneDay = new Date(year, month, theDate + 1);
  resultsArr.push(eventDate.toISOString().slice(0, 10).replace(/-/g, ''));
  resultsArr.push(eventDatePlusOneDay.toISOString().slice(0, 10).replace(/-/g, ''));
  return resultsArr;
}

function prepareGoogleCalendarBodyText(event, giftListArrItem) {
  let encodedBodyText;
  let giftIdeasHtml;
  let giftIdeasHtmlArr;
  let calendarBodyText;
  if (event.giftsPicked.length > 0) {
    // Will either display link for chosen gift(s)...
    const listHtmlArr = event.giftsPicked.map(x => createGiftsPickedHtml(x));
    const listHtml = listHtmlArr.join(', ');
    encodedBodyText = encodeURIComponent(`You've decided to get these gift(s): ${listHtml}`);
    calendarBodyText = encodedBodyText;
  } else {
    // ... or will display links to google shopping searches for gift ideas.
    giftIdeasHtmlArr = giftListArrItem.giftIdeas.map(x => createGiftIdeasHtml(x));
    giftIdeasHtml = giftIdeasHtmlArr.join(', ');
    encodedBodyText = encodeURIComponent(`You still need to decide on a gift!\n\nGift ideas so far: ${giftIdeasHtml}`);
    calendarBodyText = encodedBodyText;
  }
  return calendarBodyText;
}

// prepares google calendar link - see 'addToCalendarLink' for the template of the link.
function prepareAddToCalendarHtml(event, giftListArrItem) {
  const eventDate = new Date(event.eventDate);
  // To get the right format for Google Calendar URLs
  const eventDateArr = prepareGoogleCalendarDate(eventDate);
  let addToCalendarLink = `
    https://www.google.com/calendar/render?action=TEMPLATE&sf=true&output=xml&text=${event.eventName}:+${giftListArrItem.name}&dates=${eventDateArr[0]}/${eventDateArr[1]}&details=`;
  addToCalendarLink += prepareGoogleCalendarBodyText(event, giftListArrItem);
  return `<a target="_blank" href="${addToCalendarLink}">Add to your Google Calendar (opens new tab)</a>`;
}

// As above, but html is for gifts picked for specific events
function generateGiftsPickedHtml(event) {
  let giftLink;
  let giftPrice;
  const giftsPickedHtmlArr = event.giftsPicked.map((giftPicked) => {
    if (giftPicked.giftLink !== '') {
      ({ giftLink } = giftPicked);
    } else {
      giftLink = createGoogleShoppingUrl(giftPicked.giftName);
    }
    giftPrice = giftPicked.price;
    return `
    <a target="_blank" href="${giftLink}" class="js-gift-picked">
      <span class="js-gift-picked-name">${giftPicked.giftName}</span>
    </a>
    (£<span class="js-gift-price">${giftPrice}</span>)`;
  });
  return giftsPickedHtmlArr.join();
}

// Prepares events html for each gift list in user's profile; returns it to createGiftListsHtml()
function createUpcomingEventsListHtml(giftListArrItem) {
  // *** Opening ul tag ***
  let upcomingEventsListHtml = '<ul>';
  let addToCalendarHtml;
  let eventDate;
  const upcomingEventsListHtmlArr = giftListArrItem.events.map((event) => {
    // Renders human readable dates
    eventDate = makeHumanReadableDate(event.eventDate);
    // Dynamic html class/id to help lookup from edit forms
    const dynamicHtmlIdentifier = (`${event.eventName} ${eventDate}`).toLowerCase()
      .replace(',', '').replace(/ /g, '-');
    // The class 'js-event-name' allows us to to look up giftLists[n].events[this event]
    // when the user clicks to choose a gift for the event.
    upcomingEventsListHtml = `<li class="js-${dynamicHtmlIdentifier}"> <span class="js-event-name">${event.eventName}</span> on <span class="js-event-date">${eventDate}</span>.`;
    if (event.giftsPicked.length > 0) {
      upcomingEventsListHtml += `
        Gift(s) chosen: 
        <span id="js-${dynamicHtmlIdentifier}">${generateGiftsPickedHtml(event)}</span>
        <a target="_blank" class="js-edit js-edit-gift-picked edit" href="javascript:;">edit</a>`;
    } else {
      upcomingEventsListHtml +=
        '<br><span>(If you\'ve decided what you\'re giving them for this event, then click <a target="_blank" class="js-edit js-edit-gift-picked" href="javascript:;">here</a> to save your decision.)</span>';
    }
    upcomingEventsListHtml += '</li>';
    addToCalendarHtml = prepareAddToCalendarHtml(event, giftListArrItem);
    upcomingEventsListHtml += addToCalendarHtml;
    return upcomingEventsListHtml;
  });
  let result = upcomingEventsListHtmlArr.join('');
  result += '</ul>';
  return result;
}

// Returns html for user's gift lists to showGiftsLists()
function createGiftListsHtml() {
  const giftListsArr = globalUserData.giftLists;
  let giftIdeasHtmlArr;
  // Html sub-sections populated by other functions
  let upcomingEventsListHtml;
  let giftIdeasHtml = '';
  let giftListsHtml = `
      <h2>Gift Lists</h2>
      <p>Click <a  class="js-create-new-gift-list js-edit edit-alt" target="_blank" href="javascript:;">here</a> to add/remove people!</p>`;
  // Creates Html for gift ideas: create a gift idea list for each gift list in user's profile
  const giftListsHtmlArr = giftListsArr.map((giftListArrItem) => {
    // Populate html subsection variables using other functions
    giftIdeasHtmlArr = giftListArrItem.giftIdeas.map(x => createGiftIdeasHtml(x));
    giftIdeasHtml = giftIdeasHtmlArr.join(', ');
    // Creates Html for the events list:
    upcomingEventsListHtml = createUpcomingEventsListHtml(giftListArrItem);
    // Final Html returned to showGiftLists()
    return `
      <div class="js-gift-list">
        <h2>${giftListArrItem.name}</h2>
        <h3>Gift Ideas So Far <a target="_blank" href="javascript:;"><span class="js-edit-gift-ideas js-edit edit">edit</span></a></h3> 
        ${giftIdeasHtml}
        <h3>Upcoming Events <a target="_blank" href="javascript:;"><span class="js-edit-events js-edit edit">edit</span></a></h3>
        <ul class="js-upcoming-events">
          ${upcomingEventsListHtml}
        </ul>
      </div>`;
  });
  giftListsHtml += giftListsHtmlArr.join('');
  return giftListsHtml;
}

// Kickstarts the chain of functions that render user's gift lists.
function showGiftLists() {
  const giftListsHtml = createGiftListsHtml();
  $('.js-gift-lists').html(giftListsHtml);
  showBudget();
}

// Loads iFrame for google calendar using user's email account
function showCalendar(email) {
  $('.calendar')
    .html(`
      <h2>Your Calendar</h2>
      <iframe 
        class="calendar" 
        src="https://calendar.google.com/calendar/embed?src=${email}" 
        style="border: 0" 
        width="800" 
        height="600" 
        frameborder="0" 
        scrolling="no"
      ></iframe>`);
}

// For edit panel:  takes the heading of the edit panel for 'gifts picked' and
// returns links/text of other gifts already picked
function getGiftsAlreadyPicked() {
  let giftsPickedHtml;
  let giftsPickedLocator = $('.js-event-header').text().toLowerCase()
    .replace(',', '')
    .replace('on ', '')
    .replace(/ /g, '-')
    .replace('js-gifts-picked-list', 'js-edit-panel-gifts-picked-list');
  // Recreates the dynamically generated identifier used for event html:
  // eg 'js-birthday-1-january-2019'
  giftsPickedLocator = `#js-${giftsPickedLocator}`;
  giftsPickedHtml = $(giftsPickedLocator).html();
  if (giftsPickedHtml !== undefined && giftsPickedHtml.length > 0) {
    giftsPickedHtml = giftsPickedHtml
      .replace(/<a target="_blank" h/g, '<li class="js-gift-picked-edit-list-item"><a target="_blank" h')
      .replace(/span>,/g, 'span>,</li>');
    giftsPickedHtml += ' <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a></span>';
  }
  return giftsPickedHtml;
}

function hideAndWipeEditPanel() {
  $('.js-edit-panel').off();
  $('.js-edit-panel').hide();
  $('.js-edit-panel-inner').html('');
  wipeListenerFromClass('main');
  handleOpenEditPanelClicks();
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

function loadPersonalisedPage() {
  let firstName = '';
  let email = '';
  ({ firstName, email } = globalUserData);
  resetHtml();
  showPersonalisedHeader(firstName);
  showGiftLists(firstName);
  showCalendar(email);
}

function submitAndRefresh() {
  $.ajax({
    url: `/users/${globalUserData.id}`,
    contentType: 'application/json',
    data: JSON.stringify({
      id: globalUserData.id,
      budget: globalUserData.budget,
      giftLists: globalUserData.giftLists,
    }),
    success(data) {
      globalUserData = data;
      loadPersonalisedPage();
    },
    error() {
      console.error('Error submitting PUT request');
    },
    type: 'PUT',
  });
}

function saveChangesToBudget() {
  const newBudget = $('.js-budget-input').val();
  globalUserData.budget = newBudget;
}

// !!!!! refactor
function saveChangesToGiftlists() {
  const currentNamesInEditPanel = [];
  let originalItem;
  let i;
  let currentNamesInDb = [];
  $('.js-giftlist-name').each((index, value) => {
    // Make arrays of names currently in edit panel and db
    currentNamesInEditPanel.push($(value).text());
    if (globalUserData.giftLists[0] !== null) {
      currentNamesInDb = globalUserData.giftLists.map(x => x.name);
    }
  });

  // If a name is in db but not in edit panel, delete from db
  currentNamesInDb.forEach((nameInDb) => {
    if (currentNamesInEditPanel.indexOf(nameInDb) < 0) {
      originalItem = globalUserData.giftLists.find(item => item.name === nameInDb);
      i = globalUserData.giftLists.indexOf(originalItem);
      // !!!!! use slice
      globalUserData.giftLists[i] = globalUserData.giftLists[globalUserData.giftLists.length - 1];
      globalUserData.giftLists.pop();
    }
  });

  // If a name is in edit panel but not in db, add to db
  globalUserData.giftLists = currentNamesInEditPanel.map((nameInEditPanel) => {
    if (!(currentNamesInDb.indexOf(nameInEditPanel) >= 0)) {
      return new GiftList(nameInEditPanel);
    }
    originalItem = globalUserData.giftLists.find(item => item.name === nameInEditPanel);
    return originalItem;
  });
}


function saveChangesToGiftIdeas() {
  const newGiftIdeaListArr = [];
  const giftList = $('.js-giftlist-name').text();
  const giftListToChange = globalUserData.giftLists.find(item => item.name === giftList);
  $('.js-gift-idea-input').each((index, value) => {
    newGiftIdeaListArr.push($(value).text());
  });
  const i = globalUserData.giftLists.indexOf(giftListToChange);
  globalUserData.giftLists[i].giftIdeas = newGiftIdeaListArr;
}

function saveChangesToEventList() {
  const newEventListArr = [];
  let eventDateArr = [];
  let eventDateObjArr = [];
  let giftList;
  $('.js-event-list-input').each((index, value) => {
    newEventListArr.push($(value).text());
  });
  const newEventListObjArr = newEventListArr.map((x) => {
    eventDateArr = x.split(' on ');
    eventDateObjArr = new Event(eventDateArr);
    return eventDateObjArr;
  });
  // Repetition here - refactor it out.
  giftList = $('.js-gift-list-name').text();
  giftList = globalUserData.giftLists.find(item => item.name === giftList);
  const i = globalUserData.giftLists.indexOf(giftList);
  globalUserData.giftLists[i].events = newEventListObjArr;
}

function saveChangesToGiftsPicked() {
  const newGiftsPickedArr = [];
  let aElement;
  let giftPickedName;
  let giftList;
  let giftPickedPrice;
  let giftPickedUrl;
  let giftsPickedDataArr;

  $('.js-gift-picked-edit-list-item').each((index, value) => {
    giftsPickedDataArr = [];
    aElement = $(value).html();
    giftPickedName = $(value).find('.js-gift-picked-name').text();
    giftPickedUrl = $(aElement).attr('href');
    giftPickedPrice = $(value).find('.js-gift-picked-price').text();
    giftsPickedDataArr.push(giftPickedName);
    giftsPickedDataArr.push(giftPickedUrl);
    giftsPickedDataArr.push(giftPickedPrice);
    newGiftsPickedArr.push(new GiftPicked(giftsPickedDataArr));
  });
  // Repetition here - refactor it.
  giftList = $('.js-gift-list-name').text();
  giftList = globalUserData.giftLists.find(item => item.name === giftList);
  const i = globalUserData.giftLists.indexOf(giftList);

  const eventName = $('.js-event-name-edit').text();
  const eventDate = new Date($('.js-event-date-edit').text()).toString();
  const targetEvent = globalUserData.giftLists[i].events
    .find(event => event.eventName === eventName && event.eventDate === eventDate);
  let j = globalUserData.giftLists[i].events.indexOf(targetEvent);
  // if there are no items already stored
  if (j < 0) {
    j = 0;
  }
  globalUserData.giftLists[i].events[j].giftsPicked = newGiftsPickedArr;
}

function handleEditSubmit(target) {
  if ($(target).hasClass('js-submit-edit-budget')) {
    saveChangesToBudget();
  } else if ($(target).hasClass('js-submit-edit-giftlist')) {
    saveChangesToGiftlists();
  } else if ($(target).hasClass('js-submit-edit-gift-idea-list')) {
    saveChangesToGiftIdeas();
  } else if ($(target).hasClass('js-submit-edit-event-list')) {
    saveChangesToEventList();
  } else if ($(target).hasClass('js-submit-edit-gift-picked')) {
    saveChangesToGiftsPicked();
  } else {
    console.error('Submission type error!');
  }
  submitAndRefresh();
  hideAndWipeEditPanel();
}

function validateName(name) {
  return name.length >= 2 && name.length <= 18;
}

// Handles clicks in edit panel (add, save, cancel etc)
function handleClicksWithinEditPanel() {
  let usersNewGiftIdea;
  let usersNewGiftIdeaHtml;
  let usersNewGiftName;
  let usersNewGiftPrice;
  let usersNewGiftPickedHtml;
  let usersNewGiftUrl;
  let usersNewGiftlistName;

  // Events
  let userEventName;
  let userEventDate;
  let userEventHtml;

  $('main').on('click', (event) => {
    if ($(event.target).is('button') || $(event.target).is('input')) {
      event.stopPropagation();
      event.preventDefault();
    }
    // Gift decision: when user submits shopping url of gift for a specific event
    if ($(event.target).hasClass('js-add-to-giftlist-name-list') && $('.js-giftlist-input').val().length > 0) {
      usersNewGiftlistName = $('.js-giftlist-input').val();
      if (validateName(usersNewGiftlistName)) {
        $('.js-giftlist-name-list').append(generateGiftlistsLi(usersNewGiftlistName));
        $('.js-giftlist-input').val('');
      } else {
        $('.js-validation-warning').text('Please enter a valid name.');
      }
    } else if ($(event.target).hasClass('js-add-to-gift-picked-list')) {
      // Validation
      usersNewGiftName = $('.js-user-gift-picked').val();
      usersNewGiftUrl = $('.js-user-gift-picked-url').val();
      usersNewGiftPrice = $('.js-user-gift-picked-price').val();

      // Google shopping search url: for gifts with no url from user
      if (usersNewGiftUrl === '') {
        usersNewGiftUrl = createGoogleShoppingUrl(usersNewGiftName);
      }

      // If user provides an (optional) url, check it
      if (usersNewGiftUrl.length > 0) {
        if (!validateUrl(usersNewGiftUrl)) {
          $('.js-validation-warning').text('Incomplete Url!  Please either copy-paste a valid url or leave url field blank.');
        }
      }
      // Then check the other fields and add relevant html, and wipe the input fields
      if (usersNewGiftName && usersNewGiftPrice) {
        usersNewGiftPickedHtml = `
          <li class="js-gift-picked-edit-list-item">
            <a target="_blank" href="${usersNewGiftUrl}">
              <span class="js-gift-picked-input js-gift-picked-name">${usersNewGiftName}</span>
            </a> 
            (£<span class="js-gift-picked-price">${usersNewGiftPrice}</span>) 
            <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a>,
          </li>`;
        $('.js-edit-panel-gifts-picked-list').append(usersNewGiftPickedHtml);
        $('.js-user-gift-picked').val('');
        $('.js-user-gift-picked-url').val('');
        $('.js-user-gift-picked-price').val('');
        $('.js-validation-warning').text('');
      } else {
        $('.js-validation-warning').text('Please enter a gift and its price!');
      }
    } else if ($(event.target).hasClass('js-submit-edit')) {
      handleEditSubmit(event.target);
    } else if ($(event.target).hasClass('js-cancel-edit')) {
      hideAndWipeEditPanel();
      // Gift Ideas: For when user clicks 'Add' button to add a gift idea
    } else if ($(event.target).hasClass('js-add-to-gift-idea-list')) {
      // Validation
      if ($('.js-user-gift-idea').val()) {
        usersNewGiftIdea = $('.js-user-gift-idea').val();
        usersNewGiftIdeaHtml = `
          <li>
            <span class="js-gift-idea-input">${usersNewGiftIdea}</span>
            <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a>
          </li>`;
        $('.gift-idea-list').append(usersNewGiftIdeaHtml);
        $('.js-user-gift-idea').val('');
        $('.js-validation-warning').text('');
      } else {
        $('.js-validation-warning').text('Please enter a gift idea!');
      }
      // Events: For when user clicks to 'Add' button to add changes to event list
    } else if ($(event.target).hasClass('js-add-to-event-list')) {
      // Validation
      console.log(0);
      if ($('.js-user-event-name').val() && checkEventDateIsInFuture($('.js-user-event-date').val())) {
        console.log(1);
        userEventName = $('.js-user-event-name').val();
        userEventDate = makeHumanReadableDate($('.js-user-event-date').val());
        userEventHtml = `
          <li>
            <span class="js-event-list-input">${userEventName} on ${userEventDate}</span> 
            <a target="_blank" href="javascript:;" class="js-remove remove">Remove</a>
          </li>`;
        $('.event-list').append(userEventHtml);
        $('.js-user-event-name').val('');
        $('.js-user-event-date').val('');
      } else {
        console.log(2);
        $('.js-validation-warning').text('Please enter an event name and future date!');
      }
      console.log(3);
      // Remove from edit panel (existing gift idea or upcoming event)
    } else if ($(event.target).hasClass('js-remove')) {
      handleRemoveClick(event.target);
    }
  });
}

// Called on pageload
// The edit panel is hidden & blank until user clicks an edit option.
function handleOpenEditPanelClicks() {
  let editHtml = '';
  let giftListName;
  let userEventName;
  let userEventDate;

  // Get the appropriate edit panel html...
  $('main').on('click', (event) => {
    if ($(event.target).hasClass('js-edit')) {
      hideAndWipeEditPanel();
      giftListName = $(event.target).closest('.js-gift-list').find('h2').text();
      // edit panel for changing budget
      if ($(event.target).hasClass('js-edit-budget')) {
        editHtml = generateEditBudgetHtml();
        // edit panel for adding a new gift list
      } else if ($(event.target).hasClass('js-create-new-gift-list')) {
        editHtml = generateEditNewGiftListHtml();
        // edit panel for changing gift ideas
      } else if ($(event.target).hasClass('js-edit-gift-ideas')) {
        editHtml = generateEditGiftIdeasHtml(giftListName);
        // edit panel for changing upcoming events
      } else if ($(event.target).hasClass('js-edit-events')) {
        editHtml = generateEditEventsHtml(giftListName);
        // edit panel for changing gifts picked for a particular event
      } else if ($(event.target).hasClass('js-edit-gift-picked')) {
        // Gets the event name from the dom - used to look up event object in json
        // For events that do not have gifts picked already
        if ($(event.target).parent().find('.js-event-name').text() === '') {
          userEventName = $(event.target).parent().parent().find('.js-event-name')
            .html();
          userEventDate = $(event.target).parent().parent().find('.js-event-date')
            .html();
          // For events that already have gifts picked
        } else {
          userEventName = $(event.target).parent().find('.js-event-name')
            .html();
          userEventDate = $(event.target).parent().find('.js-event-date')
            .html();
        }
        editHtml = generateEditGiftPickedHtml(giftListName, userEventName, userEventDate);
      }
      // Populate the edit panel with the HTML, and show the panel.
      $('.js-edit-panel').show();
      $('.js-edit-panel-inner').append(editHtml);
      handleClicksWithinEditPanel();
      // for 'gifts picker' edit panel
      if ($(event.target).hasClass('js-edit-gift-picked')) {
        const newHtml = getGiftsAlreadyPicked();
        $('.js-edit-panel-gifts-picked-list').html(newHtml);
        listenForClickToAddGiftIdeaToEvent();
      }
    }
  });
}

// allows user to close edit panel (and discard changes) by hitting esc key
function listenForEscapeOnEditPanel() {
  $('body').keyup((event) => {
    if (event.which === 27) {
      hideAndWipeEditPanel();
    }
  });
}

function validateEmail(emailInput) {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
  return re.test(emailInput.toLowerCase());
}

// Kickstarts functions that rely on user json
function getDataUsingEmail(emailInput) {
  $.getJSON(`/users/${emailInput}`, (userJson) => {
    globalUserData = userJson;
    setTimeout(() => {
      loadPersonalisedPage();
    }, 50);
  });
}

function checkFormIsCompleted(firstNameInput, emailInput) {
  if (!validateName(firstNameInput)) {
    $('.js-validation-warning').text('Please ensure you have given a valid first name. \nThe name provided should be between 3 and 18 characters and must not contain whitespace (" ").');
    return false;
  } else if (!validateEmail(emailInput)) {
    $('.js-validation-warning').text('Please check that you have provided a valid email address.');
    return false;
  }
  return true;
}

// Runs validation using other functions (see below), submits registration
// and then calls getDataUsingEmail()
function handleRegistrationSubmission() {
  // <input> 'required' attribute doesn't work in some browsers when loaded asynchronously
  // So we check these fields are completed:
  const firstNameInput = $('.js-first-name-input').val().toLowerCase();
  const emailInput = $('.js-email-input').val();

  if (checkFormIsCompleted(firstNameInput, emailInput)) {
    $.ajax({
      url: '/users',
      contentType: 'application/json',
      data: JSON.stringify({
        firstName: firstNameInput,
        email: emailInput,
      }),
      success() {
      },
      error() {
        console.error('Error completing GET request for user data');
      },
      type: 'POST',
    });

    // remove login page
    resetHtml();
    // Load user's gift list!
    setTimeout(getDataUsingEmail(emailInput), 50);
  }
}

function loadRegisterHtml() {
  const registerHtml = `
        <h1>Gift Organiser For Your Google Calendar</h1>
        <h2>Register</h2>
        <form class="js-registration registration">
          <label for="firstName">First Name: </label>
          <input type="text" id="first-name" name="first name" class="js-first-name-input" required><br>
          <label for="email">Email: </label>
          <input type="text" name="email" id="email" class="js-email-input" required><br>
          <input type="submit" class="js-register-submit-button register-button">
          <button class="js-registration-back register-button">Back</button>
        </form>
        </br>
        <p class="js-validation-warning validation-warning"></p>`;
  $('.js-login-or-register').html(registerHtml);
}

function loadLoginOrRegisterHtml() {
  const loginOrRegisterHtml = `
  <h1>Gift Organiser For Your Google Calendar</h1>
  <form>
    <h2>Login</h2>
    <p class="js-login-not-found login-not-found"></p>
    <label for="email">Email: </label>
    <input type="text" id="email" name="email" class="js-email-input" required>
    <br>
    <button class="js-login-button login-register-buttons">Login</button>
  </form>
  <button class="js-register-button login-register-buttons">Register</button>
  `;
  $('.js-login-or-register').html(loginOrRegisterHtml);
}

function attemptLogin(emailInput) {
  $('.js-login-or-register').html('<p>Loading...</p>');
  if (emailInput) {
    getDataUsingEmail(emailInput);
  }
  setTimeout(() => {
    if (!globalUserData) {
      loadLoginOrRegisterHtml();
      $('.js-login-not-found').text('Please check you have typed your email correctly and try again.');
    }
  }, 1000);
}

function listenForRegistrationClicks() {
  $('.js-registration').on('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    if ($(event.target).hasClass('js-register-submit-button')) {
      handleRegistrationSubmission();
    } else if ($(event.target).hasClass('js-registration-back')) {
      resetHtml();
      loadLoginOrRegisterHtml();
    }
  });
}

// For when user clicks 'login' or 'register'
function handleLoginOrRegister() {
  $('.js-login-or-register').on('click', (event) => {
    event.preventDefault();
    // For clicks to 'login': attempt login
    if ($(event.target).hasClass('js-login-button')) {
      const emailInput = $('.js-email-input').val().toLowerCase();
      attemptLogin(emailInput);
      // For clicks to 'register': load registration page
    } else if ($(event.target).hasClass('js-register-button')) {
      loadRegisterHtml();
      listenForRegistrationClicks();
    }
  });
}

function checkUserLoggedIn() {
  // ===== Aspiration: app remembers whether user is logged in. =====
  // for now, we assume user isn't logged in:
  loadLoginOrRegisterHtml();
}

function deleteProfile() {
  $.ajax({
    url: `/users/${globalUserData.id}`,
    contentType: 'application/json',
    data: JSON.stringify({
      id: globalUserData.id,
    }),
    success() {
      resetHtml();
      checkUserLoggedIn();
    },
    error() {
      console.error('Error completing DELETE request');
    },
    type: 'DELETE',
  });
}

function handleDeleteProfile() {
  let confirmHtml = '<p>This will permanently delete your profile! Are you sure?</p>';
  confirmHtml += '<button class="js-yes-button">Yes</button>';
  confirmHtml += '<button class="js-no-button">No</button>';
  $('.js-confirm').html(confirmHtml);
  $('.js-confirm').show();
  $('.js-confirm').on('click', (event) => {
    event.preventDefault();
    if ($(event.target).hasClass('js-yes-button')) {
      deleteProfile();
      $('.js-confirm').html('').hide();
    } else if ($(event.target).hasClass('js-no-button')) {
      $('.js-confirm').html('').hide();
    }
  });
}

// Returns user to login page
function listenForClicksToHeader() {
  $('.js-personalised-header').on('click', (event) => {
    // For logging out
    if ($(event.target).hasClass('js-logout')) {
      resetHtml();
      loadLoginOrRegisterHtml();

      // for deleting user profile
    } else if ($(event.target).hasClass('js-delete-profile')) {
      handleDeleteProfile();
    }
  });
}

// on pageload
function startFunctionChain() {
  checkUserLoggedIn();
  handleLoginOrRegister();
  listenForEscapeOnEditPanel();
  listenForClicksToHeader();
  handleOpenEditPanelClicks();
}
startFunctionChain();

// For testing:
getDataUsingEmail('robertaxelkirby@gmail.com');
