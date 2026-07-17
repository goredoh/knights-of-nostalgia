import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp, type Wish } from '@/context/AppContext';
import { Avatar } from './Avatar';
import { TagChip } from './TagChip';

interface WishCardProps {
  wish: Wish;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function WishCard({ wish }: WishCardProps) {
  const colors = useColors();
  const { likeWish } = useApp();
  const liked = wish.likedBy.includes('me');

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeWish(wish.id);
  };

  const handleOpen = () => {
    router.push(`/wish/${wish.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleOpen}
      activeOpacity={0.92}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Avatar name={wish.userName} size={36} />
        <View style={styles.headerText}>
          <Text style={[styles.userName, { color: colors.foreground }]}>{wish.userName}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {wish.location}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: wish.status === 'open' ? colors.secondary : '#1a2e1a' }]}>
          <View style={[styles.statusDot, { backgroundColor: wish.status === 'open' ? colors.accent : '#4ade80' }]} />
          <Text style={[styles.statusText, { color: wish.status === 'open' ? colors.accent : '#4ade80' }]}>
            {wish.status === 'open' ? 'Open' : 'Fulfilled'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {wish.title}
      </Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={3}>
        {wish.description}
      </Text>

      {/* Tags */}
      {wish.tags.length > 0 && (
        <View style={styles.tags}>
          {wish.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} small />
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
          <Feather name="heart" size={16} color={liked ? '#E8544A' : colors.mutedForeground} />
          <Text style={[styles.actionText, { color: liked ? '#E8544A' : colors.mutedForeground }]}>
            {wish.likedBy.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={handleOpen} activeOpacity={0.7}>
          <Feather name="message-circle" size={16} color={colors.mutedForeground} />
          <Text style={[styles.actionText, { color: colors.mutedForeground }]}>
            {wish.fulfillmentCount}
          </Text>
        </TouchableOpacity>

        {wish.tipAmount > 0 && (
          <View style={[styles.tipBadge, { backgroundColor: colors.secondary }]}>
            <Feather name="dollar-sign" size={12} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.primary }]}>
              {wish.tipAmount} tip
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }} />
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {timeAgo(wish.createdAt)}
        </Text>

        {wish.status === 'open' && (
          <TouchableOpacity
            style={[styles.fulfillBtn, { backgroundColor: colors.primary }]}
            onPress={handleOpen}
            activeOpacity={0.8}
          >
            <Feather name="shield" size={13} color={colors.primaryForeground} />
            <Text style={[styles.fulfillText, { color: colors.primaryForeground }]}>
              Fulfill
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 14,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  tipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 2,
  },
  tipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  fulfillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  fulfillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
});
