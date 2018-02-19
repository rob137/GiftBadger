const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: Number },
  giftLists: { type: Array },
}, { collection: 'users' });

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
