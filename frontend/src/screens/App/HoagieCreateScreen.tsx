import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../../types";
import { useRecoilState, useSetRecoilState } from "recoil";
import { hoagieFormState } from "../../atoms/hoagieFormState";
import api from "../../services/api";
import { refreshHoagiesState } from "../../atoms/refreshHoagiesState";

type Props = StackScreenProps<AppStackParamList, "HoagieCreate">;

export default function HoagieCreateScreen({ navigation }: Props) {
  const setRefreshSignal = useSetRecoilState(refreshHoagiesState);
  const [form, setForm] = useRecoilState(hoagieFormState);
  const [loading, setLoading] = useState(false);

  const updateIngredient = (text: string, index: number) => {
    const updated = [...form.ingredients];
    updated[index] = text;
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () =>
    setForm({ ...form, ingredients: [...form.ingredients, ""] });

  const removeIngredient = (index: number) => {
    const updated = form.ingredients.filter((_, i) => i !== index);
    setForm({ ...form, ingredients: updated });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "We need permission to access your media."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) {
        setForm({ ...form, image: uri });
      }
    }
  };

  const createHoagie = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation Error", "Please enter a hoagie name.");
      return;
    }
    const validIngredients = form.ingredients.filter((i) => i.trim() !== "");
    if (validIngredients.length === 0) {
      Alert.alert("Validation Error", "Add at least one ingredient.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/hoagies", {
        name: form.name,
        ingredients: validIngredients,
        picture: form.image || undefined,
      });

      setForm({ name: "", image: "", ingredients: [""] });
      setRefreshSignal((prev) => prev + 1);
      Alert.alert("Success", "Hoagie created!");
      navigation.navigate("HoagieList");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not create hoagie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Hoagie </Text>

      <TextInput
        style={styles.input}
        placeholder="Hoagie name"
        value={form.name}
        onChangeText={(name) => setForm({ ...form, name })}
      />

      {form.image ? (
        <Image source={{ uri: form.image }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>
          {form.image ? "Change Image" : "Upload Image"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ingredients:</Text>
      {form.ingredients.map((ing, idx) => (
        <View key={idx} style={styles.ingredientRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={`Ingredient ${idx + 1}`}
            value={ing}
            onChangeText={(text) => updateIngredient(text, idx)}
          />
          {form.ingredients.length > 1 && (
            <TouchableOpacity onPress={() => removeIngredient(idx)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addIngredient}>
        <Text style={styles.addMore}>+ Add More</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={createHoagie}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Hoagie"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#2e86de",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeBtn: { fontSize: 18, color: "red", marginLeft: 10 },
  addMore: { color: "#2e86de", marginBottom: 24 },
  button: {
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
