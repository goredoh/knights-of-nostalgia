import React from 'react';
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
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/Avatar';
import { TagChip } from '@/components/TagChip';
import { EmptyState } from '@/components/EmptyState';

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function QuestsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishes, currentUser } = useApp();

  const openWishes = wishes
    .filter((w) => w.status === 'open')
    .sort((a, b) => b.tipAmount - a.tipAmount);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={openWishes}
        keyExtractor={(w) => w.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        ListHeaderComponent={
          <>
            {/* Hero banner */}
            <LinearGradient
              colors={['#1a1508', '#0D0F1A']}
              style={[styles.banner, { paddingTop: topPad + 14 }]}
            >
              <View style={styles.bannerIcon}>
                <Feather name="shield" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.bannerTitle, { color: colors.foreground }]}>
                Quest Board
              </Text>
              <Text style={[styles.bannerSub, { color: colors.mutedForeground }]}>
                Open wishes waiting for a Knight
              </Text>

              {/* Points card */}
              <View style={[styles.pointsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.pointsLeft}>
                  <Text style={[styles.pointsLabel, { color: colors.mutedForeground }]}>
                    Your Points
                  </Text>
                  <Text style={[styles.pointsValue, { color: colors.primary }]}>
                    {currentUser.points}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.pointsRight}>
                  <Text style={[styles.pointsLabel, { color: colors.mutedForeground }]}>
                    Fulfilled
                  </Text>
                  <Text style={[styles.pointsValue, { color: colors.foreground }]}>
                    {currentUser.fulfillCount}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.pointsRight}>
                  <Text style={[styles.pointsLabel, { color: colors.mutedForeground }]}>
                    Rank
                  </Text>
                  <Text style={[styles.pointsValue, { color: colors.foreground }]}>
                    Knight
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* How it works */}
            <View style={[styles.howSection, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.howTitle, { color: colors.foreground }]}>How Quests Work</Text>
              <View style={styles.howSteps}>
                {[
                  { icon: 'eye' as const, text: 'Browse open wishes below' },
                  { icon: 'camera' as const, text: 'Capture photos, video, or audio at that location' },
                  { icon: 'upload' as const, text: 'Submit your fulfillment — earn points & tips' },
                ].map((step, i) => (
                  <View key={i} style={styles.howStep}>
                    <View style={[styles.stepIcon, { backgroundColor: colors.muted }]}>
                      <Feather name={step.icon} size={14} color={colors.primary} />
                    </View>
                    <Text style={[styles.stepText, { color: colors.secondaryForeground }]}>
                      {step.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Open Wishes
              </Text>
              <View style={[styles.countBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.countText, { color: colors.mutedForeground }]}>
                  {openWishes.length}
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item: wish }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.88}
            onPress={() => router.push(`/wish/${wish.id}`)}
          >
            {/* Top */}
            <View style={styles.cardHeader}>
              <Avatar name={wish.userName} size={38} />
              <View style={styles.cardHeaderText}>
                <Text style={[styles.wisherName, { color: colors.mutedForeground }]}>
                  {wish.userName} is wishing for…
                </Text>
                <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
                  {wish.title}
                </Text>
              </View>
            </View>

            {/* Location + date */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="map-pin" size={13} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.secondaryForeground }]}>
                  {wish.location}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={13} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {timeAgo(wish.createdAt)}
                </Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tags}>
              {wish.tags.slice(0, 3).map((t) => (
                <TagChip key={t} label={t} small />
              ))}
            </View>

            {/* Footer */}
            <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
              {wish.tipAmount > 0 ? (
                <View style={[styles.tipBadge, { backgroundColor: '#1a1508' }]}>
                  <Feather name="dollar-sign" size={13} color={colors.primary} />
                  <Text style={[styles.tipText, { color: colors.primary }]}>
                    {wish.tipAmount} tip offered
                  </Text>
                </View>
              ) : (
                <Text style={[styles.noTip, { color: colors.mutedForeground }]}>
                  No tip — help anyway
                </Text>
              )}
              <TouchableOpacity
                style={[styles.acceptBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/wish/${wish.id}`);
                }}
              >
                <Feather name="shield" size={14} color={colors.primaryForeground} />
                <Text style={[styles.acceptText, { color: colors.primaryForeground }]}>
                  Accept Quest
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="flag"
            title="No open quests"
            subtitle="All wishes have been fulfilled. Check back later or post a wish of your own."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {},
  banner: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 6,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(201,151,42,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bannerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: -0.3 },
  bannerSub: { fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: 16 },
  pointsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    width: '100%',
  },
  pointsLeft: { flex: 1, alignItems: 'center', gap: 4 },
  pointsRight: { flex: 1, alignItems: 'center', gap: 4 },
  pointsLabel: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  pointsValue: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  divider: { width: 1, marginHorizontal: 8 },
  howSection: {
    margin: 16,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  howTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  howSteps: { gap: 10 },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  cardHeaderText: { flex: 1, gap: 3 },
  wisherName: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 21 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  tags: { flexDirection: 'row', gap: 6 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 10,
  },
  tipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  tipText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  noTip: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1 },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginLeft: 'auto',
  },
  acceptText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});
