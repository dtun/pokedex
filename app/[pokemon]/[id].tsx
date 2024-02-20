import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getPokemonDetail } from '@/api/pokeapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: 'string' }>();
  const { setOptions } = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
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

      setIsFavorite((await AsyncStorage.getItem(`favorite-${id}`)) === 'true');
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
    await AsyncStorage.setItem(
      `favorite-${id}`,
      !isFavorite ? 'true' : 'false'
    );
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={{ padding: 10 }}>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      {pokemonQuery.data && (
        <>
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Image
              source={{ uri: pokemonQuery.data.sprites.front_default }}
              style={styles.cardImage}
            />
            <Text style={styles.name}>
              #{pokemonQuery.data.id} {pokemonQuery.data.name}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats:</Text>
            {pokemonQuery.data.stats.map((s: any) => (
              <Text key={s.stat.name}>
                {s.stat.name}: {s.base_stat}
              </Text>
            ))}
          </View>
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
