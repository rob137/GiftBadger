function getDataUsingEmail(emailInput) {
  return new Promise((resolve, reject) => {
    
    $.ajax({
      url: `/users/${emailInput}`,
      success: ((response) => {
        loadPersonalisedPage(response);
        resolve();  
      }),
      dataType: 'json',
      error() {
        console.error('Error completing GET request');
        showLoginEmailValidationWarning();
        reject();
      },
      type: 'GET',
    });
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
      success: (()=> {
        $('.js-confirm').html('').hide(); 
        logout();
        resolve();
      }),
      error() {
        console.error('Error completing DELETE request');
        reject();
      },
      type: 'DELETE',
    });
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
      success(response) {;
        loadPersonalisedPage(response);
        resolve();
      },
      error() {
        console.error('Error submitting PUT request');
        return reject();
      },
      type: 'PUT',
    });
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
      success() {
      },
      error() {
        console.error('Error completing POST request for new user account - user data not received');
        return reject();
      },
      type: 'POST',
    });
    resolve();
  });
}
