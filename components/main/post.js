import React from 'react';
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

const Post = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.post}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.cities}>
              <Text style={styles.textCity}>{props.fromCity}</Text>
              <Ionicons
                name={
                  Platform.OS === 'android'
                    ? 'md-arrow-forward'
                    : 'ios-arrow-forward'
                }
                size={23}
                style={styles.textCity}
              />
              <Text style={styles.textCity}>{props.toCity}</Text>
            </View>
            <View style={styles.Container}>
              <Text>Date:</Text>
              <Text style={styles.date}>{props.date}</Text>
            </View>
            <View style={styles.Container}>
              <Text>Joined/Maximum</Text>
              <Text>
                {props.personsJoined} / {props.maxPersons}
              </Text>
            </View>
            <View style={styles.Container}>
              <Text>Total Fare</Text>
              <Text>Rs.{props.fare}</Text>
            </View>
            <View style={styles.Container}>
              <Text>Fare/Head</Text>
              <Text>
                Rs.
                {props.personsJoined == 0
                  ? props.fare
                  : props.fare / props.personsJoined}
              </Text>
            </View>
            <View style={styles.Container}>
              <Text>Status</Text>
              <Text>{props.status}</Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
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
    height: 250,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10,
  },
  cities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textCity: {
    fontSize: 18,
    marginVertical: 4,
    padding: 20,
  },
  Container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  date: {
    fontSize: 15,
  },
  fare: {
    fontSize: 14,
    color: '#888',
  },
  actions:{
      width: '100%',
      padding: 20

  }
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     height: "23%",
//     paddingHorizontal: 20,
//   },
});

export default Post;
