import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp, type Wish, type Fulfillment } from '@/context/AppContext';
import { WishCard } from '@/components/WishCard';
import { FulfillmentCard } from '@/components/FulfillmentCard';
import { EmptyState } from '@/components/EmptyState';

type Filter = 'all' | 'wishes' | 'fulfilled';

type FeedItem =
  | { type: 'wish'; data: Wish }
  | { type: 'fulfillment'; data: Fulfillment };

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'wishes', label: 'Wishes' },
  { key: 'fulfilled', label: 'Fulfilled' },
];

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishes, fulfillments, unreadCount } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  // Build interleaved feed
  const feedItems: FeedItem[] = React.useMemo(() => {
    if (filter === 'wishes')
      return wishes.map((w) => ({ type: 'wish' as const, data: w }));
    if (filter === 'fulfilled')
      return fulfillments.map((f) => ({ type: 'fulfillment' as const, data: f }));

    // interleave wishes and fulfillments sorted by date
    const all: FeedItem[] = [
      ...wishes.map((w) => ({ type: 'wish' as const, data: w })),
      ...fulfillments.map((f) => ({ type: 'fulfillment' as const, data: f })),
    ].sort(
      (a, b) =>
        new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime(),
    );

    return all;
  }, [filter, wishes, fulfillments]);

  const topPad =
    Platform.OS === 'web'
      ? 67
      : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.background }]}>
        <View style={styles.logoArea}>
          <Feather name="shield" size={22} color={colors.primary} />
          <Text style={[styles.logoText, { color: colors.foreground }]}>
            Knights<Text style={{ color: colors.primary }}> of Nostalgia</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
            style={styles.iconBtn}
          >
            <Feather name="bell" size={22} color={colors.foreground} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => {
              Haptics.selectionAsync();
              setFilter(f.key);
            }}
            style={[
              styles.filterTab,
              filter === f.key && { borderBottomColor: colors.primary },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterLabel,
                {
                  color: filter === f.key ? colors.primary : colors.mutedForeground,
                },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feed */}
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.data.id}
        renderItem={({ item }) =>
          item.type === 'wish' ? (
            <WishCard wish={item.data} />
          ) : (
            <FulfillmentCard fulfillment={item.data} />
          )
        }
        contentContainerStyle={[
          styles.list,
          feedItems.length === 0 && styles.listEmpty,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="wind"
            title="Nothing here yet"
            subtitle="Be the first to share a wish or fulfill one for someone else."
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 90,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/create');
        }}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={26} color={colors.primaryForeground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.3 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 6, position: 'relative' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'Inter_700Bold' },
  filterRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  listEmpty: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9972A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
