import { useTranslation } from "react-i18next";
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from 'react-native';
interface Props {
  name: string;
  items: string[];
}
const EdgeCasesComponent: React.FC<Props> = ({
  name,
  items
}) => {
  const {
    t
  } = useTranslation();
  const showAlert = () => {
    Alert.alert(t("edge-cases-2-2-2-2.string_1.value"), t("edge-cases-2-2-2-2.string_2.value"), [{
      text: t("edge-cases-2-2-2-2.string_3.value"),
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel'
    }, {
      text: t("edge-cases-2-2-2-2.string_4.value"),
      onPress: () => console.log('OK Pressed')
    }]);
  };
  return <View style={styles.container}>
      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_5.value")}</Text>

      <Text>{t("edge-cases-2-2-2-2.string_6.value", {
        "name": name
      })}</Text>

      <Button title={t("edge-cases-2-2-2-2.string_7.value")} onPress={() => {}} />

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_8.value")}</Text>
      </TouchableOpacity>

      <TextInput placeholder={t("edge-cases-2-2-2-2.string_9.value")} />

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_10.value", {
        "name": name
      })}</Text>

      {items.map((item, index) => <Text style={styles.text} key={index}>{t("edge-cases-2-2-2-2.string_11.value", {
        ["var0"]: index + 1,
        ["item"]: item
      })}</Text>)}

      <Text style={styles.blueText}>{t("edge-cases-2-2-2-2.string_12.value")}{items.length > 5 && t("edge-cases-2-2-2-2.string_13.value")}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_15.value", {
        "name": name,
        "items.length": items.length
      })}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_16.value", {
        ["name"]: name
      })}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_17.value")}<Text style={styles.nestedText}>{t("edge-cases-2-2-2-2.string_18.value")}</Text>{t("edge-cases-2-2-2-2.string_19.value")}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_20.value")}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_21.value")}</Text>

      <Text style={styles.text}>{items.length === 1 ? 'Singular' : `Plural: ${items.length}`}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_25.value")}</Text>

      <Button title={t("edge-cases-2-2-2-2.string_26.value")} onPress={showAlert} />

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_27.value")}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_28.value", {
        "name": name
      })}</Text>

      <Button title={t("edge-cases-2-2-2-2.string_29.value")} onPress={() => {}} />

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_30.value")}</Text>
      </TouchableOpacity>

      <TextInput placeholder={t("edge-cases-2-2-2-2.string_31.value")} />

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_32.value")}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_33.value")}</Text>

      <Text style={styles.text}>{items.length > 0 ? 'Non-empty list' : 'Empty list'}</Text>

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_37.value", {
        "name": name
      })}</Text>

      <Button title={t("edge-cases-2-2-2-2.string_38.value")} onPress={() => Alert.alert(t("edge-cases-2-2-2-2.string_39.value"), t("edge-cases-2-2-2-2.string_40.value"))} />

      <Text style={styles.text}>{t("edge-cases-2-2-2-2.string_41.value", {
        "name": name
      })}</Text>

      <Text style={styles.text}>
        Text with dynamic value: Value: </Text>
    </View>;
};
const Component2 = () => {
  return <Text>{t("edge-cases-2-2-2-2.string_43.value")}</Text>;
};
const Component3 = () => {
  return <Text>{t("edge-cases-2-2-2-2.string_44.value")}</Text>;
};
function Component4() {
  const {
    t
  } = useTranslation();
  return <Text>{t("edge-cases-2-2-2-2.string_45.value")}</Text>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  text: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10
  },
  blueText: {
    fontSize: 15,
    color: 'blue',
    marginBottom: 10
  },
  nestedText: {
    fontWeight: 'bold'
  }
});
export default EdgeCasesComponent;