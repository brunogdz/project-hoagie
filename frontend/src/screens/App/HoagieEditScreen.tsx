import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../../types";
import api from "../../services/api";
import { useSetRecoilState } from "recoil";
import { refreshHoagiesState } from "../../atoms/refreshHoagiesState";

type Props = StackScreenProps<AppStackParamList, "HoagieEdit">;

export default function HoagieEditScreen({ route, navigation }: Props) {
  const setRefresh = useSetRecoilState(refreshHoagiesState);
  const { hoagieId } = route.params;
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoagie = async () => {
      try {
        const res = await api.get(`/hoagies/${hoagieId}`);
        setName(res.data.name);
        setIngredients(res.data.ingredients.join(", "));
      } catch (err) {
        Alert.alert("Error", "Failed to load hoagie");
      } finally {
        setLoading(false);
      }
    };
    fetchHoagie();
  }, [hoagieId]);

  const updateHoagie = async () => {
    if (!name || !ingredients.trim()) {
      Alert.alert("Validation", "All fields are required");
      return;
    }

    try {
      await api.patch(`/hoagies/${hoagieId}`, {
        name,
        ingredients: ingredients.split(",").map((i) => i.trim()),
      });
      setRefresh((val) => val + 1);
      navigation.navigate("HoagieList");
    } catch (err) {
      Alert.alert("Update failed", "Could not update hoagie");
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Ingredients (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
      />

      <TouchableOpacity style={styles.button} onPress={updateHoagie}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
