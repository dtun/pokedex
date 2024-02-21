import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getPokemonDetail } from '@/api/pokeapi';
import { useQuery } from '@tanstack/react-query';
import { storage } from '@/api/mmkv';
import Animated, {
  FadeIn,
  FadeInDown,
  FlipInEasyX,
} from 'react-native-reanimated';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: 'string' }>();
  const { setOptions } = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    storage.getString(`favorite-${id}`) === 'true'
  );

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetail(id!),
  });

  useEffect(() => {
    const load = async () => {
      if (!pokemonQuery.data) return;

      setOptions({
        title:
          pokemonQuery.data?.name.charAt(0).toUpperCase() +
          pokemonQuery.data?.name.slice(1), // Upper first
      });
    };

    load();
  }, [id]);

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <Text
          style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}
          onPress={toggleFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </Text>
      ),
    });
  }, [isFavorite]);

  const toggleFavorite = async () => {
    storage.set(`favorite-${id}`, isFavorite ? 'false' : 'true');
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={{ padding: 10 }}>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      {pokemonQuery.data && (
        <>
          <Animated.View
            entering={FadeIn.delay(200)}
            style={[styles.card, { alignItems: 'center' }]}
          >
            <Image
              source={{ uri: pokemonQuery.data.sprites.front_default }}
              style={styles.cardImage}
            />
            <Animated.Text
              entering={FlipInEasyX.delay(300)}
              style={styles.name}
            >
              #{pokemonQuery.data.id} {pokemonQuery.data.name}
            </Animated.Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(500)} style={styles.card}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats:</Text>
            {pokemonQuery.data.stats.map((s: any) => (
              <Text key={s.stat.name}>
                {s.stat.name}: {s.base_stat}
              </Text>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    elevation: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardImage: { width: 200, height: 200 },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
