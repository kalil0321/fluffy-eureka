import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  count: number;
}

const SampleComponent: React.FC<Props> = ({ name, count }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to React Native!</Text>
      
      <Text>Hello, {name}! You've visited {count} times.</Text>
      
      <Text>
        This is a multi-line text.
        It spans multiple lines.
        {count > 5 && "You're a frequent visitor!"}
      </Text>

      <Text>The current year is {new Date().getFullYear()}.</Text>

      <Text>
        Part 1. 
        <Text>Nested part 2. </Text>
        Part 3.
      </Text>

      <Text>{`Template literal with ${name}`}</Text>

      <Text>{'Text wrapped in curly braces'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SampleComponent;
