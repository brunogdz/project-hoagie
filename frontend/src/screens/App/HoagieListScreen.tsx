import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../../types";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { logoutUser } from "../../redux/auth/authThunks";
import api from "../../services/api";
import Animated, { FadeIn } from "react-native-reanimated";
import { refreshHoagiesState } from "../../atoms/refreshHoagiesState";
import { useRecoilValue } from "recoil";

type Props = StackScreenProps<AppStackParamList, "HoagieList">;

type Hoagie = {
  _id: string;
  name: string;
  ingredients: string[];
  picture?: string;
  creator: { _id: string; name: string };
  commentsCount: number;
};

const LIMIT = 5;

export default function HoagieListScreen({ navigation }: Props) {
  const { userId, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();

  const [hoagies, setHoagies] = useState<Hoagie[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const refreshSignal = useRecoilValue(refreshHoagiesState);

  const fetchHoagies = async (pageNum = 1) => {
    if (pageNum > 1) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await api.get(`/hoagies?page=${pageNum}&limit=${LIMIT}`);
      if (pageNum === 1) {
        setHoagies(res.data.data);
      } else {
        setHoagies(prev => [...prev, ...res.data.data]);
      }
      setTotal(res.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load hoagies", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHoagies(1);
  }, [refreshSignal]);

  const renderItem = ({ item }: { item: Hoagie }) => {
    const isMine = item.creator?._id === userId;

    return (
      <Animated.View entering={FadeIn} style={styles.card}>
        {item.picture && (
          <Image source={{ uri: item.picture }} style={styles.image} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.creator}>
              By {item.creator?.name || "Unknown"}
            </Text>
            <Text style={styles.creator}>{item.commentsCount} comments</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HoagieDetails", { hoagieId: item._id })
              }
            >
              <Text style={styles.viewBtn}>👁 View</Text>
            </TouchableOpacity>

            {isMine && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("HoagieEdit", { hoagieId: item._id })
                }
              >
                <Text style={styles.editBtn}>✏️ Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && (
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("HoagieCreate")}
          >
            <Text style={styles.createText}>+ Create New Hoagie</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => dispatch(logoutUser())}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={hoagies}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={() => {
          const nextPage = page + 1;
          if (hoagies.length < total && !loadingMore) {
            fetchHoagies(nextPage);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (loadingMore) {
            return <ActivityIndicator size="small" style={{ marginTop: 10 }} />;
          }

          if (hoagies.length < total) {
            return (
              <Text style={styles.pageInfo}>
                Page {page} of {Math.ceil(total / LIMIT)}
              </Text>
            );
          }

          return null;
        }}
      />

      {!loading && (
        <Text style={styles.totalInfo}>
          Showing {hoagies.length} of {total} hoagies
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  creator: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },
  viewBtn: {
    color: "#2e86de",
    fontSize: 14,
  },
  editBtn: {
    color: "#2ecc71",
    fontSize: 14,
  },
  createButton: {
    backgroundColor: "#2e86de",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  createText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  totalInfo: {
    textAlign: "center",
    marginTop: 10,
    color: "#444",
  },
  pageInfo: {
    textAlign: "center",
    paddingVertical: 8,
    color: "#888",
    fontSize: 13,
  },
});
