import React from 'react';
import {
  View,
  SafeAreaView,
  Button,
  Text,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DrawerItems} from 'react-navigation-drawer';

import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/Colors';
import {Ionicons} from '@expo/vector-icons';

const UserProfileContent = (props) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => !!state.account.token);
  const user = useSelector((state) => state.account.userAccount);
  let profileDetails = {
    firstName: 'Anonymous',
    lastName: '',
    profilePicture: '',
  };
  if (user === null || user === undefined) {
    console.log('user is null yet!');
  } else {
    if (user.length === 0) {
      console.log('user Array is empty yet');
    } else if(user[0]) {
      profileDetails.firstName = user[0].firstName;
      profileDetails.lastName = user[0].lastName;
      profileDetails.profilePicture = user[0].profilePicture;
    }
  }

  //   if (user) {
  //     const userAccnt = useSelector((state) => state.account.userAccount);
  //     profileDetails.firstName = userAccnt[0].firstName;
  //     profileDetails.lastName = userAccnt[0].lastName;
  //     profileDetails.profilePicture = userAccnt[0].profilePicture;
  //   }
  return (
    <View style={{flex: 1, paddingTop: 25}}>
      <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.image}
            source={{
              uri: `data:image/gif;base64,${profileDetails.profilePicture}`,
            }}
          />
          <Text style={styles.nameText}>
            {profileDetails.firstName} {profileDetails.lastName}{' '}
          </Text>
        </View>
        <DrawerItems {...props} />
        <Button
          title="Logout"
          color={Colors.primary}
          onPress={() => {
            dispatch(authActions.logout());
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    paddingLeft: 90,
    marginTop: 20,
    width: 170,
    height: 170,
    borderRadius: 135,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    paddingLeft: 15,
  },
});
export default UserProfileContent;
