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
import {Divider} from 'react-native-elements';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

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
            <View style={styles.container}>
              <Text style={{paddingTop: 27, paddingLeft: 10}}>
                <Ionicons
                  name={
                    Platform.OS === 'android' ? 'md-pin' : 'ios-pin-outline'
                  }
                  size={35}
                />
              </Text>
              <Text style={styles.locations}>{post.fromCity}</Text>
              <Text style={styles.locations}>---</Text>
              <Text style={styles.locations}>{post.toCity}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{paddingTop: 27, paddingLeft: 10}}>
                <Ionicons
                  name={
                    Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'
                  }
                  size={35}
                />
              </Text>
              <Text style={styles.date}>{moment(post.date).format('LL')}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{paddingTop: 27, paddingLeft: 10}}>
                <Ionicons
                  name={Platform.OS === 'android' ? 'md-cash' : 'ios-cash'}
                  size={35}
                />
              </Text>
              <Text style={styles.fare}>Rs.{post.fare}</Text>
            </View>
            <Divider style={{backgroundColor: 'blue'}} />
            <View style={styles.postedBy}>
              <Text>
                posted by: {creator[0]['firstName']} {creator[0]['lastName']}
              </Text>
              <Text>{post.status}</Text>
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
  container: {
    flexDirection: 'row',
  },
  locations: {
    paddingTop: 30,
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
  },
  date: {
    paddingTop: 30,
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
  },
  fare: {
    paddingTop: 33,
    textAlign: 'center',
    fontSize: 13,
    padding: 10,
    paddingLeft: 15,
    fontWeight: 'bold',
  },
  postedBy: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default Post;
