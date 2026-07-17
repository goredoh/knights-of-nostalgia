import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp, type UserRole } from '@/context/AppContext';
import { Avatar } from '@/components/Avatar';
import { WishCard } from '@/components/WishCard';
import { FulfillmentCard } from '@/components/FulfillmentCard';

type Tab = 'wishes' | 'fulfilled';

const ROLES: { key: UserRole; label: string; desc: string }[] = [
  { key: 'wisher', label: 'Wisher', desc: 'Post memories you miss' },
  { key: 'knight', label: 'Knight', desc: 'Fulfill wishes for others' },
  { key: 'both', label: 'Both', desc: 'Wisher & Knight' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, wishes, fulfillments, setUserRole } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('wishes');
  const [showRolePicker, setShowRolePicker] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const myWishes = wishes.filter((w) => w.userId === 'me');
  const myFulfillments = fulfillments.filter((f) => f.knightId === 'me');

  const roleLabel =
    currentUser.role === 'both'
      ? 'Wisher & Knight'
      : currentUser.role === 'knight'
      ? 'Knight'
      : 'Wisher';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header gradient */}
        <LinearGradient
          colors={['#1a1204', '#0D0F1A']}
          style={[styles.headerGradient, { paddingTop: topPad + 14 }]}
        >
          <View style={styles.avatarRow}>
            <Avatar name={currentUser.name} size={72} isKnight={currentUser.role !== 'wisher'} />
            <View style={styles.headerInfo}>
              <Text style={[styles.name, { color: colors.foreground }]}>{currentUser.name}</Text>
              <Text style={[styles.username, { color: colors.mutedForeground }]}>
                @{currentUser.username}
              </Text>
              <TouchableOpacity
                style={[styles.roleBadge, { backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}40` }]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowRolePicker((v) => !v);
                }}
                activeOpacity={0.7}
              >
                <Feather
                  name={currentUser.role === 'wisher' ? 'star' : 'shield'}
                  size={12}
                  color={colors.primary}
                />
                <Text style={[styles.roleText, { color: colors.primary }]}>{roleLabel}</Text>
                <Feather name="chevron-down" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Role picker */}
          {showRolePicker && (
            <View style={[styles.rolePicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.roleOption,
                    currentUser.role === r.key && { backgroundColor: `${colors.primary}15` },
                  ]}
                  onPress={() => {
                    setUserRole(r.key);
                    setShowRolePicker(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={r.key === 'wisher' ? 'star' : 'shield'}
                    size={15}
                    color={currentUser.role === r.key ? colors.primary : colors.mutedForeground}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.roleOptLabel, { color: currentUser.role === r.key ? colors.primary : colors.foreground }]}>
                      {r.label}
                    </Text>
                    <Text style={[styles.roleOptDesc, { color: colors.mutedForeground }]}>
                      {r.desc}
                    </Text>
                  </View>
                  {currentUser.role === r.key && (
                    <Feather name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.bio, { color: colors.secondaryForeground }]}>{currentUser.bio}</Text>

          {/* Stats */}
          <View style={[styles.stats, { borderColor: colors.border }]}>
            {[
              { label: 'Points', value: currentUser.points, color: colors.primary },
              { label: 'Wishes', value: currentUser.wishCount, color: colors.foreground },
              { label: 'Fulfilled', value: currentUser.fulfillCount, color: colors.foreground },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* CTA buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/create');
              }}
            >
              <Feather name="plus" size={16} color={colors.primaryForeground} />
              <Text style={[styles.ctaBtnText, { color: colors.primaryForeground }]}>
                New Wish
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={16} color={colors.foreground} />
              <Text style={[styles.ctaBtnText, { color: colors.foreground }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
          {[
            { key: 'wishes' as Tab, label: `Wishes (${myWishes.length})` },
            { key: 'fulfilled' as Tab, label: `Fulfilled (${myFulfillments.length})` },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(t.key);
              }}
              style={[
                styles.tabBtn,
                activeTab === t.key && { borderBottomColor: colors.primary },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === t.key ? colors.primary : colors.mutedForeground },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'wishes' ? (
            myWishes.length === 0 ? (
              <View style={styles.emptyTab}>
                <Feather name="star" size={36} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No wishes yet. Share something you miss.
                </Text>
                <TouchableOpacity
                  style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/create')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>
                    Make a Wish
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              myWishes.map((w) => <WishCard key={w.id} wish={w} />)
            )
          ) : myFulfillments.length === 0 ? (
            <View style={styles.emptyTab}>
              <Feather name="shield" size={36} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                You haven't fulfilled any wishes yet. Browse the Quest Board.
              </Text>
            </View>
          ) : (
            myFulfillments.map((f) => <FulfillmentCard key={f.id} fulfillment={f} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { padding: 20, gap: 14 },
  avatarRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  headerInfo: { flex: 1, gap: 6, paddingTop: 4 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.3 },
  username: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
    marginTop: 2,
  },
  roleText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  rolePicker: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  roleOptLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  roleOptDesc: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  stats: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  statDivider: { width: 1, marginHorizontal: 4 },
  ctaRow: { flexDirection: 'row', gap: 10 },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  ctaBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  emptyTab: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
});
