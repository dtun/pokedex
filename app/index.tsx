import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getPokemon } from '@/api/pokeapi';
import { Link } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const pokemonQuery = useQuery({ queryKey: ['pokemon'], queryFn: getPokemon });

  return (
    <ScrollView>
      {pokemonQuery.isLoading && (
        <ActivityIndicator style={{ marginTop: 30 }} />
      )}
      {pokemonQuery.data?.map((p) => (
        <Link href={`/[pokemon]/${p.id}`} key={p.id} asChild>
          <TouchableWithoutFeedback>
            <View style={styles.item}>
              <Image source={{ uri: p.image }} style={styles.preview} />
              <Text style={styles.itemText}>{p.name}</Text>
              <Text style={styles.itemArrow}>→</Text>
            </View>
          </TouchableWithoutFeedback>
        </Link>
      ))}
    </ScrollView>
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
