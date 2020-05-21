import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Ionicons} from '@expo/vector-icons';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProfileScreen = (props) => {
  console.log('In ProfileScreen');
  const dispatch = useDispatch();

  const userAccount = useSelector((state) => state.account.userAccount);
  const userArray = userAccount;
  const userObject = userAccount[0];
  let user = userObject;
  if (userObject === undefined) {
    user = userArray;
  }

  if (user === undefined) {
    props.navigation.navigate('Posts');
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <ImageBackground
        source={require('../../assets/image.jpeg')}
        style={styles.bgImage}
      >
        <View style={styles.bgImageContainer}>
          <Image
            source={{uri: `data:image/gif;base64,${user.profilePicture}`}}
            style={styles.image}
          />
          <Ionicons
            name={
              Platform.OS === 'android' ? 'md-camera' : 'ios-camera-outline'
            }
            size={40}
            color="white"
            onPress={() => {
              props.navigation.navigate('EditProfileDetails', {
                identifier: 'profilePicture',
              });
            }}
          />
        </View>
      </ImageBackground>
      <View style={styles.fieldContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name={
              Platform.OS === 'android' ? 'md-person' : 'ios-person-outline'
            }
            size={40}
            color="blue"
          />
          <Text style={styles.text}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create-outline'}
          size={30}
          color="blue"
          onPress={() => {
            props.navigation.navigate('EditProfileDetails', {
              identifier: 'name',
            });
          }}
        />
      </View>
      <View style={styles.fieldContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-mail' : 'ios-mail-outline'}
            size={40}
            color="blue"
          />
          <Text style={styles.text}>{user.email}</Text>
        </View>
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create-outline'}
          size={30}
          color="blue"
          onPress={() => {
            props.navigation.navigate('EditProfileDetails', {
              identifier: 'email',
            });
          }}
        />
      </View>

      <View style={styles.fieldContainer}>
        <View style={styles.subContainer}>
          <Ionicons
            name={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
            size={40}
            color="blue"
          />
          <Text style={{...styles.text, color: 'blue'}}>Change Password</Text>
        </View>
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create-outline'}
          size={30}
          color="blue"
          onPress={() => {
            props.navigation.navigate('EditProfileDetails', {
              identifier: 'password',
            });
          }}
        />
      </View>
    </View>
  );
};

ProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Profile',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('UserDetails');
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  text: {
    paddingLeft: 20,
    paddingTop: 6,
    fontSize: 20,
  },

  bgImage: {
    // // paddingLeft: 25,
    // // marginTop: 20,
    // width: '100%',
    // height: '60%',
    // maxHeight: 300,
    // // borderRadius: 135,
    justifyContent: 'space-between',
    width: '100%',
    height: 250,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  image: {
    marginTop: 10,
    width: 230,
    height: 230,
    borderRadius: 135,
    backgroundColor: '#ccc',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  bgImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default ProfileScreen;
