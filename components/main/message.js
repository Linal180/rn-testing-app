import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';

import Colors from '../../constants/Colors';

const MessageCmp = (props) => {
  console.log(props.message, '//////');
  const currentUserId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) =>
    state.account.accounts.filter((accnt) => accnt.userId === props.message.id)
  );
  let myMessage = false;
  if (currentUserId === props.message.id) {
    myMessage = true;
  }
  return (
    <View
      style={myMessage ? styles.myMessageContainer : styles.messageContainer}
    >
      <Image
        source={{uri: `data:image/gif;base64,${user[0].profilePicture}`}}
        style={styles.image}
      />
      <View
        style={{
          ...props.style,
          ...(myMessage ? styles.myMessageText : styles.messageText),
        }}
      >
        <Text style={{fontSize: 18}}>{props.message.messageBody}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {moment(props.message.time).format('hh:mm a')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  messageContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: 270,
    paddingTop: 5,
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    width: 270,
    paddingTop: 5,
  },
  messageText: {
    backgroundColor: 'aqua',
    height: 'auto',
    width: 'auto',
  },
  myMessageText: {
    backgroundColor: 'cornflowerblue',
    height: 'auto',
    width: 'auto',
  },
  image: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  timeContainer: {
    flexDirection: 'row-reverse',
  },
  time: {
    opacity: 0.5,
  },
});

export default MessageCmp;
