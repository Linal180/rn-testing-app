

class Post {
  constructor(id, userId, fromCity, toCity, date, maxPersons, personsJoined, fare, status) {
    this.id = id;
    this.userId = userId;
    this.fromCity = fromCity;
    this.toCity = toCity;
    this.date = date;
    this.maxPersons = maxPersons;
    this.personsJoined = personsJoined;
    this.fare = fare;
    this.status = status;
  }
}

export default Post;
