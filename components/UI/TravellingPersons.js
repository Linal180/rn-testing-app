import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import Colors from '../../constants/Colors';

const TravellingPersons = (props) => {
  const person = useSelector((state) =>
    state.account.accounts.filter((prsn) => prsn.userId == props.person)
  );
  return (
    <View style={styles.details}>
      <Image style={styles.image} source={{uri: `data:image/gif;base64,${person[0]['profilePicture']}` }} />
      <Text style={styles.text}>
        {person[0]['firstName']} {person[0]['lastName']}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    marginLeft: 15,
    marginTop: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  details: {
    flexDirection: 'row'
  },
  text: {
    paddingTop: 25,
    paddingLeft: 10
  }
});

export default TravellingPersons;
