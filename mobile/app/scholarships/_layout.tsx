import { Stack } from 'expo-router';

export default function ScholarshipsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="filter" />
        </Stack>
    );
}
