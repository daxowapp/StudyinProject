import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export function useSplashScreen() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load any resources or data here
                // For example, fonts, initial data fetches, etc.

                // Artificial minimum delay for splash (optional)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn('Error during app preparation:', e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // Hide splash screen once app is ready
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    return { appIsReady, onLayoutRootView };
}
