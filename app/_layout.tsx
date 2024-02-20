import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const client = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={client}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Pokedex' }} />
        <Stack.Screen name="[pokemon]/[id]" options={{ title: '' }} />
      </Stack>
    </QueryClientProvider>
  );
};

export default Layout;
