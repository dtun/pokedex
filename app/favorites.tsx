import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Pokemon, getPokemonDetail } from '@/api/pokeapi';
import { useQueries } from '@tanstack/react-query';
import { storage } from '@/api/mmkv';
import Animated, {
  FadeIn,
  Layout,
  SlideOutLeft,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

const Page = () => {
  const [keys, setKeys] = useState(storage.getAllKeys());
  const [data, setData] = useState<Pokemon[]>();
  const pokemonQueries = useQueries({
    queries: keys.map((k) => {
      const [, id] = k.split('-');
      return {
        queryKey: ['pokemon', id],
        queryFn: () => getPokemonDetail(id),
      };
    }),
  });
  const allFinished = pokemonQueries.every((q) => q.isSuccess);
  const deleteFavorite = async (id: number) => {
    storage.delete(`favorite-${id}`);
    setData((prev) => prev?.filter((p) => p.id !== id));
    setKeys((prev) => prev.filter((k) => k !== `favorite-${id}`));
  };

  useEffect(() => {
    if (allFinished) setData(pokemonQueries.map((q) => q.data!));
  }, [allFinished]);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ListEmptyComponent={
          pokemonQueries.some((q) => q.isLoading) ? (
            <ActivityIndicator style={{ marginTop: 30 }} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>
              No favorites
            </Text>
          )
        }
        keyExtractor={(p) => p.id.toString()}
        data={data}
        renderItem={({ item: p, index }) => {
          return (
            <Animated.View
              entering={FadeIn.delay(100 * index)}
              exiting={SlideOutLeft.duration(200)}
              layout={Layout.delay(100)}
              style={styles.item}
            >
              <Image
                source={{ uri: p?.sprites.front_default }}
                style={styles.preview}
              />
              <Text style={styles.itemText}>{p?.name}</Text>
              <Pressable onPress={() => deleteFavorite(p!.id)}>
                <Text style={styles.itemArrow}>Delete</Text>
              </Pressable>
            </Animated.View>
          );
        }}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  itemText: {
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1,
  },
  itemArrow: { fontSize: 16 },
  preview: {
    width: 100,
    height: 100,
  },
});
