import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp, type Fulfillment } from '@/context/AppContext';
import { Avatar } from './Avatar';

// Map local image keys to require()
const LOCAL_IMAGES: Record<string, ReturnType<typeof require>> = {
  'local:hero': require('@/assets/images/kon_hero.jpg'),
  'local:archive': require('@/assets/images/kon_archive.jpg'),
};

function resolveMedia(uri: string) {
  return LOCAL_IMAGES[uri] ? LOCAL_IMAGES[uri] : { uri };
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

interface FulfillmentCardProps {
  fulfillment: Fulfillment;
  compact?: boolean;
}

export function FulfillmentCard({ fulfillment, compact = false }: FulfillmentCardProps) {
  const colors = useColors();
  const { likeFulfillment, addComment, currentUser } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = fulfillment.likedBy.includes('me');

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeFulfillment(fulfillment.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addComment(fulfillment.id, commentText.trim());
    setCommentText('');
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Knight header */}
      <View style={styles.header}>
        <Avatar name={fulfillment.knightName} size={36} isKnight />
        <View style={styles.headerText}>
          <View style={styles.knightRow}>
            <Feather name="shield" size={12} color={colors.primary} />
            <Text style={[styles.knightName, { color: colors.primary }]}>
              {fulfillment.knightName}
            </Text>
          </View>
          <Text style={[styles.wishRef, { color: colors.mutedForeground }]} numberOfLines={1}>
            fulfilled for {fulfillment.wishUserName}
          </Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {timeAgo(fulfillment.createdAt)}
        </Text>
      </View>

      {/* Wish title ref */}
      <Text style={[styles.wishTitle, { color: colors.mutedForeground }]} numberOfLines={1}>
        "{fulfillment.wishTitle}"
      </Text>

      {/* Media */}
      {fulfillment.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <Image
            source={resolveMedia(fulfillment.media[0].uri)}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {fulfillment.media.length > 1 && (
            <View style={styles.extraImages}>
              {fulfillment.media.slice(1, 3).map((m, idx) => (
                <Image
                  key={idx}
                  source={resolveMedia(m.uri)}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
          {fulfillment.sponsor && (
            <View style={[styles.sponsorBadge, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
              <Text style={styles.sponsorText}>Thanks to {fulfillment.sponsor}</Text>
            </View>
          )}
        </View>
      )}

      {/* Caption */}
      <Text style={[styles.caption, { color: colors.foreground }]}>
        {fulfillment.caption}
      </Text>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
          <Feather
            name={liked ? 'heart' : 'heart'}
            size={18}
            color={liked ? '#E8544A' : colors.mutedForeground}
          />
          <Text style={[styles.actionCount, { color: liked ? '#E8544A' : colors.mutedForeground }]}>
            {fulfillment.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => setShowComments((v) => !v)}
          activeOpacity={0.7}
        >
          <Feather name="message-circle" size={18} color={colors.mutedForeground} />
          <Text style={[styles.actionCount, { color: colors.mutedForeground }]}>
            {fulfillment.comments.length}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.tipBtn, { borderColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Feather name="dollar-sign" size={13} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.primary }]}>Tip Knight</Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && (
        <View style={[styles.comments, { borderTopColor: colors.border }]}>
          {fulfillment.comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Avatar name={c.userName} size={26} />
              <View style={[styles.commentBubble, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.commentUser, { color: colors.accent }]}>{c.userName}</Text>
                <Text style={[styles.commentText, { color: colors.foreground }]}>{c.text}</Text>
              </View>
            </View>
          ))}

          {/* Input */}
          <View style={styles.commentInputRow}>
            <Avatar name={currentUser.name} size={28} />
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.secondary,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Add a memory..."
              placeholderTextColor={colors.mutedForeground}
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleComment}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleComment} activeOpacity={0.7}>
              <Feather name="send" size={18} color={commentText.trim() ? colors.primary : colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    gap: 12,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  headerText: { flex: 1, gap: 2 },
  knightRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  knightName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  wishRef: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  wishTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    fontStyle: 'italic',
    paddingHorizontal: 14,
  },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  mediaContainer: { position: 'relative' },
  mainImage: { width: '100%', height: 220 },
  extraImages: { flexDirection: 'row', gap: 2 },
  thumbImage: { flex: 1, height: 90 },
  sponsorBadge: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sponsorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    gap: 16,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  tipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  tipText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  comments: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  comment: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  commentBubble: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  commentUser: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  commentText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
