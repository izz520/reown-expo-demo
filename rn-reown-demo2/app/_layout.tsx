import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  AppKit,
  createAppKit,
  defaultWagmiConfig
} from "@reown/appkit-wagmi-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";
import "@walletconnect/react-native-compat";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { WagmiProvider } from "wagmi";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 0. Setup queryClient
  const queryClient = new QueryClient();

  // 1. Get projectId at https://cloud.reown.com
  const projectId = "ac3cad08aabba7523d5832dab2915914";

  // 2. Create config
  const metadata = {
    name: "AppKit RN",
    description: "AppKit RN Example",
    url: "https://reown.com/appkit",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
    redirect: {
      native: "YOUR_APP_SCHEME://",
      universal: "YOUR_APP_UNIVERSAL_LINK.com",
    },
  };

  const chains = [mainnet, polygon, arbitrum] as const;

  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

  // 3. Create modal
  createAppKit({
    projectId,
    wagmiConfig,
    metadata,
    defaultChain: mainnet, // Optional
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <AppKit />
            <StatusBar style="auto" />
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
