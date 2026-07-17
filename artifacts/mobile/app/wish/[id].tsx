import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useColors } from '@/hooks/useColors';
import { useApp, type MediaItem } from '@/context/AppContext';
import { Avatar } from '@/components/Avatar';
import { TagChip } from '@/components/TagChip';
import { FulfillmentCard } from '@/components/FulfillmentCard';

const LOCAL_IMAGES: Record<string, ReturnType<typeof require>> = {
  hero: require('@/assets/images/kon_hero.jpg'),
  archive: require('@/assets/images/kon_archive.jpg'),
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

export default function WishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { wishes, fulfillments, likeWish, createFulfillment, currentUser } = useApp();

  const wish = wishes.find((w) => w.id === id);
  const wishFulfillments = fulfillments.filter((f) => f.wishId === id);
  const [showFulfill, setShowFulfill] = useState(false);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);

  if (!wish) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Wish', headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.foreground }} />
        <Text style={{ color: colors.foreground, textAlign: 'center', marginTop: 100 }}>Wish not found.</Text>
      </View>
    );
  }

  const liked = wish.likedBy.includes('me');
  const isOpen = wish.status === 'open';
  const isMyWish = wish.userId === 'me';
  const canFulfill = currentUser.role !== 'wisher' && isOpen && !isMyWish;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    likeWish(wish.id);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setMedia((prev) => [...prev, { type: 'photo', uri: result.assets[0].uri }]);
      }
    } catch (_) {
      Alert.alert('Unable to open photo library.');
    }
  };

  const submitFulfillment = () => {
    if (!caption.trim()) {
      Alert.alert('Add a caption', 'Tell the Wisher what you found or how it felt to be there.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    createFulfillment(wish.id, caption.trim(), media.length > 0 ? media : [{ type: 'photo', uri: 'local:hero' }]);
    setShowFulfill(false);
    setCaption('');
    setMedia([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Wish',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Wish card */}
        <View style={[styles.wishCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Avatar name={wish.userName} size={44} />
            <View style={styles.headerText}>
              <Text style={[styles.userName, { color: colors.foreground }]}>{wish.userName}</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                <Text style={[styles.location, { color: colors.mutedForeground }]}>{wish.location}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: isOpen ? colors.secondary : '#1a2e1a' }]}>
              <View style={[styles.statusDot, { backgroundColor: isOpen ? colors.accent : '#4ade80' }]} />
              <Text style={[styles.statusText, { color: isOpen ? colors.accent : '#4ade80' }]}>
                {isOpen ? 'Open' : 'Fulfilled'}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>{wish.title}</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>{wish.description}</Text>

          <View style={styles.tags}>
            {wish.tags.map((tag) => (
              <TagChip key={tag} label={tag} small />
            ))}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
              <Feather name="heart" size={18} color={liked ? '#E8544A' : colors.mutedForeground} />
              <Text style={[styles.actionText, { color: liked ? '#E8544A' : colors.mutedForeground }]}>
                {wish.likedBy.length}
              </Text>
            </TouchableOpacity>

            <View style={styles.action}>
              <Feather name="message-circle" size={18} color={colors.mutedForeground} />
              <Text style={[styles.actionText, { color: colors.mutedForeground }]}>
                {wishFulfillments.length}
              </Text>
            </View>

            <View style={{ flex: 1 }} />
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{timeAgo(wish.createdAt)}</Text>
          </View>
        </View>

        {/* Fulfill button */}
        {canFulfill && (
          <TouchableOpacity
            style={[styles.fulfillCta, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowFulfill(true);
            }}
          >
            <Feather name="shield" size={18} color={colors.primaryForeground} />
            <Text style={[styles.fulfillCtaText, { color: colors.primaryForeground }]}>
              Fulfill this wish as a Knight
            </Text>
          </TouchableOpacity>
        )}

        {isMyWish && isOpen && (
          <View style={[styles.infoBox, { backgroundColor: colors.secondary }]}>
            <Feather name="clock" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Your wish is open. Knights near {wish.location} will see it on the Quest Board.
            </Text>
          </View>
        )}

        {/* Fulfillments */}
        {wishFulfillments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Fulfilled by Knights
            </Text>
            {wishFulfillments.map((f) => (
              <FulfillmentCard key={f.id} fulfillment={f} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Fulfill modal */}
      <Modal
        animationType="slide"
        visible={showFulfill}
        onRequestClose={() => setShowFulfill(false)}
        transparent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            <View style={[styles.modal, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  Fulfill Wish
                </Text>
                <TouchableOpacity onPress={() => setShowFulfill(false)}>
                  <Feather name="x" size={24} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
                Capture what {wish.userName} is longing for. Add a photo, video, or just a note.
              </Text>

              {/* Media preview */}
              {media.length > 0 && (
                <View style={styles.mediaPreview}>
                  {media.map((m, i) => (
                    <Image key={i} source={resolveMedia(m.uri)} style={styles.mediaThumb} />
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.attachBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Feather name="image" size={18} color={colors.mutedForeground} />
                <Text style={[styles.attachText, { color: colors.mutedForeground }]}>
                  {media.length > 0 ? 'Add another photo' : 'Attach photo'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.captionInput,
                  { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border },
                ]}
                placeholder="What did you find? What did it feel like to be there?"
                placeholderTextColor={colors.mutedForeground}
                multiline
                textAlignVertical="top"
                value={caption}
                onChangeText={setCaption}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={submitFulfillment}
                activeOpacity={0.85}
              >
                <Feather name="shield" size={18} color={colors.primaryForeground} />
                <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                  Submit Fulfillment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wishCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerText: { flex: 1, gap: 3 },
  userName: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 26 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingTop: 12, gap: 16 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  fulfillCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
  },
  fulfillCtaText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  infoText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  section: { paddingHorizontal: 16, gap: 10 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  modalSub: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  mediaPreview: { flexDirection: 'row', gap: 8 },
  mediaThumb: { width: 80, height: 80, borderRadius: 12 },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  attachText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  captionInput: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 10,
  },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 15 },
});
