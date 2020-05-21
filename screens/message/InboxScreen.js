import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';

import * as chatActions from '../../store/actions/chat';
import Chat from '../../models/chat';
import Message from '../../models/message';
import MessageCmp from '../../components/main/message';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const InboxScreen = (props) => {
  const chatId = props.navigation.getParam('chatId');
  const [message, setMessage] = useState('');
  const currentUserId = useSelector((state) => state.auth.userId);
  const chat = useSelector((state) =>
    state.chat.chats.filter((chat) => chat.id === chatId)
  );
  const otherId = chat[0].users.filter((id) => id !== currentUserId);
  const otherUser = useSelector((state) =>
    state.account.accounts.filter((accnt) => accnt.userId === otherId[0])
  );

  const dispatch = useDispatch();
  const inputChangeHandler = (text) => {
    setMessage(text);
  };

  const sendMessageHandler = async () => {
    try {
      if (message === '') {
        return;
      }
      let updatedChat = new Chat(
        chat[0].id,
        chat[0].users,
        chat[0].messages.concat(
          new Message(currentUserId, message, new Date())
        ),
        chat[0].date
      );
      await dispatch(chatActions.sendMessage(updatedChat));
      setMessage('');
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Sending Failed', error.message, [{text: 'Okay'}]);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        // style={{flex: 1}}
        behavior={null}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.outer_holder}>
            
              <ScrollView contentContainerStyle={styles.list}>
                <View style={styles.messagesSection}>
                  {chat[0].messages.map((msg) => (
                    <MessageCmp
                      key={msg.time}
                      style={styles.message}
                      message={msg}
                    />
                  ))}
                </View>
              </ScrollView>
            <View style={styles.inputContainer}>
              <View style={styles.sendMessage}>
                <TextInput
                  placeholder="type message here.."
                  style={styles.textInput}
                  value={message}
                  onChangeText={inputChangeHandler}
                />
                <Ionicons
                  name={Platform.OS === 'android' ? 'md-send' : 'ios-send'}
                  size={30}
                  onPress={sendMessageHandler}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  screen: {
    width: screenWidth,
    height: screenHeight,
    flex: 1,
  },
  //   messageContainer: {
  //     flexDirection: 'column',
  //   },
  message: {
    padding: 17,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 20,
    height: 55,
    margin: 2,
  },

  outer_holder: {
    height: '100%',
  },
  textInput: {
    height: 50,
    width: 350,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  sendMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  list: {
    flexGrow: 1,
    // alignItems: "center",
    justifyContent: 'flex-end',
  },
  messagesSection: {
    flex: 1,
    height: '100%',
    marginBottom: '15%',
    justifyContent: 'flex-end'
  },
});

export default InboxScreen;
