import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

const Page = () => {
  const pokemonQuery = useQuery({ queryKey: ['pokemon'], queryFn: getPokemon });

  const renderItem: ListRenderItem<Pokemon> = ({ item: p }) => (
    <Link href={`/[pokemon]/${p.id}`} asChild>
      <TouchableWithoutFeedback>
        <View style={styles.item}>
          <Image source={{ uri: p.image }} style={styles.preview} />
          <Text style={styles.itemText}>{p.name}</Text>
          <Text style={styles.itemArrow}>→</Text>
        </View>
      </TouchableWithoutFeedback>
    </Link>
  );

  return (
    <View style={{ flex: 1 }}>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      <FlashList
        data={pokemonQuery.data}
        renderItem={renderItem}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, width: '100%', backgroundColor: '#dfdfdf' }}
          />
        )}
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
  itemArrow: { fontSize: 24 },
  preview: {
    width: 100,
    height: 100,
  },
});
