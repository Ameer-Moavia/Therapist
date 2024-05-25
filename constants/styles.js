import {Dimensions} from 'react-native';
import { useFonts } from 'expo-font';



export const Colors = {
  primaryColor: '#BF40BF',
  lightPrimaryColor: 'rgba(15, 52, 96, 0.05)',
  whiteColor: '#FFFFFF',
  blackColor: '#000000',
  grayColor: '#484848',
  lightGrayColor: '#e0e0e0',
  extraLightGrayColor: 'rgba(105, 105, 105, 0.05)',
  redColor: '#FF0000',
  pinkColor: '#E94560',
  blueColor: '#0047FF',
  greenColor: '#009D23',
  starYellow:'orange'
};

export const Fonts = {
  
  whiteColor16Regular: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  whiteColor14Medium: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  whiteColor16Medium: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  whiteColor18SemiBold: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  whiteColor19SemiBold: {
    color: Colors.whiteColor,
    fontSize: 19.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  whiteColor20SemiBold: {
    color: Colors.whiteColor,
    fontSize: 20.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  whiteColor20Bold: {
    color: Colors.whiteColor,
    fontSize: 20.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor14Regular: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor15Regular: {
    color: Colors.blackColor,
    fontSize: 15.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor16Regular: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor15Medium: {
    color: Colors.blackColor,
    fontSize: 15.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor16Medium: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor18Medium: {
    color: Colors.blackColor,
    fontSize: 18.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  blackColor17SemiBold: {
    color: Colors.blackColor,
    fontSize: 17.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor18SemiBold: {
    color: Colors.blackColor,
    fontSize: 18.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor19SemiBold: {
    color: Colors.blackColor,
    fontSize: 19.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor20SemiBold: {
    color: Colors.blackColor,
    fontSize: 20.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor20Bold: {
    color: Colors.blackColor,
    fontSize: 20.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blackColor22Bold: {
    color: Colors.blackColor,
    fontSize: 22.0,
    fontWeight: '700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  grayColor13Regular: {
    color: Colors.grayColor,
    fontSize: 13.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor14Regular: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor15Regular: {
    color: Colors.grayColor,
    fontSize: 15.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor16Regular: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor14Medium: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor15Medium: {
    color: Colors.grayColor,
    fontSize: 15.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor16Medium: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  grayColor18SemiBold: {
    color: Colors.grayColor,
    fontSize: 18.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  grayColor19SemiBold: {
    color: Colors.grayColor,
    fontSize: 19.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  primaryColor16Medium: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontWeight: '500',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  primaryColor16SemiBold: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  primaryColor18SemiBold: {
    color: Colors.primaryColor,
    fontSize: 18.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  primaryColor20SemiBold: {
    color: Colors.primaryColor,
    fontSize: 20.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  primaryColor16Bold: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  primaryColor20Bold: {
    color: Colors.primaryColor,
    fontSize: 20.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  blueColor15Regular: {
    color: Colors.blueColor,
    fontSize: 15.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  redColor16Regular: {
    color: Colors.redColor,
    fontSize: 16.0,
    fontWeight: '400',
    fontFamily: 'SF-Compact-Display-Regular',
  },

  redColor15SemiBold: {
    color: Colors.redColor,
    fontSize: 15.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  greenColor15SemiBold: {
    color: Colors.greenColor,
    fontSize: 15.0,
    fontWeight:'600',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  pinkColor16Bold: {
    color: Colors.pinkColor,
    fontSize: 16.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },

  pinkColor20Bold: {
    color: Colors.pinkColor,
    fontSize: 20.0,
    fontWeight:'700',
    fontFamily: 'SF-Compact-Display-Bold',
  },
};

export const Sizes = {
  fixPadding: 10.0,
};

export const CommonStyles = {
  buttonStyle: {
    flexDirection: 'row',
    gap: Sizes.fixPadding - 2,
    elevation: 5.0,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.9,
    shadowColor: Colors.primaryColor,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    padding: 0.0,
    width: '90%',
    borderRadius: Sizes.fixPadding,
  },
  headerTextStyle: {
    ...Fonts.blackColor20Bold,
    textAlign: 'center',
    maxWidth: '80%',
    alignSelf: 'center',
    color: Colors.primaryColor,
  },
  textFieldWrapper: {
    flexDirection: 'row',
    gap: Sizes.fixPadding - 2,
    backgroundColor: Colors.extraLightGrayColor,
    alignItems: 'center',
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 3.0,
    borderRadius: Sizes.fixPadding,
    marginTop: Sizes.fixPadding,
  },
};

export const screenWidth = Dimensions.get('window').width;
