import moment from 'moment';

class Message {
  constructor(id, messageBody, time) {
    this.id = id;
    this.messageBody = messageBody;
    this.time = time;
  }
  get readableDate() {
    return moment(this.time).format('hh:mm');
  }
}

export default Message;
