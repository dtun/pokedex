import { Link } from 'expo-router';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { Pokemon, getPokemon } from '@/api/pokeapi';

const Page = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getPokemon();

      setPokemon(result);
    };

    load();
  }, []);

  return (
    <View>
      <Link href="./[pokemon]/test">To [pokemon]/test</Link>
    </View>
  );
};

export default Page;
