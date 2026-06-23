import { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedPressableProps extends PropsWithChildren {
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
}

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({
  children,
  onPress,
  style,
  disabled,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedButton
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={[style, animatedStyle]}
      disabled={disabled}
    >
      {children}
    </AnimatedButton>
  );
}
