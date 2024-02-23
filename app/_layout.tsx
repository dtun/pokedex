import { Link, Stack } from 'expo-router';
import { Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={client}>
      <Stack
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Pokedex',
            headerRight: () => (
              <Link href="/favorites" asChild>
                <TouchableWithoutFeedback>
                  <Text style={styles.headerRight}>♥</Text>
                </TouchableWithoutFeedback>
              </Link>
            ),
          }}
        />
        <Stack.Screen name="[pokemon]/[id]" options={{ title: '' }} />
        <Stack.Screen
          name="favorites"
          options={{ title: 'Favorites', presentation: 'modal' }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  headerStyle: { backgroundColor: '#f4511e' },
  headerRight: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
});
