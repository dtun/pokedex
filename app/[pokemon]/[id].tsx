import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Pokemon, getPokemonDetail } from '@/api/pokeapi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: 'string' }>();
  const [details, setDetails] = useState<Pokemon>();
  const { setOptions } = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const details = await getPokemonDetail(id!);

      setDetails(details);

      setOptions({
        title: details?.name.charAt(0).toUpperCase() + details?.name.slice(1), // Upper first
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
      {details && (
        <>
          <View style={[styles.card, { alignItems: 'center' }]}>
            <Image
              source={{ uri: details.sprites.front_default }}
              style={styles.cardImage}
            />
            <Text style={styles.name}>
              #{details.id} {details.name}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats:</Text>
            {details.stats.map((s: any) => (
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
