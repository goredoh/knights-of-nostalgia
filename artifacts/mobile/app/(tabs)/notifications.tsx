import React, { useEffect } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp, type AppNotification } from '@/context/AppContext';
import { EmptyState } from '@/components/EmptyState';

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const TYPE_CONFIG = {
  wish_fulfilled: { icon: 'shield' as const, color: '#C9972A' },
  comment: { icon: 'message-circle' as const, color: '#60A5FA' },
  tip: { icon: 'dollar-sign' as const, color: '#4ADE80' },
  like: { icon: 'heart' as const, color: '#F87171' },
  new_knight: { icon: 'user' as const, color: '#C9972A' },
  quest_accepted: { icon: 'flag' as const, color: '#A78BFA' },
};

function NotifRow({ notif }: { notif: AppNotification }) {
  const colors = useColors();
  const config = TYPE_CONFIG[notif.type];

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: notif.read ? colors.card : `${colors.primary}12`,
          borderColor: notif.read ? colors.border : `${colors.primary}30`,
        },
      ]}
      activeOpacity={0.8}
      onPress={() => notif.wishId && router.push(`/wish/${notif.wishId}`)}
    >
      <View style={[styles.iconBg, { backgroundColor: `${config.color}20` }]}>
        <Feather name={config.icon} size={18} color={config.color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.foreground }]} numberOfLines={3}>
          {notif.message}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {timeAgo(notif.createdAt)}
        </Text>
      </View>
      {!notif.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationsRead } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  useEffect(() => {
    const timer = setTimeout(() => markNotificationsRead(), 1500);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Activity</Text>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(n) => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          sorted.length === 0 && styles.listEmpty,
          { paddingBottom: insets.bottom + 100 },
        ]}
        renderItem={({ item }) => <NotifRow notif={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="bell"
            title="No activity yet"
            subtitle="When someone fulfills your wish or comments, you'll see it here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, letterSpacing: -0.5 },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  listEmpty: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, gap: 4 },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
});
