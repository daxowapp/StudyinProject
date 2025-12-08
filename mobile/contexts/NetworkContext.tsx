import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    connectionType: string | null;
}

const NetworkContext = createContext<NetworkContextType>({
    isConnected: true,
    isInternetReachable: true,
    connectionType: null,
});

export function NetworkProvider({ children }: { children: ReactNode }) {
    const [networkState, setNetworkState] = useState<NetworkContextType>({
        isConnected: true,
        isInternetReachable: true,
        connectionType: null,
    });

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable,
                connectionType: state.type,
            });
        });

        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable,
                connectionType: state.type,
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <NetworkContext.Provider value={networkState}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}

// Offline banner component
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';

export function OfflineBanner() {
    const { isConnected } = useNetwork();

    if (isConnected) return null;

    return (
        <View style={styles.banner}>
            <WifiOff size={16} color="#FFF" />
            <Text style={styles.bannerText}>You're offline. Showing cached data.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    bannerText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '500',
    },
});
