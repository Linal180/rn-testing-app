import moment from 'moment';
class Chat {
    constructor(id, users, messages, date) {
        this.id = id;
        this.users = users;
        this.messages = messages;
        this.date = date;
    }
    
  get readableDate(){
    return moment(this.date).format('hh:mm, MMMM Do YYYY');
  }
};

export default Chat;