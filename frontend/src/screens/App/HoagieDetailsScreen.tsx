import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import api from "../../services/api";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../../types";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Props = StackScreenProps<AppStackParamList, "HoagieDetails">;

type Hoagie = {
  _id: string;
  name: string;
  ingredients: string[];
  picture?: string;
  creator: { _id: string; name: string };
  collaborators?: { name: string }[];
  commentsCount: number;
};

type Comment = {
  _id: string;
  text: string;
  user: { name: string };
};

export default function HoagieDetailsScreen({ route }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { hoagieId } = route.params;
  const { userId } = useSelector((state: RootState) => state.auth);

  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      const hoagieRes = await api.get(`/hoagies/${hoagieId}`);
      const commentsRes = await api.get(`/comments/hoagie/${hoagieId}`);
      setHoagie(hoagieRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error("Error fetching hoagie details:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await api.post("/comments", {
        text: commentText,
        hoagie: hoagieId,
        user: userId,
      });
      setCommentText("");
      await fetchDetails(); // refresh comments
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [hoagieId]);

  if (loading || !hoagie) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={expanded ? comments : []}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.comment}>
          <Text style={styles.commentUser}>{item.user.name}:</Text>
          <Text>{item.text}</Text>
        </View>
      )}
      ListHeaderComponent={
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text style={styles.title}>{hoagie.name}</Text>

          {hoagie.picture && (
            <Image source={{ uri: hoagie.picture }} style={styles.image} />
          )}

          <Text style={styles.subtitle}>Ingredients:</Text>
          {hoagie.ingredients.map((item, i) => (
            <Text key={i}>- {item}</Text>
          ))}

          <Text style={styles.subtitle}>Created by:</Text>
          <Text>{hoagie.creator?.name}</Text>

          {Array.isArray(hoagie.collaborators) &&
            hoagie.collaborators.length > 0 && (
              <>
                <Text style={styles.subtitle}>Collaborators:</Text>
                {hoagie.collaborators.map((c, i) => (
                  <Text key={i}>{c.name}</Text>
                ))}
              </>
            )}

          {!expanded && comments.length > 0 && (
            <TouchableOpacity onPress={() => setExpanded(true)}>
              <Text style={styles.viewAll}>
                View all {comments.length} comments
              </Text>
            </TouchableOpacity>
          )}

          {expanded && <Text style={styles.subtitle}>Comments:</Text>}
        </Animated.View>
      }
      ListFooterComponent={
        <View style={styles.commentInputSection}>
          <TextInput
            placeholder="Write a comment..."
            style={styles.commentInput}
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={submitComment}
            disabled={submitting}
          >
            <Text style={styles.commentButtonText}>
              {submitting ? "..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
      }
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 15 },
  viewAll: {
    color: "#2e86de",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  comment: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  commentUser: { fontWeight: "600" },
  commentInputSection: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
  },
  commentInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: "#2e86de",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
