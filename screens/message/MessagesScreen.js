import React from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Chat from '../../components/main/chat';
import {SafeAreaView} from 'react-navigation';

const MessagesScreen = (props) => {
  const chats = useSelector((state) => state.chat.chats);

  const selectChatHandler = (chatId) => {
    props.navigation.navigate('Inbox', {
      chatId: chatId,
    });
  };

  if (chats.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Chatbox is empty!</Text>
      </View>
    );
  }
  return (
    <View>
      <ScrollView>
        <SafeAreaView>
          <FlatList
            data={chats}
            keyExtractor={(chat) => chat.id}
            renderItem={(itemData) => (
              <Chat
                chat={itemData.item}
                onSelect={() => {
                  selectChatHandler(itemData.item.id);
                }}
              />
            )}
          />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

MessagesScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Inbox',
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
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;
