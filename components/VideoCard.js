import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Colors, Fonts, Sizes } from '../constants/styles'; // Assuming you have a file for your custom colors
import { getVideoDuration } from 'react-native-video-duration';

const VideoCard = ({ uri, title }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Function to handle video load
  const handleVideoLoad = async () => {
    setIsVideoLoaded(true);
  };

  return (
    <TouchableOpacity onPress={handleVideoLoad}>
      <View style={styles.container}>
        {isVideoLoaded && (
          <Video
            style={styles.video}
            source={{ uri }}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 20, // Increased border radius
    overflow: 'hidden',
    borderColor: Colors.primaryColor, // Border color
    borderWidth: 5, // Border width
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.5, // Shadow opacity
    shadowOffset: {
      width: 0, // No horizontal offset
      height: 4, // Vertical offset
    },
    shadowRadius: 6, // Shadow radius
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  title: {
    marginVertical: 12, // Increased spacing between video and title
    paddingHorizontal: 10,
    ...Fonts.whiteColor19SemiBold,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textContainer: {
    backgroundColor: Colors.primaryColor,
  },
});

export default VideoCard;
