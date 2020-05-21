import React from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import moment from 'moment';
import Colors from '../../constants/Colors';

const Chat = (props) => {
  let TouchableCmp = TouchableOpacity;
  const currentUserId = useSelector((state) => state.auth.userId);
  const other = props.chat.users.filter((id) => id !== currentUserId);
  const senderId = other[0];

  const senderData = useSelector((state) =>
    state.account.accounts.filter((accnt) => accnt.userId === senderId)
  );

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.chat}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={{uri: `data:image/gif;base64,${senderData[0].profilePicture}` }}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {senderData[0].firstName} {senderData[0].lastName}
              </Text>
              <View style={styles.messageDetail}>
                <Text style={styles.message}>
                  {
                    props.chat.messages[props.chat.messages.length - 1]
                      .messageBody
                  }
                </Text>
                <Text style={styles.message}>
                  {moment(
                    props.chat.messages[props.chat.messages.length - 1].time
                  ).format('hh:mm a')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};
// avatar
// Full Name
const styles = StyleSheet.create({
  chat: {
    // flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 80,
    margin: 10,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  image: {
    marginLeft: 15,
    marginTop: 12,
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  nameContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
    paddingBottom: 0,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 12,
    opacity: 0.35,
    color: '#000',
  },
  messageDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%'
  },
});

export default Chat;
