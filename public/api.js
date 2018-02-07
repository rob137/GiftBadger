function getDataUsingEmail(emailInput) {
  return new Promise((resolve, reject) => {
    
    $.ajax({
      url: `/users/${emailInput}`,
      dataType: 'json',
      method: 'GET',
    })
    .done((response) => {
        loadPersonalisedPage(response);
        resolve();  
      })
    .fail(() => {
        console.error('Error completing GET request');
        showLoginEmailValidationWarning();
        reject();
      })
  });
}

function deleteProfile(editedUserData) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/users/${editedUserData.id}`,
      contentType: 'application/json',
      data: JSON.stringify({
        id: editedUserData.id,
      }),
      method: 'DELETE',
    })
    .done(()=> {
      $('.js-confirm').html('').hide(); 
      logout();
      resolve();
    })
    .fail(() => {
      console.error('Error completing DELETE request');
      reject() 
    })
  });
}

function submitAndRefresh(editedUserData) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/users/${editedUserData.id}`,
      contentType: 'application/json',
      data: JSON.stringify({
        id: editedUserData.id,
        budget: editedUserData.budget,
        giftLists: editedUserData.giftLists,
      }),
      method: 'PUT',
    })
    .done((response) => {
      loadPersonalisedPage(response);
      resolve();
    })
    .fail(() => {
      console.error('Error submitting PUT request');
      reject();
    })
  });
}

function postNewAccount(firstNameInput, emailInput) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/users',
      contentType: 'application/json',
      data: JSON.stringify({
        firstName: firstNameInput,
        email: emailInput,
      }),
      method: 'POST',
    })
    .done(() => {
      resetHtml();
      // Load user's gift list!
      getDataUsingEmail(emailInput);
      resolve()})
    .fail(() => {
        console.error('Error completing POST request for new user account - user data not received');
        showLoginEmailValidationWarning();
        loadLoginOrRegisterHtml()
        reject();
      });
  });
}
