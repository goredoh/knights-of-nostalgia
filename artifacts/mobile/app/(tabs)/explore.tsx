import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TagChip } from '@/components/TagChip';
import { Avatar } from '@/components/Avatar';

const CATEGORIES = [
  { key: 'cities', label: 'Cities', icon: 'map' as const },
  { key: 'parks', label: 'Parks', icon: 'sun' as const },
  { key: 'food', label: 'Food & Drink', icon: 'coffee' as const },
  { key: 'events', label: 'Events', icon: 'star' as const },
  { key: 'items', label: 'Toys & Items', icon: 'box' as const },
  { key: 'music', label: 'Music & Film', icon: 'music' as const },
  { key: 'family', label: 'Family', icon: 'users' as const },
  { key: 'nature', label: 'Nature', icon: 'cloud' as const },
];

const LOCAL_IMAGES: Record<string, any> = {
  hero: require('@/assets/images/kon_hero.jpg'),
  archive: require('@/assets/images/kon_archive.jpg'),
};

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishes, fulfillments } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = useMemo(() => {
    let result = wishes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.location.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (activeCategory) {
      const catLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label.toLowerCase() ?? '';
      result = result.filter(
        (w) =>
          w.tags.some((t) => t.toLowerCase().includes(catLabel.split(' ')[0])) ||
          w.description.toLowerCase().includes(catLabel),
      );
    }
    return result;
  }, [wishes, search, activeCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Archive
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Explore memories by place, era & theme
        </Text>

        {/* Search */}
        <View style={[styles.searchRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by place, tag, or memory…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(w) => w.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        ListHeaderComponent={
          <>
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cats}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 8 }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActiveCategory((prev) => (prev === cat.key ? null : cat.key));
                  }}
                  style={[
                    styles.catBtn,
                    {
                      backgroundColor:
                        activeCategory === cat.key ? colors.primary : colors.secondary,
                      borderColor:
                        activeCategory === cat.key ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={cat.icon}
                    size={14}
                    color={activeCategory === cat.key ? colors.primaryForeground : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.catLabel,
                      {
                        color:
                          activeCategory === cat.key
                            ? colors.primaryForeground
                            : colors.secondaryForeground,
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Featured fulfillments */}
            {!search && !activeCategory && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                    Featured Memories
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 16 }}
                >
                  {fulfillments.map((f, idx) => (
                    <TouchableOpacity
                      key={f.id}
                      style={[styles.featuredCard, { backgroundColor: colors.card }]}
                      activeOpacity={0.85}
                      onPress={() => router.push(`/wish/${f.wishId}`)}
                    >
                      <Image
                        source={
                          idx % 2 === 0
                            ? (LOCAL_IMAGES.hero as any)
                            : (LOCAL_IMAGES.archive as any)
                        }
                        style={styles.featuredImage}
                        resizeMode="cover"
                      />
                      <View style={styles.featuredMeta}>
                        <Text
                          style={[styles.featuredTitle, { color: colors.foreground }]}
                          numberOfLines={2}
                        >
                          {f.wishTitle}
                        </Text>
                        <View style={styles.knightRow}>
                          <Feather name="shield" size={11} color={colors.primary} />
                          <Text style={[styles.knightText, { color: colors.primary }]}>
                            {f.knightName}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                    All Wishes
                  </Text>
                  <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                    {wishes.length}
                  </Text>
                </View>
              </>
            )}

            {search || activeCategory ? (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Results
                </Text>
                <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                  {filtered.length}
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item: wish }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() => router.push(`/wish/${wish.id}`)}
          >
            <Avatar name={wish.userName} size={40} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={2}>
                {wish.title}
              </Text>
              <View style={styles.rowMeta}>
                <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                <Text style={[styles.rowLoc, { color: colors.mutedForeground }]}>
                  {wish.location}
                </Text>
                <View style={[styles.dot, { backgroundColor: colors.muted }]} />
                <Text style={[styles.rowLoc, { color: wish.status === 'open' ? colors.accent : '#4ade80' }]}>
                  {wish.status === 'open' ? 'Open' : 'Fulfilled'}
                </Text>
              </View>
              <View style={styles.rowTags}>
                {wish.tags.slice(0, 2).map((t) => (
                  <TagChip key={t} label={t} small />
                ))}
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={36} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No memories found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, gap: 4 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: 12 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 4,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14 },
  cats: { marginBottom: 4 },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  catLabel: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  sectionCount: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  featuredCard: { width: 200, borderRadius: 14, overflow: 'hidden' },
  featuredImage: { width: 200, height: 130 },
  featuredMeta: { padding: 10, gap: 4 },
  featuredTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18 },
  knightRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  knightText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  list: { paddingTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  rowContent: { flex: 1, gap: 4 },
  rowTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowLoc: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  dot: { width: 3, height: 3, borderRadius: 2 },
  rowTags: { flexDirection: 'row', gap: 5, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15 },
});
