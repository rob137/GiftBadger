'use strict';

const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
	username: {type: String, required: true},
	firstName: {type: String, required: true},
	email: {type: String, required: true},
	budget: {type: Number, required: true},
	// giftLists is an Array... Is this ok?
  giftLists: {type: Array, required: true}
}, { collection : 'users' });

// Not added a virtual yet.

userDataSchema.methods.serialize = function() {
	return {
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		email: this.email,
		budget: this.budget,
		giftLists: this.giftLists	
	}
}

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = {UserData};