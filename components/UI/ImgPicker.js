import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Colors from '../../constants/Colors';

const ImgPicker = (props) => {
  const [pickedImage, setPickedImage] = useState('');
  const verifyPermessions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permission!',
        'You need to grant camera permission to use this app.',
        [{text: 'Okay'}]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermessions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });
    setPickedImage(image.base64);
    props.onImageTaken(image.base64);
  };

  return (
    <View style={StyleSheet.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No Image picked yet.</Text>
        ) : (
          <Image
            style={styles.image}
            source={{uri: `data:image/gif;base64,${pickedImage}`}}
          />
        )}
      </View>

      <Button
        title="Take Image"
        color={Colors.title}
        onPress={takeImageHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImgPicker;
