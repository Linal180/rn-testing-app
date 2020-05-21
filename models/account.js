class Account {
  constructor(id, idToken, userId, email, password, firstName, lastName, profilePicture) {
    this.id = id;
    this.idToken = idToken;
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profilePicture = profilePicture;
  }
}

export default Account;
