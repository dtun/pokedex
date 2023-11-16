import { Link } from 'expo-router';
import { View, Text } from 'react-native';

const Page = () => {
  return (
    <View>
      <Link href="./[pokemon]/test">To [pokemon]/test</Link>
    </View>
  );
};

export default Page;
