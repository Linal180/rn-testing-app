import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../constants/Colors';


const Post = (props) => {
  const post = props.post;
  const creatorId = post.userId;
  const creator = useSelector((state) =>
    state.account.accounts.filter((accnt) => accnt.userId == creatorId)
  );

  const joinedPersonsList = post.personsJoined;

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }



  return (
    <View style={styles.post}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.creator}>
              <Image
                style={styles.image}
                source={{uri: creator[0]['profilePicture']}}
              />
              <View>
                <Text style={styles.nameText}>
                  {creator[0]['firstName']} {creator[0]['lastName']}{' '}
                </Text>
              </View>
            </View>
            <View style={styles.messageContainer}>
              <Text>
                Hi all, I am traveling from{' '}
                <Text style={{fontWeight: 'bold'}}>{post.fromCity}</Text> to{' '}
                <Text style={{fontWeight: 'bold'}}>{post.toCity}</Text> on{' '}
                <Text style={{fontWeight: 'bold'}}>
                  {new Date(post.date).toString()}
                </Text>
                . Maximum{' '}
                <Text>{post.maxPersons} persons are welcomed to join me!</Text>
              </Text>
              <Text style={styles.details}>
                {joinedPersonsList.length} person(s) have joined this pool yet{' '}
              </Text>
              <Text style={styles.details}>Remaining seat(s):  {post.maxPersons - joinedPersonsList.length}</Text>
              <Text style={styles.details}>Status: {post.status}</Text>
              </View>

          </View>
        </TouchableCmp>
      </View>
    </View>
  );
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
    height: 240,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  details: {
    fontSize: 12,
  },
  messageContainer: {
    padding: 20,
  },
  actions: {
    width: '100%',
    padding: 20,
  },
  nameText: {
    paddingTop: 30,
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
  },
  image: {
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
  //   actions: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     height: "23%",
  //     paddingHorizontal: 20,
  //   },
});

export default Post;
