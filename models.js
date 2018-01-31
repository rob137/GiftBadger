const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: Number },
  // giftLists is an Array... Is this ok?
  giftLists: { type: Array },
}, { collection: 'users' });

// Not added a virtual yet - could make one for giftLists.

userDataSchema.methods.serialize = function UserDataSchema() {
  return {
    id: this.id,
    firstName: this.firstName,
    email: this.email,
    budget: this.budget,
    giftLists: this.giftLists,
  };
};

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = { UserData };
