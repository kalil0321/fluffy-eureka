import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from 'react-native';

interface Props {
  name: string;
  items: string[];
}

const EdgeCasesComponent: React.FC<Props> = ({ name, items }) => {

  const showAlert = () => {
    Alert.alert(
      'Alert Title',
      'Alert Message',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {"Text wrapped in curly braces"}
      </Text>

      <Text>
      {name}
      </Text>

      <Button title="Hi!" onPress={() => {}} />

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.text}>
          Touch me
        </Text>
      </TouchableOpacity>

      <TextInput placeholder="Enter your name" />

      <Text style={styles.text}>
        Translated: Hello {name}
      </Text>

      {items.map((item, index) => (
        <Text
          style={styles.text}
          key={index}
        >{`Item ${index + 1}: ${item}`}</Text>
      ))}

      <Text style={styles.blueText}>
        This is a multi-line text. It spans multiple lines.
        {items.length > 5 && "You have many items!"}
      </Text>

      <Text style={styles.text}>
        Hello, {name}! You have {items.length} items.
      </Text>

      <Text
        style={styles.text}
      >{`Template literal with ${name}`}</Text>

      <Text style={styles.text}>
        Part 1. 
        <Text style={styles.nestedText}>Nested part 2.</Text>
        Part 3.
      </Text>

      <Text style={styles.text}>
        Key1 Key2
      </Text>

      <Text style={styles.text}>
        Key3 with variables
      </Text>

      <Text style={styles.text}>
        {items.length === 1 ? 'Singular' : `Plural: ${items.length}`}
      </Text>

      <Text style={styles.text}>
        Start middle end
      </Text>

      <Button title="Show Alert" onPress={showAlert} />

      <Text style={styles.text}>
        Miscellaneous text 1
      </Text>

      <Text style={styles.text}>
        Miscellaneous text 2 with dynamic value: {name}
      </Text>

      <Button title="Submit" onPress={() => {}} />

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.text}>
          Click me
        </Text>
      </TouchableOpacity>

      <TextInput placeholder="Type something" />

      <Text style={styles.text}>
        Footer note
      </Text>

      <Text style={styles.text}>
        Thank you
      </Text>

      <Text style={styles.text}>
        {items.length > 0 ? 'Non-empty list' : 'Empty list'}
      </Text>

      <Text style={styles.text}>
        With variable: {name}
      </Text>

      <Button title="Press Me" onPress={() => Alert.alert('Press Title', 'Press Message')} />

      <Text style={styles.text}>
        Long text with variable {name}
      </Text>

      <Text style={styles.text}>
        Text with dynamic value: {`Value: ${items.length}`}
      </Text>
    </View>
  );
};


const Component2 = () => {
  return <Text>Component2 Text Element (Testing)</Text>
}

const Component3 = () => {
  return <Text>Component3 Text Element (Testing)</Text>
}

function Component4(){
  return <Text>This component (Component4) is a function</Text>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10,
  },
  blueText: {
    fontSize: 15,
    color: 'blue',
    marginBottom: 10,
  },
  nestedText: {
    fontWeight: 'bold',
  },
});

export default EdgeCasesComponent;
