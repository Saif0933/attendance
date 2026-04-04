import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from './ThemeContext';
import { ThemeColors } from './colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * A custom hook to create themed styles.
 * It follows the clean architecture pattern by decoupling styles from theme logic.
 * 
 * @param creator A function that takes theme colors and returns a style object.
 * @returns The style object created with the current theme colors.
 */
export const useStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  creator: (colors: ThemeColors) => T
): T => {
  const { colors } = useTheme();
  return creator(colors);
};

/**
 * Example usage:
 * 
 * const styles = useStyles((colors) => ({
 *   container: {
 *     flex: 1,
 *     backgroundColor: colors.background,
 *   },
 *   text: {
 *     color: colors.text,
 *   }
 * }));
 */
