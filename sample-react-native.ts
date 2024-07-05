import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface Props {
  name: string;
}

const SampleComponent: React.FC<Props> = ({ name }) => {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
      
      <Text>Hello, {name}!</Text>
      
      <Text>This is a sample component with multiple text elements.</Text>
      
      <View>
        <Text>
          This is a nested text element.
          <Text style={styles.boldText}>This part is bold.</Text>
        </Text>
      </View>

      <Text>You clicked the button {count} times.</Text>
      
      <Button
        title="Click me!"
        onPress={() => setCount(prevCount => prevCount + 1)}
      />

      <Text>Here's some text with a {'\n'}line break.</Text>

      <Text style={styles.footer}>© 2023 My App</Text>

      {/* This shouldn't be extracted */}
      {/* <Text>Commented out text</Text> */}

      {false && <Text>Conditionally rendered text that's currently false</Text>}

      <Text>{`Template literal text`}</Text>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
  },
});

export default SampleComponent;
