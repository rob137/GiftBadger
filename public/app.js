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

function shadePage() {
  $('.page-shader').show();
}

function unshadePage() {
  $('.page-shader').hide();
}

function hideConfirmDeletePanel() {
  $('.js-confirm').html('').hide();
}

function wipeListenerFromClass(target) {
  $(target).off('click');
}

// Strings are stored in db in lowercase, so this prepares them for insertion into GUI
function convertStringToTitleCase(str) {
  let strArr = str.split(' ');
  strArr = strArr.map(item => item.charAt(0).toUpperCase() + item.slice(1, item.length));
  return strArr.join(' ');
}

function checkEventDateIsInFuture(dateProvided) {
  const dateToTest = new Date(dateProvided);
  const now = new Date();
  return dateToTest > now;
}

function getBudget(userData) {
  // If there is no budget saved, show budget as 0
  if (userData.budget === undefined) {
    return 0;
  }
  // else show budget
  return userData.budget;
}

function generateEditBudgetHtml(userData) {
  const budget = getBudget(userData);
  return `
    <form>
      <label for="budget">Enter your budget: </label>
      <input type="number" min="0" value="${budget}" name="budget" id="budget" class="js-budget-input">
      <button class="js-submit-edit submit-edit js-submit-edit-budget">Save Changes & Close</button>
      <button class="js-cancel-edit">Discard Changes & Close</button>
      <p class="js-validation-warning validation-warning"></p>
    </form>`;
}

function generateGiftlistsLi(name) {
  const nameWithTitleCase = convertStringToTitleCase(name);
  return `<li>
            <span class="js-giftlist-name">${nameWithTitleCase}</span>
            <a href="javascript:;" alt="delete" class="js-remove remove">
              <i class="material-icons js-remove" alt="Delete">delete</i>
            </a>
            <hr class="hr-edit">
          </li>`;
}

function generateSavedEventsHtml(userData) {
  // defaults to returning an empty ul
  let ul = '<ul class="js-giftlist-name-list"></ul>';
  // if gifts are already listed, adds them to the ul
  if ($('.js-upcoming-events').length > 0) {
    const lisArr = userData.giftLists.map(x => generateGiftlistsLi(x.name));
    const lis = lisArr.join('');
    ul = `<ul class="js-giftlist-name-list">${lis}</ul>`;
  }
  return ul;
}

// Edit panel for creating gift lists - user adds names to create lists
function generateEditNewGiftListHtml(userData) {
  let editNewGiftListHtml = `
    <form>
      <p>Add the names of people you need to buy gifts for.</p>
      <label for="name">Name: </label>
      <br>
      <input type="text" name="name" id="name" class="js-giftlist-input">
      <button class="js-add-to-giftlist-name-list">Add</button>
      <p class="js-validation-warning validation-warning"></p>
      <button class="js-submit-edit submit-edit js-submit-edit-giftlist submit-edit-giftlist">Save Changes & Close</button>
      <button class="js-cancel-edit">Discard Changes & Close</button>
    </form>
    <p>People added so far: </p>`;
  const ul = generateSavedEventsHtml(userData);
  // provided there are events already saved, list them in the edit panel
  editNewGiftListHtml += ul;
  return editNewGiftListHtml;
}

function findGiftList(name, data) {
  return data.giftLists.find(item => item.name === name);
}

function createUlFromArr(arr, htmlClassName) {
  const lis = arr.join('');
  return `<ul class="${htmlClassName}">
            ${lis}
          </ul>`;
}


function generateLiWithRemoveElement(spanClass, spanText) {
  return `<li>
             <span class="${spanClass}">${spanText}</span><a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a>
             <hr class="hr-edit">
           </li>`;
}

function prepareAndGenerateGiftIdeaLi(giftIdea) {
  const spanClass = 'js-gift-idea-input';
  const spanText = convertStringToTitleCase(giftIdea);
  return generateLiWithRemoveElement(spanClass, spanText);
}

function generateGiftIdeasUl(giftList) {
  const lisArr = giftList.giftIdeas.map(giftIdea => prepareAndGenerateGiftIdeaLi(giftIdea));
  const ul = createUlFromArr(lisArr, 'gift-idea-list');
  return ul;
}

// creates editable list of gift ideas so far for the giftList
function generateEditGiftIdeasHtml(giftListName, userData) {
  const giftList = findGiftList(giftListName, userData);
  const ul = generateGiftIdeasUl(giftList);
  const giftListNameInTitleCase = convertStringToTitleCase(giftList.name);
  return `<p>Record initial ideas here to help you decide on gifts later.</p> 
          <form>
            <label for="gift-idea">Your initial gift idea for ${giftListNameInTitleCase}: </label>
            <input type="text" name="gift-idea" id="gift-idea" class="js-user-gift-idea" required>
            <button class="js-add-to-gift-idea-list">Add</button>
            <p class="js-validation-warning validation-warning"></p>
            <p class="ul-title">Gift ideas for <span class="js-giftlist-name">${giftListNameInTitleCase}</span> so far: </p> 
            ${ul}
            <button class="js-submit-edit submit-edit js-submit-edit-gift-idea-list">Save Changes & Close</button>
            <button class="js-cancel-edit">Discard Changes & Close</button><br><br>
          </form>`;
}

function makeHumanReadableDate(date) {
  const d = new Date(date);
  const output = `${weekDaysArr[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  return output;
}

function prepareAndGenerateEventLi(event) {
  const eventNameInTitleCase = convertStringToTitleCase(event.eventName);
  const date = makeHumanReadableDate(event.eventDate);
  const spanText = `${eventNameInTitleCase} on ${date}`;
  const spanClass = 'js-event-list-input';
  const li = generateLiWithRemoveElement(spanClass, spanText);
  return li;
}

// Edit panel contents for editing events within a gift list
function generateEditEventsHtml(giftListName, userData) {
  const giftList = findGiftList(giftListName, userData);
  const giftListNameInTitleCase = convertStringToTitleCase(giftList.name);
  const lisArr = giftList.events.map(event => prepareAndGenerateEventLi(event));
  const ul = createUlFromArr(lisArr, 'event-list');
  return `<form>
            <label for="event">Add an event: </label><br>
            <input type="text" name="event-name" id="event-name" class="js-user-event-name" required placeholder="Event name (e.g. Birthday)">
            <input type="date" name="event-date" value="YYYY-MM-DD" id="event-date" class="js-user-event-date" required>
            <button class="js-add-to-event-list">Add</button>
            <p class="js-validation-warning validation-warning"></p>
            <br>
            <span>Upcoming events for <span class="js-gift-list-name">${giftListNameInTitleCase}</span>: </span>
            ${ul}
            <button class="js-submit-edit submit-edit js-submit-edit-event-list">Save Changes & Close</button>
            <button class="js-cancel-edit">Discard Changes & Close</button>
          </form>`;
}

function generateGiftIdeaLi(giftIdea) {
  const giftIdeaInTitleCase = convertStringToTitleCase(giftIdea);
  return `<li>
              <span class="js-gift-idea">${giftIdeaInTitleCase}</span>
              <a href="javascript:;" class="js-give give">
                <i class="material-icons js-give give">card_giftcard</i>
              </a>
              <hr class="hr-edit">
            </li>`;
}

function generateGiftIdeaUl(giftIdeas) {
  const lisArr = giftIdeas.map(giftIdea => generateGiftIdeaLi(giftIdea));
  const ul = createUlFromArr(lisArr, 'gift-idea-list');
  return ul;
}

// Edit panel for gift picked (user record gift decisions here)
function generateEditGiftPickedHtml(giftListName, userData, eventName, eventDate, giftsPicked) {
  const giftListNameInTitleCase = convertStringToTitleCase(giftListName);
  const userEventNameInTitleCase = convertStringToTitleCase(eventName);
  const giftList = findGiftList(giftListName, userData);
  const giftIdeasUl = generateGiftIdeaUl(giftList.giftIdeas);
  return `<form>
            <h3><span class="js-gift-list-name">${giftListNameInTitleCase}</span>: <span class="js-event-header"><span class="js-event-name-edit">${userEventNameInTitleCase}</span> on <span class="js-event-date-edit">${eventDate}</span></span></h3>
            <label class="gift-picked-label" for="gift-picked">Gift to add to this event: </label>
            <br>
            <input type="text" name="gift-picked" id="gift-picked" class="js-user-gift-picked" value="" required>
            <br>
            <label class="gift-picked-label" for="gift-picked-url">Link to shopping site: </label>
            <br>
            <input type="text" placeholder="Optional" name="gift-picked-url" id="gift-picked-url" class="js-user-gift-picked-url" required>
            <br>
            <label class="gift-picked-label" for="gift-picked-price">Price (£) for this gift: </label>
            <br>
            <input type="number" name="gift-picked-price" id="gift-picked-price" class="js-user-gift-picked-price" required>
            <button class="js-add-to-gift-picked-list js-check-url">Add</button>
            <p class="js-validation-warning validation-warning"></p>
            <p>... Or choose a gift from your ideas for ${giftListNameInTitleCase} so far: </p> 
            ${giftIdeasUl}
            <p>Gifts chosen so far for this event:</p><ul class="js-edit-panel-gifts-picked-list edit-panel-gifts-picked-list">${giftsPicked}</ul>
            <button class="js-submit-edit submit-edit js-submit-edit-gift-picked">Save Changes & Close</button>
            <br>
            <button class="js-cancel-edit">Discard Changes & Close</button>
            <br>
          </form>`;
}

function handleRemoveClick(target) {
  $(target).closest('li').remove();
}

// Called when user submits an online shopping site to accompany a gift choice.
function validateUrl(input) {
  const re = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return re.test(input);
}

function hideAddedMessages(target) {
  $(target).find('.js-added-message').remove();
}

function displayAddedMessage(target) {
  $(target).after('<span class="js-added-message"><br> See the form above!</span>');
}

function insertGiftText(target, giftName) {
  console.log(target); console.log(giftName); console.log($(target).closest('div').find('.js-user-gift-picked'));
  $(target).closest('div').find('.js-user-gift-picked').val(giftName);
}

// displays page banner with user's first name
function showPersonalisedMenuHeader(name) {
  const nameInTitleCase = convertStringToTitleCase(name);
  $('.js-name').html(nameInTitleCase);
}

function generateDefaultBudgetHtml() {
  return `<h2>Your Remaining Budget</h2>
          <p>Click <a class="js-edit-budget js-edit edit-alt" href="javascript:;">here</a> to enter your budget!</p>`;
}

function getPercentage(spendSoFar, totalBudget) {
  return Math.floor((spendSoFar / totalBudget) * 100);
}

// For budget progress bar - to display percentage budget remaining
function getSpanWidthForProgressBar(percentageSpent) {
  let spanWidth = 100 - percentageSpent;
  // in case they are over budget
  if (spanWidth < 0) {
    spanWidth = 0;
  }
  return spanWidth;
}

// Runs through all gifts picked across giftlists in user's profile
function getAllGiftPrices(eventsArr) {
  return eventsArr.map(event => event.giftsPicked)
    .reduce((arrayOfGiftsObjs, giftsObj) => arrayOfGiftsObjs.concat(giftsObj), [])
    .map(giftPicked => Number(giftPicked.price))
    .reduce((priceOfGift, total) => priceOfGift + total, 0);
}

function calculateSpendSoFar(giftLists) {
  const eventsArr = giftLists
    .map(giftList => giftList.events)
    .reduce((total, amount) => total.concat(amount), []);
  const totalCost = getAllGiftPrices(eventsArr);
  return totalCost;
}


function createGoogleShoppingUrl(gift) {
  return `https://www.google.co.uk/search?tbm=shop&q=${gift}`;
}

function assignGiftLink(giftPicked) {
  // If the user has provided a specific link, use it...
  if (giftPicked.giftLink !== '') {
    return giftPicked.giftLink;
  }
  // ... else, give them a Google shopping link
  return createGoogleShoppingUrl(giftPicked.giftName);
}

function createCurrentPurchaseLi(event, giftList, giftPicked) {
  return `<li><a href="${assignGiftLink(giftPicked)}">${giftPicked.giftName} for £${giftPicked.price}</a> (${giftList.name}'s ${event.eventName} present)</li>`;
}

function getCurrentPurchasesLisForEvent(event, giftList) {
  let li;
  if (event.giftsPicked.length > 0) {
    li = event.giftsPicked.map(giftPicked => createCurrentPurchaseLi(event, giftList, giftPicked));
    return li;
  }
}

// Displays under budget to give user idea of where their money is going...
function getCurrentPurchasesLis(events, giftList) {
  let lisArr = [];
  events.map(event => lisArr.push(getCurrentPurchasesLisForEvent(event, giftList)));
  lisArr = lisArr.filter(a => a !== undefined).join('');
  return lisArr;
}

// Creates shopping list. Eg 'Cocoa Powder for £7.55 (Sarah's Birthday)'
function generateCurrentPurchasesHtml(giftLists) {
  const currentPurchasesHtml = giftLists
    .map(giftList => getCurrentPurchasesLis(giftList.events, giftList))
    .filter(lisArr => lisArr.length > 0)
    .join('')
    .replace(/,/g, '')
    // to space out the list
    .replace(/<\/a>/g, '</a><br>')
    .replace(/<\/li>/g, '</li><br>');
  return currentPurchasesHtml;
}

// Takes overall budget and prices of gifts picked to present percentage spent
function generatePersonalisedBudgetHtml(userData) {
  const totalBudget = userData.budget;
  const { giftLists } = userData;
  // Get all gift prices in user profile
  const spentSoFar = calculateSpendSoFar(giftLists);
  const percentageSpent = getPercentage(spentSoFar, totalBudget);
  const spanWidth = getSpanWidthForProgressBar(percentageSpent);
  const currentPurchasesHtml = generateCurrentPurchasesHtml(giftLists);
  const budgetHtml = `
      <h2>Your Remaining Budget</h2>
      <p>So far, you've spent £${spentSoFar} (${percentageSpent}%) of your £${totalBudget} budget.
        <a href="javascript:;">
          <span class="js-edit-budget js-edit edit">
            <i class="material-icons js-edit js-edit-budget">edit</i>
          </span>
        </a>
      </p>
      <div class="budget-meter">
        <span class="budget-span" style="width: ${spanWidth}%"></span>
      </div>
      <p>Your current shopping list:</p>
      <ul>${currentPurchasesHtml}</ul>`;
  return budgetHtml;
}

// Called by showGiftLists(). Creates and shows a budget 'progress bar' and numbers
function showBudget(userData) {
  let budgetHtml;
  // default budget is 0, so this checks user has provided a budget
  if (!userData.budget || userData.budget < 1) {
    budgetHtml = generateDefaultBudgetHtml();
  } else {
    budgetHtml = generatePersonalisedBudgetHtml(userData);
  }
  $('.js-budget').append(budgetHtml);
}

// Creates text and link for user's gift picked
function createGiftsPickedHtml(giftPicked) {
  const { giftName, giftLink, price } = giftPicked;
  const giftNameInTitleCase = convertStringToTitleCase(giftName);
  return `<br><a href="${giftLink}">${giftNameInTitleCase}</a> (£${price})`;
}

// Creates text and link for user's gift ideas
function createGiftIdeaHtml(giftIdea) {
  const shoppingUrl = createGoogleShoppingUrl(giftIdea);
  const giftIdeaInTitleCase = convertStringToTitleCase(giftIdea);
  return `<a target="_blank" href="${shoppingUrl}">${giftIdeaInTitleCase}</a>`;
}

// Google calendar url requires day and day+1
function getNextDay(inputDate) {
  const year = inputDate.getYear() + 1900;
  const month = inputDate.getMonth();
  const date = inputDate.getDate();
  return new Date(year, month, date + 1);
}

function formatDateStringForUrl(inputDate) {
  return inputDate.toISOString().slice(0, 10).replace(/-/g, '');
}

function prepareGoogleCalendarDate(eventDate) {
  const eventDatePlusOneDay = getNextDay(eventDate);
  const resultsArr = [];
  resultsArr.push(formatDateStringForUrl(eventDate));
  resultsArr.push(formatDateStringForUrl(eventDatePlusOneDay));
  return resultsArr;
}

function generateCalendarBodyTextForGifts(giftsArr, createHtmlFn) {
  const listHtmlArr = giftsArr.map(x => createHtmlFn(x));
  return listHtmlArr.join(', ');
}

// Prepares the event description for google calendar entry.
function prepareGoogleCalendarBodyText(event, giftListArrItem) {
  let calendarBodyText;
  if (event.giftsPicked.length > 0) {
    // Will either populate calendar entry with text containing links for gift(s) chosen by user...
    calendarBodyText = encodeURIComponent('You\'ve decided to get these gift(s):\n\n' +
      `${generateCalendarBodyTextForGifts(event.giftsPicked, createGiftsPickedHtml)}`);
  } else {
    // ... or with links to google shopping searches for user's gift ideas.
    calendarBodyText = encodeURIComponent('You still need to decide on a gift!\n\nGift ideas so far:\n\n' +
      `${generateCalendarBodyTextForGifts(giftListArrItem.giftIdeas, createGiftIdeaHtml)}`);
  }
  return calendarBodyText;
}

// prepares google calendar link - see var 'addToCalendarLink' for the template of the link.
function prepAddToCalendarHtml(event, giftListArrItem) {
  const eventDate = new Date(event.eventDate);
  // To get the right format for Google Calendar URLs
  const eventDateArr = prepareGoogleCalendarDate(eventDate);
  const giftListNameInTitleCase = convertStringToTitleCase(giftListArrItem.name);
  const eventNameInTitleCase = convertStringToTitleCase(event.eventName);
  let addToCalendarLink = `
    https://www.google.com/calendar/render?action=TEMPLATE&sf=true&output=xml&text=${eventNameInTitleCase}:+${giftListNameInTitleCase}&dates=${eventDateArr[0]}/${eventDateArr[1]}&details=`;
  addToCalendarLink += prepareGoogleCalendarBodyText(event, giftListArrItem);
  return `<a class="edit-alt" target="_blank" href="${addToCalendarLink}">Add reminder to your Google Calendar<br><i
  class="material-icons calendar-icon edit-alt">event</i></a><br>`;
}

function generateGiftsPickedHtml(giftPicked) {
  const giftPickedNameInTitleCase = convertStringToTitleCase(giftPicked.giftName);
  const giftLink = assignGiftLink(giftPicked);
  const giftPrice = giftPicked.price;
  return `
  <br><a target="_blank" href="${giftLink}" class="js-gift-picked">
    <span class="js-gift-picked-name">${giftPickedNameInTitleCase}</span>
  </a>
  (£<span class="js-gift-price">${giftPrice}</span>)`;
}

function serveGiftsPickedHtml(event) {
  const giftsPickedHtmlArr = event.giftsPicked.map(gift => generateGiftsPickedHtml(gift));
  return giftsPickedHtmlArr.join();
}

// inserted into html elements to make selection easy later
function generateDynamicHtmlIdentifier(event, eventDate) {
  return (`${event.eventName} ${eventDate}`)
    .toLowerCase()
    .replace(',', '')
    .replace(/ /g, '-');
}

function generateGiftPickedHtml(dynamicHtmlIdentifier, event) {
  return `<br>
          Gift(s) chosen:
            <a class="js-edit js-edit-gift-picked edit" href="javascript:;"alt="edit">
            <i class="material-icons js-edit js-edit-gift-picked">edit</i>
            </a> 
          <span id="js-${dynamicHtmlIdentifier}" class="js-id-span">${serveGiftsPickedHtml(event)}</span>
          `;
}

function prepEventsHtmlOne(dynamicHtmlIdentifier, eventNameInTitleCase, eventDate) {
  return `<li class="js-${dynamicHtmlIdentifier}"> 
           <b><span class="js-event-name">${eventNameInTitleCase}</span> on <span class="js-event-date">${eventDate}</span></b>.`;
}

function prepEventsHtmlTwo(dynamicHtmlIdentifier, event) {
  if (event.giftsPicked.length > 0) {
    // If gift(s) have already been picked, list them with associated info...
    return generateGiftPickedHtml(dynamicHtmlIdentifier, event);
  }
  return `<br>
          <span>Click <a class="js-edit js-edit-gift-picked" href="javascript:;">here</a> 
          to save a gift for this event.
          </span>`;
}

// Pulls together html displayed under the 'Upcoming Events' heading in each gift list
function generateUpcomingEventsLis(event, giftListArrItem) {
  const eventNameInTitleCase = convertStringToTitleCase(event.eventName);
  const eventDate = makeHumanReadableDate(event.eventDate);
  const dynamicHtmlIdentifier = generateDynamicHtmlIdentifier(event, eventDate);
  // we Add the following parts together to make up each event li:
  const eventsHtmlOne = prepEventsHtmlOne(dynamicHtmlIdentifier, eventNameInTitleCase, eventDate);
  let eventsHtmlTwo = prepEventsHtmlTwo(dynamicHtmlIdentifier, event);
  eventsHtmlTwo += '</li>';
  const eventsHtmlThree = prepAddToCalendarHtml(event, giftListArrItem);
  return eventsHtmlOne + eventsHtmlTwo + eventsHtmlThree;
}

// Prepares events ul for each gift list in user's profile; returns it to createGiftListsHtml()
function generateUpcomingEventsUl(giftListArrItem) {
  const upcomingEventsListHtmlArr = giftListArrItem.events
    .map(event => generateUpcomingEventsLis(event, giftListArrItem));
  const ulTags = '<ul></ul>';
  const result = ulTags.slice(0, 4) + upcomingEventsListHtmlArr.join('') + ulTags.slice(4, 9);
  return result;
}

function generateGiftListHeaderHtml() {
  return `<h2>Your Gift Lists:</h2>
          <p><a class="js-create-new-gift-list js-edit edit-alt" href="javascript:;">Add or remove people</a></p>`;
}

// A 'gift list' includes: 1. reciient's name, 2.ideas for gifts, 3. upcoming events
function generateGiftListHtml(giftListArrItem) {
  // 1: Recipient's name
  const giftListNameInTitleCase = convertStringToTitleCase(giftListArrItem.name);
  // 2: Gift ideas
  const giftIdeasHtml = giftListArrItem.giftIdeas.map(x => createGiftIdeaHtml(x)).join('<br>');
  // 3: Html for the events list:
  const upcomingEventsUl = generateUpcomingEventsUl(giftListArrItem);
  return `
      <div class="js-gift-list">
        <hr class="hr-giftlist">
        <h3>${giftListNameInTitleCase}</h3>
        <h4>Gift Ideas So Far <a href="javascript:;"><span class="js-edit-gift-ideas js-edit edit"alt="edit"><i class="material-icons js-edit-gift-ideas js-edit">edit</i></span></a></h4> 
        ${giftIdeasHtml}
        <h4>Upcoming Events <a href="javascript:;"><span class="js-edit-events js-edit edit"alt="edit"><i class="material-icons js-edit-events js-edit">edit</i></span></a></h4>
        <ul class="js-upcoming-events">
          ${upcomingEventsUl}
        </ul>
      </div>`;
}

// Returns html for user's gift lists to showGiftsLists()
function createGiftListsHtml(userData) {
  const giftListsHtmlArr = userData.giftLists
    .map(giftListArrItem => generateGiftListHtml(giftListArrItem));
  const giftListsHtml = generateGiftListHeaderHtml() + giftListsHtmlArr.join('');
  return giftListsHtml;
}

// Kickstarts the chain of functions that render user's gift lists.
function showGiftLists(userData) {
  const giftListsHtml = createGiftListsHtml(userData);
  $('.js-gift-lists').html(giftListsHtml);
  showBudget(userData);
}

// Loads iFrame for google calendar using user's email account
function showCalendar(userEmail) {
  $('.calendar')
    .html(`
      <h2>Your Google Calendar</h2>
      <p>Click <a target="_blank" href="https://calendar.google.com/calendar">here</a> to view in a separate tab</p>
      <iframe 
        class="calendar" 
        src="https://calendar.google.com/calendar/embed?src=${userEmail}" 
        style="border: 0" 
        width="500" 
        height="425" 
        frameborder="0" 
        scrolling="no"
      ></iframe>`);
}

// Recreates the unique html Id used for the event (eg 'js-birthday-1-january-2019)'
function createGiftsPickedId(target) {
  let id = '#';
  id += $(target).closest('li').find('.js-id-span').attr('id');
  return id;
}

// uses unique id to retrieve gift picked from main page
function getGiftPickedForEditPanel(target) {
  const giftPickedId = createGiftsPickedId(target);
  return $(giftPickedId).html();
}

// !!!!!
// Alters main page 'gift picked' html to be suitable for edit panel
function convertGiftsHtml(giftsPickedHtml) {
  let convertedGiftsHtml = giftsPickedHtml
    .replace(/<a target="_blank" h/g, '<li class="js-gift-picked-edit-list-item"><a target="_blank" h')
    .replace(/span>,/g, 'span>,</li>')
    .replace(/<br>/, '');
  convertedGiftsHtml += ' <a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a></span>';
  return convertedGiftsHtml;
}

function addRemoveToGiftsPickedHtml(giftsPickedHtml) {
  return giftsPickedHtml.replace(/,/g, ' <a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a>');
}

// For edit panel: takes the heading of the edit panel for 'gifts picked' and
// returns links/text of other gifts already picked
function generateGiftsPickedHtmlForEditPanel(target) {
  let giftsPickedHtml = getGiftPickedForEditPanel(target);
  // Provided the user has provided gifts, convert the Html
  if (giftsPickedHtml !== undefined && giftsPickedHtml.length > 0) {
    giftsPickedHtml = convertGiftsHtml(giftsPickedHtml);
    giftsPickedHtml = addRemoveToGiftsPickedHtml(giftsPickedHtml);
  } else {
    giftsPickedHtml = 'Nothing picked yet!';
  }
  return giftsPickedHtml;
}

function neuterButtons(event) {
  if ($(event.target).is('button') || $(event.target).is('input')) {
    event.stopPropagation();
    event.preventDefault();
  }
}

function validateName(name) {
  return name.length >= 2 && name.length <= 18;
}

function addNameToGiftListUl(usersNewGiftlistName) {
  $('.js-giftlist-name-list').prepend(generateGiftlistsLi(usersNewGiftlistName));
}

// When user enters a new name for a giftlist  and clicks 'add'
function handleAddToGiftLists() {
  const usersNewGiftlistName = $('.js-giftlist-input').val();
  if (usersNewGiftlistName !== '' && validateName(usersNewGiftlistName)) {
  // If the name is valid, add it to the list and wipe the input...
    addNameToGiftListUl(usersNewGiftlistName);
    $('.js-giftlist-input').val('');
    // ... else, warn the user
  } else {
    $('.js-validation-warning').text('Please enter a valid name.');
  }
}

// URL is optional, so we accept a valid url or a blank field
function validateNewGiftUrl(url) {
  if (url === '' || validateUrl(url)) {
    return true;
  }
  $('.js-validation-warning').text('Incomplete Url!  Please either copy-paste a valid url or leave url field blank.');
  return false;
}

function validateAddToGiftsPicked(usersNewGiftNameInTitleCase, usersNewGiftUrl, usersNewGiftPrice) {
  if (validateNewGiftUrl(usersNewGiftUrl) && usersNewGiftNameInTitleCase && usersNewGiftPrice) {
    return true;
  }
  $('.js-validation-warning').text('Please enter a gift and its price!');
  return false;
}

function generateGiftPickedEditPanelHtml(giftName, giftUrl, giftPrice) {
  return `<li class="js-gift-picked-edit-list-item">
            <a target="_blank" href="${giftUrl}">
              <span class="js-gift-picked-input js-gift-picked-name">${giftName}</span>
            </a> 
            (£<span class="js-gift-price">${giftPrice}</span>) 
            <a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a>
          </li>`;
}

function addNewGiftToUl(html) {
  // To replace the empty list message on the first 'add':
  if ($('.js-edit-panel-gifts-picked-list').text() == "Nothing picked yet!") {
    $('.js-edit-panel-gifts-picked-list').html(html);
    // else, grow the existing list
  } else {
  $('.js-edit-panel-gifts-picked-list').append(html); 
  }
}

function wipeFieldsAndWarnings() {
  $('input').val('');
  $('.js-validation-warning').text('');
}

function addGiftToList(giftName, giftUrl, giftPrice) {
  // Then check the other fields and add relevant html, and wipe the input fields
  const newGiftPickedHtml = generateGiftPickedEditPanelHtml(giftName, giftUrl, giftPrice);
  addNewGiftToUl(newGiftPickedHtml);
}

// If user doesn't give a url, make google shopping search url with giftname
function populateEmptyUrl(giftUrl, giftName) {
  if (giftUrl === '') {
    return createGoogleShoppingUrl(giftName);
  }
  return giftUrl;
}

// When user clicks 'add' in edit panel for gifts picked
function handleAddToGiftsPicked() {
  const giftName = convertStringToTitleCase($('.js-user-gift-picked').val());
  const giftUrl = $('.js-user-gift-picked-url').val();
  const giftPrice = $('.js-user-gift-picked-price').val();
  if (validateAddToGiftsPicked(giftName, giftUrl, giftPrice)) {
    const finalUrl = populateEmptyUrl(giftUrl, giftName);
    addGiftToList(giftName, finalUrl, giftPrice);
    wipeFieldsAndWarnings();
  }
}

function generateNewGiftIdeaHtml(usersNewGiftIdea) {
  return `<li>
            <span class="js-gift-idea-input">${usersNewGiftIdea}</span>
            <a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a>
            <hr class="hr-edit">
          </li>`;
}

function addNewGiftIdea(usersNewGiftIdea) {
  const usersNewGiftIdeaHtml = generateNewGiftIdeaHtml(usersNewGiftIdea);
  $('.gift-idea-list').prepend(usersNewGiftIdeaHtml);
}

function showGiftIdeaValidationWarning() {
  $('.js-validation-warning').text('Please enter a gift idea!');
}

// When user clicks 'add' in edit panel for gift ideas
function handleAddToGiftIdeas() {
  const usersNewGiftIdea = convertStringToTitleCase($('.js-user-gift-idea').val());
  if (usersNewGiftIdea.length > 0) {
    addNewGiftIdea(usersNewGiftIdea);
    wipeFieldsAndWarnings();
  } else {
    showGiftIdeaValidationWarning();
  }
}

function generateNewEventHtmlForEditPanel() {
  const userEventName = convertStringToTitleCase($('.js-user-event-name').val());
  const userEventDate = makeHumanReadableDate($('.js-user-event-date').val());
  return `<li>
            <span class="js-event-list-input">${userEventName} on ${userEventDate}</span> 
            <a href="javascript:;" class="js-remove remove"><i class="material-icons js-remove">delete</i></a>
          </li>`;
}

function addNewEvent() {
  const eventHtml = generateNewEventHtmlForEditPanel();
  $('.event-list').append(eventHtml);
}


function showAddEventValidationWarning() {
  $('.js-validation-warning').text('Please enter an event name and future date!');
}

// Checks the event text is non-empty and in future
function validateAddEvent() {
  if ($('.js-user-event-name').val() && checkEventDateIsInFuture($('.js-user-event-date').val())) {
    return true;
  }
  return false;
}

function handleAddToEventsList() {
  if (validateAddEvent()) {
    addNewEvent();
    wipeFieldsAndWarnings();
  } else {
    showAddEventValidationWarning();
  }
}

// When user clicks to add a gift idea to 'gift picked' input form
function handleGiveClick(target) {
  const giftName = $(target).parent().siblings('.js-gift-idea').text();
  const closestDiv = $(target).closest('div');
  // Hides previous 'Added - see above!' message and adds a new one to target.
  hideAddedMessages(closestDiv);
  displayAddedMessage(target);
  // Puts gift name into input box
  insertGiftText(target, giftName);
  // Scroll to top
  $('.edit-panel').animate({ scrollTop: 0 }, 'fast');
}

// When user clicks 'save & close' on edit panel for budget
function saveChangesToBudget(userData) {
  const newBudget = $('.js-budget-input').val();
  const editedUserData = userData;
  editedUserData.budget = newBudget;
  return editedUserData;
}

function locateObjectInArrayByValue(array, key, value) {
  return array.find(obj => obj[key] === value);
}

function findObjIndex(array, key, value, userData) {
  const targetObj = locateObjectInArrayByValue(array, key, value);
  return userData.giftLists.indexOf(targetObj);
}

function findObjIndexFromClassText(array, key, className, userData) {
  const classText = $(className).text();
  return findObjIndex(array, key, classText, userData);
}

function removeItemAtIndexFromArr(i, arr) {
  if (i < 1) {
    arr.shift();
  } else {
    arr.splice(i, i);
  }
  return arr;
}

function deleteRemovedNameFromDb(namesInPanel, nameInDb, editedUserData) {
  // If a name is in db but not in edit panel, delete from db
  if (namesInPanel.indexOf(nameInDb) < 0) {
    const i = findObjIndex(editedUserData.giftLists, 'name', nameInDb, editedUserData);
    editedUserData.giftLists = removeItemAtIndexFromArr(i, editedUserData.giftLists);
  }
  return editedUserData;
}

// Checks names in edit panel against names in db
function deleteNamesRemovedFromEditPanel(namesInPanel, namesInUserData, editedUserData) {
  namesInUserData
    .map(nameInDb => deleteRemovedNameFromDb(namesInPanel, nameInDb, editedUserData));
  return editedUserData;
}


function createNewGiftList(nameInEditPanel, currentNamesInDbArr, editedUserData) {
  // if it's not in the db, then add it
  if (!(currentNamesInDbArr.indexOf(nameInEditPanel) > -1)) {
    return new GiftList(nameInEditPanel);
  }
  // If the object is in the DB, return it
  return locateObjectInArrayByValue(editedUserData.giftLists, 'name', nameInEditPanel);
}

// If a name is in edit panel but not in db, save to db
function saveNamesAddedToEditPanel(namesInPanel, namesInUserData, editedUserData) {
  a = namesInPanel
    .map(nameInEditPanel => createNewGiftList(nameInEditPanel, namesInUserData, editedUserData));
  editedUserData.giftLists = a;
  return editedUserData;
}

function createArrOfNamesInUserData(userData) {
  // If there are names in DB, return them.
  if (userData.giftLists[0] !== null) {
    return userData.giftLists.map(x => x.name);
  }
  // Otherwise an empty array will do.
  return [];
}

// Makes an array of elements' text
function createArrFromHtmlClass(className) {
  return $(className)
    .map((object, element) => $(element).text())
    .get();
}

// When user clicks 'save' on edit panel for giftlists
function saveChangesToGiftlists(userData) {
  const namesInPanel = createArrFromHtmlClass('.js-giftlist-name');
  const namesInUserData = createArrOfNamesInUserData(userData);
  let editedUserData = userData;
  editedUserData = deleteNamesRemovedFromEditPanel(namesInPanel, namesInUserData, editedUserData);
  editedUserData = saveNamesAddedToEditPanel(namesInPanel, namesInUserData, editedUserData);
  return editedUserData;
}


// When user clicks 'save and close' on edit panel for gift ideas
function saveChangesToGiftIdeas(userData) {
  const i = findObjIndexFromClassText(userData.giftLists, 'name', '.js-giftlist-name', userData);
  const newGiftIdeaArr = createArrFromHtmlClass('.js-gift-idea-input');
  const editedData = userData;
  editedData.giftLists[i].giftIdeas = newGiftIdeaArr;
  return editedData;
}

// See next comment
function makeEventDateArrFromString(string) {
  const eventDateArr = string.split(' on ');
  const eventDateObjArr = new Event(eventDateArr);
  return eventDateObjArr;
}

// Takes the edit panel text describing each event and uses it to make new event objects
function createNewEventListObjArr() {
  const newEventListArr = createArrFromHtmlClass('.js-event-list-input');
  return newEventListArr.map(string => makeEventDateArrFromString(string));
}

// When user clicks 'submit & close' on edit panel for events
function saveChangesToEventList(userData) {
  const newEventListObjArr = createNewEventListObjArr();
  const i = findObjIndexFromClassText(userData.giftLists, 'name', '.js-gift-list-name', userData);
  const editedData = userData;
  editedData.giftLists[i].events = newEventListObjArr;
  return editedData;
}

function getGiftPickedName(html) {
  return $(html).find('.js-gift-picked-name').text();
}

function getGiftPickedUrl(html) {
  const aElement = $(html).html();
  return $(aElement).attr('href');
}

function getGiftPickedPrice(html) {
  return $(html).find('.js-gift-price').text();
}

// To feed into GiftPicked object constructor
function prepareGiftsPickedDataArr(html) {
  const giftPickedName = getGiftPickedName(html);
  const giftPickedUrl = getGiftPickedUrl(html);
  const giftPickedPrice = getGiftPickedPrice(html);
  return [giftPickedName, giftPickedUrl, giftPickedPrice];
}

// For adding to userData under a specific gift-giving event
function createGiftsPickedObject(html) {
  const giftsPickedDataArr = prepareGiftsPickedDataArr(html);
  return new GiftPicked(giftsPickedDataArr);
}

function createNewGiftsPickedArr() {
  return $('.js-gift-picked-edit-list-item')
    .map((object, html) => createGiftsPickedObject(html)).get();
}

function getEventsIndex(i, userData, targetEvent) {
  let j = userData.giftLists[i].events.indexOf(targetEvent);
  // if there are no items already stored
  if (j < 0) {
    j = 0;
  }
  return j;
}

// to enable saving changes to gifts picked - gifts picked are stored under events
function findTargetEvent(i, userData) {
  const eventName = $('.js-event-name-edit').text();
  const eventDate = new Date($('.js-event-date-edit').text()).toString();
  return userData.giftLists[i].events
    .find(event => event.eventName === eventName && event.eventDate === eventDate);
}

// gifts picked are stored in event objs - so this tracks down event obj
function saveChangesToGiftsPicked(userData) {
  const i = findObjIndexFromClassText(userData.giftLists, 'name', '.js-gift-list-name', userData);
  const targetEvent = findTargetEvent(i, userData);
  const j = getEventsIndex(i, userData, targetEvent);
  const newGiftsPickedArr = createNewGiftsPickedArr();
  const editedData = userData;
  editedData.giftLists[i].events[j].giftsPicked = newGiftsPickedArr;
  return editedData;
}

// Router for clicks to 'save and close' - redirects to appropriate save functions
function routeEditSubmit(target, userData) {
  let editedData;
  showLoadingMessage();
  if ($(target).hasClass('js-submit-edit-budget')) {
    editedData = saveChangesToBudget(userData);
  } else if ($(target).hasClass('js-submit-edit-giftlist')) {
    editedData = saveChangesToGiftlists(userData);
  } else if ($(target).hasClass('js-submit-edit-gift-idea-list')) {
    editedData = saveChangesToGiftIdeas(userData);
  } else if ($(target).hasClass('js-submit-edit-event-list')) {
    editedData = saveChangesToEventList(userData);
  } else if ($(target).hasClass('js-submit-edit-gift-picked')) {
    editedData = saveChangesToGiftsPicked(userData);
  } else {
    console.error('Submission type error!');
    return userData;
  }
  return editedData;
}

function hideAndWipeEditOrConfirmPanel(userData) {
  $('.js-edit-panel').off();
  $('.js-edit-panel').hide();
  $('.js-edit-panel-inner').html('');
  hideConfirmDeletePanel();
  wipeListenerFromClass('main');
  listenForOpenEditPanelClicks(userData);
}

function handleEditSubmit(target, userData) {
  // user data will be edited and resubmitted as alteredUserData
  // Pick the right save function depending on state of DOM
  const editedUserData = routeEditSubmit(target, userData);
  // Submit changes to DB and render new data in html
  submitAndRefresh(editedUserData);
  hideAndWipeEditOrConfirmPanel(userData);
}

// Routes clicks in edit panel to appropriate handlers
function routeClicksWithinEditPanel(event, userData) {
  // Clicks to 'add' in 'edit giftlists' panel (must be non-empty)
  if ($(event.target).hasClass('js-add-to-giftlist-name-list')) {
    handleAddToGiftLists();
    // Clicks to 'add' in 'gift picked' panel
  } else if ($(event.target).hasClass('js-add-to-gift-picked-list')) {
    handleAddToGiftsPicked();
    // Clicks to 'save and close'
  } else if ($(event.target).hasClass('js-submit-edit')) {
    handleEditSubmit(event.target, userData);
    // Clicks to 'discard and close'
  } else if ($(event.target).hasClass('js-cancel-edit')) {
    hideAndWipeEditOrConfirmPanel(userData);
    unshadePage();
    // Clicks to 'Add' button to add a gift idea
  } else if ($(event.target).hasClass('js-add-to-gift-idea-list')) {
    handleAddToGiftIdeas();
    // Clicks to 'Add' button to add changes to event list
  } else if ($(event.target).hasClass('js-add-to-event-list')) {
    handleAddToEventsList();
    // Clicks to 'remove' <a> tags shown at the end of each Li for existing data
  } else if ($(event.target).hasClass('js-remove')) {
    handleRemoveClick(event.target);
    // Clicks to 'Give this gift' <a> tags next list of gift ideas.
  } else if ($(event.target).hasClass('js-give')) {
    handleGiveClick(event.target);
  }
}

// Handles clicks in edit panel (add, save, cancel etc)
function handleClicksWithinEditPanel(event, userData) {
  neuterButtons(event);
  routeClicksWithinEditPanel(event, userData);
}

// listener for all clicks in edit panel. See routeClicksWithinEditPanel(), above
function listenForClicksWithinEditPanel(userData) {
  $('.edit-panel').on('click', (event) => {
    handleClicksWithinEditPanel(event, userData);
  });
}

function getUserEventName(event) {
  if ($(event.target).parent().find('.js-event-name').text() === '') {
    return $(event.target).parent().parent().find('.js-event-name')
      .html();
  }
  return $(event.target).parent().find('.js-event-name').html();
}

function getUserEventDate(event) {
  if ($(event.target).parent().find('.js-event-name').text() === '') {
    return $(event.target).parent().parent().find('.js-event-date')
      .html();
  }
  return $(event.target).parent().find('.js-event-date')
    .html();
}

// Gets the event name from the dom - used to look up event object in json
// For events that do not have gifts picked already
function prepareEditGiftPickedHtml(event, listName, userData) {
  const eventName = getUserEventName(event);
  const eventDate = getUserEventDate(event);
  const giftsAlreadyPicked = generateGiftsPickedHtmlForEditPanel(event.target);
  return generateEditGiftPickedHtml(listName, userData, eventName, eventDate, giftsAlreadyPicked);
}

function handleClickToEditGiftPickedHtml(event, giftListName, userData) {
  const editPanelHtml = prepareEditGiftPickedHtml(event, giftListName, userData);
  return editPanelHtml;
}

function showEditPanel(editHtml) {
  $('.js-edit-panel').show();
  $('.js-edit-panel-inner').append(editHtml);
  shadePage();
}

function handleOpenEditPanelClicks(event, userData) {
  let editHtml = '';
  // First resets the edit panel - in case panel is already open
  hideAndWipeEditOrConfirmPanel(userData);
  // Then get the appropriate edit panel html...
  const giftListName = $(event.target).closest('.js-gift-list').find('h3').text();
  // For changing budget:
  if ($(event.target).hasClass('js-edit-budget')) {
    editHtml = generateEditBudgetHtml(userData);
    // For adding a new gift list:
  } else if ($(event.target).hasClass('js-create-new-gift-list')) {
    editHtml = generateEditNewGiftListHtml(userData);
    // For changing gift ideas:
  } else if ($(event.target).hasClass('js-edit-gift-ideas')) {
    editHtml = generateEditGiftIdeasHtml(giftListName, userData);
    // For changing upcoming events:
  } else if ($(event.target).hasClass('js-edit-events')) {
    editHtml = generateEditEventsHtml(giftListName, userData);
    // For changing gifts picked for a particular event
  } else if ($(event.target).hasClass('js-edit-gift-picked')) {
    editHtml = handleClickToEditGiftPickedHtml(event, giftListName, userData);
  }
  // ... And finally uses the appropriate html to populate the edit panel
  showEditPanel(editHtml);
  listenForClicksWithinEditPanel(userData);
}


// Called on pageload. The edit panel is hidden & blank until user clicks an edit option.
function listenForOpenEditPanelClicks(userData) {
  $('main').on('click', (event) => {
    if ($(event.target).hasClass('js-edit')) {
      handleOpenEditPanelClicks(event, userData);
    }
  });
}

// allows user to close panels/menus (and discard changes) by hitting esc key
function closeMenusOnEsc(userData) {
  $('body').keyup((event) => {
    if (event.which === 27) {
      hideAndWipeEditOrConfirmPanel(userData);
      hideLoadingMessage();
      unshadePage();
      hideDropDownMenu();
    }
  });
}

function closeDropDownMenuOnClickElsewhere() {
  $(window).click((event) => {
    const isBurger = checkTargetIsBurgerIcon(event);
    // If the user clicks on something other than the burger or drop-down-menu...
    if (!isBurger && !$(event.target).closest('nav').hasClass('js-nav-drop-down-menu')) {
      hideDropDownMenu();
    }
  });
}

// Wipes all dynamically loaded html from DOM
function resetHtml(userData) {
  $('.js-personalised-header').html('');
  $('.js-login-or-register').html('');
  $('.js-budget').html('');
  $('.js-gift-lists').html('');
  $('.js-calendar').html('');
  $('.js-burger-icon').hide();
  hideAndWipeEditOrConfirmPanel(userData);
}

function generateConfirmDeleteHtml() {
  return `<p>This will permanently delete your profile!<br>Are you sure?</p>
          <button class="js-yes-button yes-no-button">Yes</button> 
          <button class="js-no-button yes-no-button">No</button>`;
}

// When user clicks 'delete profile'
function showConfirmDeletePanel() {
  const confirmHtml = generateConfirmDeleteHtml();
  $('.js-confirm').html(confirmHtml);
  $('.js-confirm').show();
  shadePage();
}

// !!!!! Involve promises
function handleConfirmDeleteProfile(userData) {
  deleteProfile(userData);
}

function handleDeleteProfile(userData) {
  showConfirmDeletePanel();
  $('.js-confirm').on('click', (event) => {
    event.preventDefault();
    if ($(event.target).hasClass('js-yes-button')) {
      hideConfirmDeletePanel();
      showLoadingMessage();
      handleConfirmDeleteProfile(userData);
    } else if ($(event.target).hasClass('js-no-button')) {
      hideConfirmDeletePanel();
      hideLoadingMessage();
    }
  });
}

function loadLoginOrRegisterHtml() {
  const loginOrRegisterHtml = `
  <div class="login-or-register-container">
  <nav>
      <a class="nav-tab js-login-nav-tab nav-tab-selected" href="javascript:;"><h3 class="js-login-nav-tab">Login</h3>
      </a><a class="nav-tab js-register-nav-tab" href="javascript:;"><h3 class="js-register-nav-tab">Register</h3></a>
  </nav>
  <form class="login-or-register-form">
    <label class="login-register-label" for="email-input">Email: </label>
    <input type="text" id="email-input" name="email" class="js-email-input" required
    ><button class="js-login-button login-button login-register-buttons">Login</button
    ><p class="js-login-not-found login-not-found login-register-error"></p>
  </form>
  </div>
  `;
  $('.js-login-or-register').html(loginOrRegisterHtml);
  hideLoadingMessage();
}


function revealLoginOrRegister() {
  $('.js-login-or-register').show();
  $('main').hide();
}

function revealMain() {
  $('main').show();
  $('.js-login-or-register').hide();
}

function showBurgerIcon() {
  $('.burger-icon').show();
}

function hideBurgerIcon() {
  $('.burger-icon').hide();
}

// From hamburger icon in top right of UI
function hideDropDownMenu() {
  $('.nav-drop-down-menu-contents').hide();
}
function showDropDownMenu() {
  $('.nav-drop-down-menu-contents').show();
}
function toggleDropDownMenu() {
  $('.nav-drop-down-menu-contents').toggle(); 
}


function checkTargetIsBurgerIcon(event) {
  if ($(event.target).hasClass('js-burger-icon')) {
    return true;
  }
  return false;
}

// Displays/hides drop-down menu
function listenForClicksToBurgerIcon() {
  $('.banner').on('click', (event) => {
    const isBurger = checkTargetIsBurgerIcon(event)
    if (isBurger && $('.nav-drop-down-menu-contents').is(':visible')) {
      hideDropDownMenu();
    } else if (isBurger) {
      showDropDownMenu();
    }
  });
}

function logout(userData) {
  hideAndWipeEditOrConfirmPanel();
  resetHtml(userData);
  hideBurgerIcon();
  loadLoginOrRegisterHtml();
  revealLoginOrRegister();
  hideDropDownMenu();
}

function listenForClicksToDropDownMenu(userData) {
  $('.js-drop-down-menu-li').on('click', (event) => {
    if ($(event.target).hasClass('js-logout')) {
      showLoadingMessage();
      logout(userData);
      // for deleting user profile
    } else if ($(event.target).hasClass('js-delete-profile')) {
      showLoadingMessage();
      hideDropDownMenu();
      handleDeleteProfile(userData);
    }
  });
}

function generateMainNavHtml() {
  return `<a class="nav-tab js-giftlist-nav-tab nav-tab-selected" href="javascript:;"><h3 class="js-giftlist-nav-tab">Gift Lists</h3>
          </a><a class="nav-tab js-budget-nav-tab" href="javascript:;"><h3 class="js-budget-nav-tab">Budget</h3>
          <a class="nav-tab js-calendar-nav-tab" href="javascript:;"><h3 class="js-calendar-nav-tab">Calendar</h3></a></a>`;
}

function showMainNav() {
  const mainNavHtml = generateMainNavHtml();
  $('.js-main-nav').html(mainNavHtml);
}

function presentGiftListPage() {
  $('.js-gift-lists').show();
  $('.js-budget').hide();
  $('.js-calendar').hide();
}

function presentBudgetPage() {
  $('.js-gift-lists').hide();
  $('.js-budget').show();
  $('.js-calendar').hide();
}

function presentCalendarPage() {
  $('.js-gift-lists').hide();
  $('.js-budget').hide();
  $('.js-calendar').show();
}

function highlightCurrentNavTab(event) {
  $('.nav-tab-selected').removeClass('nav-tab-selected');
  const navTabClicked = $(event.target).closest('a');
  $(navTabClicked).addClass('nav-tab-selected');
}

function listenForMainNavClicks() {
  $('.js-main-nav').on('click', (event) => {
    if ($(event.target).hasClass('js-giftlist-nav-tab')) {
      presentGiftListPage();
    } else if ($(event.target).hasClass('js-budget-nav-tab')) {
      presentBudgetPage();
    } else if ($(event.target).hasClass('js-calendar-nav-tab')) {
      presentCalendarPage();
    }
    highlightCurrentNavTab(event);
  });
}

// Called by GET request on success
function loadPersonalisedPage(userData) {
  resetHtml(userData);
  revealMain();
  showBurgerIcon();
  showMainNav();
  listenForMainNavClicks();
  showPersonalisedMenuHeader(userData.firstName);
  showGiftLists(userData);
  presentGiftListPage();
  listenForOpenEditPanelClicks(userData);
  showCalendar(userData.email);
  listenForClicksToDropDownMenu(userData);
  hideLoadingMessage();
}

function validateEmail(emailInput) {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|co\.uk|org\.uk|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
  return re.test(emailInput.toLowerCase());
}

function checkRegistrationFormIsCompleted(firstNameInput, emailInput) {
  if (!validateName(firstNameInput)) {
    $('.js-validation-warning').text('Please ensure you have given a valid first name.');
    return false;
  } else if (!validateEmail(emailInput)) {
    $('.js-validation-warning').text('Please ensure you have given a valid email address.');
    return false;
  }
  return true;
}

// Runs validation using other functions (see below), submits registration
// and then calls getDataUsingEmail()
function handleRegistrationSubmission() {
  const firstNameInput = $('.js-first-name-input').val().toLowerCase();
  const emailInput = $('.js-email-input').val();
  if (checkRegistrationFormIsCompleted(firstNameInput, emailInput)) {
    showLoadingMessage();
    postNewAccount(firstNameInput, emailInput);
    // remove login page
    resetHtml();
    // Load user's gift list!
    getDataUsingEmail(emailInput);
  }
}

function loadRegisterHtml() {
  const registerHtml = `
        <div class="login-or-register-container">
        <nav class="nav-tabs">
          <a class="nav-tab js-login-nav-tab" href="javascript:;"><h3 class="js-login-nav-tab">Login</h3>
          </a><a class="nav-tab js-register-nav-tab nav-tab-selected" href="javascript:;"><h3 js-register-nav-tab>Register</h3></a>
        </nav>
        <form class="js-registration registration login-or-register-form">
          <label class="login-register-label" for="firstName">First Name: </label>
          <input type="text" id="first-name" name="first name" class="js-first-name-input" required><br>
          <label class="login-register-label" for="email">Email: </label
          ><input type="text" name="email" id="email" class="js-email-input" required
          ><button class="js-register-submit-button register-button login-register-buttons">Register</button>
          <p class="js-validation-warning validation-warning login-register-error"></p>
        </form>
        </div>
        `;
  $('.js-login-or-register').html(registerHtml);
}

// uses appearance of 'Delete your profile' as proof that user profile has loaded
function checkPersonalisedPageHasLoaded() {
  if ($('.js-delete-profile').length > 0) {
    return true;
  }
  return false;
}

function showLoadingMessage() {
  shadePage();
  $('.js-loading-message').html('<p>Loading...</p>');
  $('.js-loading-message').show();
}

function hideLoadingMessage() {
  unshadePage();
  $('.js-loading-message').hide();
  $('.js-loading-message').html('');
  
}

function showLoginEmailValidationWarning() {
  $('.js-login-not-found').text('Please ensure you have given a valid email address.');
  hideLoadingMessage();
}

function attemptLogin(emailInput) {
  if (validateEmail(emailInput)) {
    getDataUsingEmail(emailInput);
  }
  // If the user profile doesn't appear in 1 second, show login page with 'bad login' message
  setTimeout(() => {
    if (!checkPersonalisedPageHasLoaded()) {
      loadLoginOrRegisterHtml();
      showLoginEmailValidationWarning();
    }
  }, 1000);
}

function checkEmail(emailInput) {
  if (validateEmail(emailInput)) {
    attemptLogin(emailInput);
  } else {
    showLoginEmailValidationWarning();
  }
}

function listenForRegistrationClicks() {
  $('.js-registration').on('click', (event) => {
    neuterButtons(event);
    if ($(event.target).hasClass('js-register-submit-button')) {
      handleRegistrationSubmission();
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
      showLoadingMessage();
      checkEmail(emailInput);
      // For clicks to 'register': load registration page
    } else if ($(event.target).hasClass('js-register-nav-tab')) {
      loadRegisterHtml();
      listenForRegistrationClicks();
    } else if ($(event.target).hasClass('js-login-nav-tab')) {
      loadLoginOrRegisterHtml();
    }
  });
}

function checkUserLoggedIn() {
  // ===== Aspiration: app remembers whether user is logged in. =====
  // for now, we assume user isn't logged in:
  loadLoginOrRegisterHtml();
}

// on pageload
function startFunctionChain() {
  hideBurgerIcon();
  checkUserLoggedIn();
  listenForClicksToBurgerIcon();
  unshadePage();
  hideLoadingMessage();
  handleLoginOrRegister();
  closeMenusOnEsc();
  closeDropDownMenuOnClickElsewhere();
}
startFunctionChain();

// getDataUsingEmail('robertaxelkirby@gmail.com');
