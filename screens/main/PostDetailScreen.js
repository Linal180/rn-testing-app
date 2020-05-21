import React, {useState, useCallback, useEffect} from 'react';
import {
  Veiw,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  View,
  FlatList,
  Alert,
  Platform,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import moment from 'moment';

import Colors from '../../constants/Colors';
import TravellingPersons from '../../components/UI/TravellingPersons';
import * as postsActions from '../../store/actions/post';
import * as chatActions from '../../store/actions/chat';
import Chat from '../../models/chat';
import Message from '../../models/message';

const PostDetailScreen = (props) => {
  const [message, setMessage] = useState('');
  const [openInbox, setOpenInbox] = useState(false);
  const [joinedList, setJoinedList] = useState(false);

  const postId = props.navigation.getParam('postId');

  let selectedPost = useSelector((state) =>
    state.posts.availablePosts.find((post) => post.id === postId)
  );
  const chats = useSelector((state) => state.chat.chats);
  const currentUserId = useSelector((state) => state.auth.userId);
  const creatorId = selectedPost.userId;
  const creator = useSelector((state) =>
    state.account.accounts.filter((accnt) => accnt.userId == creatorId)
  );
  const currentUser = useSelector((state) => state.account.userAccount);
  const userPosts = useSelector((state) => state.posts.userPosts);

  let TouchableCmp = TouchableWithoutFeedback;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  let today = moment().format('LL');
  console.log(today, 'Today');
  if (moment(selectedPost.date).diff(today, 'days') < 0) {
    console.log('post is expired1', moment(selectedPost.date));
    console.log(moment(selectedPost.date).diff(today, 'days'), 'diff');
  } else {
    console.log('post is comming soon');
    console.log(moment(selectedPost.date).diff(today, 'days'), 'diff');
  }

  let isMyPost = false;
  userPosts.filter((post) => {
    if (post.id === postId) {
      isMyPost = true;
    }
  });

  let newChat = true;
  let chatId;

  chats.filter((chat) => {
    for (let key in chat.users) {
      if (chat.users[key] === creatorId) {
        newChat = false;
        chatId = chat.id;
      }
    }
  });
  let a = moment(selectedPost.date);
  let b = moment(new Date());

  console.log(a, '----', b, '=============', b.diff(a, 'month') + 1);

  const chat = chats.filter((chat) => chat.id === chatId);

  const joinedPersonsList = selectedPost.personsJoined;

  const dispatch = useDispatch();

  const joinHandler = () => {
    if (selectedPost.maxPersons > selectedPost.personsJoined.length) {
      for (const ind in selectedPost.personsJoined) {
        if (selectedPost.personsJoined[ind] == currentUser[0]['userId']) {
          Alert.alert(
            'Already Joined!',
            'You are already listed in this pool.',
            [{type: 'Okay'}]
          );
          return;
        }
      }
      let persons = selectedPost.personsJoined.concat(currentUser[0]['userId']);
      selectedPost.personsJoined = persons;
      dispatch(postsActions.joinPool(selectedPost));
    } else {
      Alert.alert('Seats Full', 'Try some other pools', [{type: 'Okay'}]);
    }
  };

  const messageScreenHandler = () => {
    setOpenInbox((prevState) => !prevState);
  };

  const inputChangeHandler = (message) => {
    console.log(message);
    setMessage(message);
  };

  const sendMessageHandler = async () => {
    console.log('sending');
    try {
      let users = [currentUserId, creatorId];
      let newMessage = new Message(currentUserId, message, new Date());
      let messages = [newMessage];
      console.log(messages, 'ARRAY');
      let date = new Date();
      if (newChat) {
        await dispatch(chatActions.createChat(users, messages, date));
      } else {
        let updatedChat = new Chat(
          chat[0].id,
          chat[0].users,
          chat[0].messages.concat(
            new Message(currentUserId, message, new Date().getTime())
          ),
          chat[0].date
        );
        await dispatch(chatActions.sendMessage(updatedChat));
      }
      setOpenInbox(false);
      Alert.alert('Sent!', 'Message sent successfully', [{text: 'Okay'}]);
    } catch (error) {
      Alert.alert('Sending Failed', error.message, [{text: 'Okay'}]);
    }
  };

  const handlejoinedList = () => {
    setJoinedList((prevState) => !prevState);
  };

  let screen2 = (
    <ScrollView>
      <View style={styles.post}>
        <View>
          <View style={styles.creator}>
            <Image
              style={styles.image}
              source={{
                uri: `data:image/gif;base64,${creator[0]['profilePicture']}`,
              }}
            />
            <View>
              <Text style={styles.nameText}>
                {creator[0]['firstName']} {creator[0]['lastName']}{' '}
              </Text>
            </View>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              Hi all, I am traveling from{' '}
              <Text style={{fontWeight: 'bold'}}>{selectedPost.fromCity}</Text>{' '}
              to <Text style={{fontWeight: 'bold'}}>{selectedPost.toCity}</Text>{' '}
              on{' '}
              <Text style={{fontWeight: 'bold'}}>
                {moment(selectedPost.date).format('LL')}
              </Text>
              . Maximum{' '}
              <Text>
                {selectedPost.maxPersons} persons are welcomed to join me!
              </Text>
            </Text>
            <Text style={styles.details}>
              {joinedPersonsList.length} person(s) have joined this pool yet{' '}
            </Text>
            <Text style={styles.details}>
              Remaining seat(s):{' '}
              {selectedPost.maxPersons - joinedPersonsList.length}
            </Text>
            <Text style={styles.details}>Status: {selectedPost.status}</Text>
          </View>
          {joinedList ? null : (
            <View>
              <Text style={{fontWeight: 'bold', padding: 5}}>
                Travelling Persons Details
              </Text>
              <FlatList
                data={joinedPersonsList}
                keyExtractor={(item) => item}
                renderItem={(itemData) => (
                  <TravellingPersons person={itemData.item} />
                )}
              />
            </View>
          )}
          <View style={{padding: 10}}>
            <Button
              title={!joinedList ? 'Open List' : 'Close List'}
              onPress={handlejoinedList}
            />
          </View>
          {!isMyPost && (
            <View>
              <View style={{padding: 10}}>
                <Button
                  title="Message me!"
                  color={Colors.primary}
                  onPress={messageScreenHandler}
                />
              </View>
              <View style={{padding: 10}}>
                <Button
                  title="Join Pool"
                  color={Colors.primary}
                  onPress={joinHandler}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );

  let screen = (
    <View>
      <View>
        <View>
          <View style={styles.creator}>
            <Image
              style={styles.image2}
              source={{uri: creator[0]['profilePicture']}}
            />
            <View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{creator[0]['firstName']}</Text>
                <Text style={styles.nameText}>{creator[0]['lastName']} </Text>
              </View>
              {!isMyPost && (
                <View style={styles.messageButton}>
                  <Button
                    title="Message me!"
                    color={Colors.primary}
                    onPress={messageScreenHandler}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View>
          {!isMyPost && (
            <View style={styles.joinButton}>
              <Button
                title="JOIN"
                color={Colors.primary}
                onPress={joinHandler}
              />
            </View>
          )}
          <Text style={{fontWeight: 'bold'}}>Travelling Persons Details</Text>
          <FlatList
            data={joinedPersonsList}
            keyExtractor={(item) => item}
            renderItem={(itemData) => (
              <TravellingPersons person={itemData.item} />
            )}
          />
        </View>
      </View>
    </View>
  );
  if (openInbox) {
    return (
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
    );
  }

  return screen2;
};

PostDetailScreen.navigationOptions = {
  headerTitle: 'Post Details',
};
const styles = StyleSheet.create({
  post: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 'auto',
    margin: 20,
  },
  creator: {
    flexDirection: 'row',
  },
  nameText: {
    paddingTop: 70,
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
    width: 'auto',
  },

  messageContainer: {
    padding: 20,
  },
  message: {
    fontSize: 20,
  },
  details: {
    fontSize: 15,
  },
  indox: {
    justifyContent: 'flex-end',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 640,
    margin: 20,
  },
  input: {},
  messageButton: {
    justifyContent: 'flex-end',
    width: '69%',
    maxWidth: 200,
    marginLeft: 25,
    marginBottom: 30,
  },
  detailContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cities: {
    paddingTop: 30,
    fontSize: 20,
  },
  date: {},
  fare: {},
  personsJoined: {},
  actions: {
    width: '100%',
    padding: 20,
  },
  // nameText: {
  //   // paddingTop: 80,
  //   textAlign: 'center',
  //   fontSize: 20,
  //   padding: 5,
  //   // paddingLeft: 15,
  //   fontWeight: 'bold',
  // },
  image: {
    marginLeft: 15,
    marginTop: 12,
    width: 140,
    height: 140,
    borderRadius: 125,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },

  image2: {
    marginLeft: 15,
    marginTop: 12,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },

  creator: {
    flexDirection: 'row',
  },
  joinButton: {
    width: '69%',
    maxWidth: 200,
    marginLeft: 95,
    marginBottom: 30,
    marginTop: 20,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sendButton: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 40,
    paddingLeft: 5,
    width: 'auto',
  },
  sendMessage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 200,
  },
  inputConyainer: {
    width: '100%',
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    marginBottom: 10, //Here is the trick
  },
  textInput: {
    height: 50,
    width: 350,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 0,
  },
});

export default PostDetailScreen;
