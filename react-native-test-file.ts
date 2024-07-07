import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

interface Props {
  name: string;
  items: string[];
}

const TestComponent: React.FC<Props> = ({ name, items }) => {
  const [inputText, setInputText] = React.useState('');
  const currentYear = new Date().getFullYear();

  const handleAlert = () => {
    Alert.alert('Welcome', 'Hello, welcome to our app!');
  };

  const showSimpleAlert = () => {
    alert('This is a simple alert');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to our React Native App!</Text>
      
      <Text>Hello, {name}! You have {items.length} items.</Text>
      
      <Text>
        This is a multi-line text.
        It spans multiple lines.
        {items.length > 5 && "You have many items!"}
      </Text>

      <Text>The current year is {currentYear}.</Text>

      <Text>
        Part 1. 
        <Text>Nested part 2. </Text>
        Part 3.
      </Text>

      <Text>{`Template literal with ${name}`}</Text>

      <Text>{'Text wrapped in curly braces'}</Text>

      <Button
        title="Click me!"
        onPress={() => console.log('Button pressed')}
      />

      <TextInput
        placeholder="Enter your name"
        value={inputText}
        onChangeText={setInputText}
      />

      <Button title="Show Alert" onPress={handleAlert} />
      <Button title="Simple Alert" onPress={showSimpleAlert} />

      <Text>{`You entered: ${inputText}`}</Text>

      <Text>{`Translated: ${t('common.hello')} ${name}`}</Text>

      <Text>{t('common.hello') + ' ' + t('common.world')}</Text>

      <Text>{`${t('common.hello')} ${'world'} ${t('common.welcome')}`}</Text>

      {items.map((item, index) => (
        <Text key={index}>{`Item ${index + 1}: ${item}`}</Text>
      ))}

      <Text style={styles.footer}>© {currentYear} My Amazing App</Text>
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
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
  },
});

export default TestComponent;
