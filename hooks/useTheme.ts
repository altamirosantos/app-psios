import { useColorScheme } from "react-native";
import { darkTheme } from "../theme/dark";
import { lightTheme } from "../theme/light";

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
