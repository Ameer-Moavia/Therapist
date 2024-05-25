import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text } from '../components/commonText';
import { Colors, Fonts, Sizes, screenWidth } from '../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyStatusBar from '../components/myStatusBar';
import { database } from './firebase'; // Ensure you have your firebase config file
import { ref, push, set, onValue, off } from 'firebase/database';

const MessageScreen = ({ navigation, route }) => {
    const { receiver, currentUser } = route.params;
    const [messagesList, setMessagesList] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const chatId = generateChatId(receiver.id, currentUser.id);
        const messagesRef = ref(database, `chats/${chatId}/messages`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messages = data ? Object.values(data) : [];
            setMessagesList(messages);
        });

        return () => {
            off(messagesRef);
        };
    }, [receiver.id, currentUser.id]);

    const generateChatId = (receiverId, senderId) => {
        return [senderId, receiverId].sort().join('_');
    };

    const sendMessage = async () => {
        if (message.trim().length === 0) {
            return;
        }

        const chatId = generateChatId(receiver.id, currentUser.id);
        const messagesRef = ref(database, `chats/${chatId}/messages`);
        const newMessageRef = push(messagesRef);

        const newMessage = {
            id: newMessageRef.key,
            senderId: currentUser.id,
            message: message,
            timestamp: new Date().toISOString(),
        };

        await set(newMessageRef, newMessage);
        setMessage('');
    };

    return (
        <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardVerticalOffset={0}>
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <MyStatusBar />
                <View style={{ flex: 1 }}>
                    {header()}
                    {messages()}
                </View>
                {typeMessage()}
            </View>
        </KeyboardAvoidingView>
    );

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="keyboard-backspace"
                        size={26}
                        color={Colors.blackColor}
                        onPress={() => {
                            navigation.pop();
                        }}
                        style={{ marginRight: Sizes.fixPadding * 2.0 }}
                    />
                    <Image
                        source={{ uri: receiver.photo }}
                        style={{ width: 46.0, height: 46.0, borderRadius: 23.0 }}
                    />
                    <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 2.0 }}>
                        <Text style={{ ...Fonts.blackColor19SemiBold }}>{receiver.name}</Text>
                        <Text style={{ ...Fonts.grayColor16Regular }}>Online</Text>
                    </View>
                </View>
                <MaterialIcons name="more-vert" size={26} color={Colors.blackColor} />
            </View>
        );
    }

    function messages() {
        const renderItem = ({ item }) => (
            <View
                style={{
                    alignItems: item.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginVertical: Sizes.fixPadding - 2.0,
                }}>
                <View
                    style={{
                        ...styles.messageWrapStyle,
                        backgroundColor: item.senderId === currentUser.id
                            ? Colors.primaryColor
                            : Colors.extraLightGrayColor,
                    }}>
                    <Text
                        style={
                            item.senderId === currentUser.id
                                ? { ...Fonts.whiteColor16Regular }
                                : { ...Fonts.grayColor16Regular }
                        }>
                        {item.message}
                    </Text>
                </View>
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    inverted
                    data={messagesList}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: 'column-reverse',
                        paddingBottom: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding * 2.0,
                    }}
                />
            </View>
        );
    }

    function typeMessage() {
        return (
            <View style={styles.typeMessageWrapStyle}>
                <TextInput
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Write a text here..."
                    style={styles.messageFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                />
                <MaterialIcons
                    name="send"
                    size={20}
                    color={Colors.primaryColor}
                    style={{ marginLeft: Sizes.fixPadding - 5.0 }}
                    onPress={sendMessage}
                />
            </View>
        );
    }
};

export default MessageScreen;

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: Sizes.fixPadding * 2.0,
    },
    typeMessageWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.extraLightGrayColor,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 2.0,
        paddingVertical: Sizes.fixPadding + 3.0,
    },
    messageWrapStyle: {
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        maxWidth: screenWidth - 90.0,
    },
    messageFieldStyle: {
        flex: 1,
        ...Fonts.grayColor16Regular,
        marginRight: Sizes.fixPadding,
        padding: 0,
    },
});
