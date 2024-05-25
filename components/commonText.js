import { Text as TText } from "react-native";

export const Text = ({ children, style, numberOfLines = 0, onPress }) => {
  return (
    <TText
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={{ ...style, includeFontPadding: false }}
    >
      {children}
    </TText>
  );
};
