import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export default function CreateWishScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createWish } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [tip, setTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!title.trim() || !description.trim()) {
      setError('Please give your wish a title and a story.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (!location.trim()) {
      setError('Please add a location so Knights know where to go.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createWish({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      tags: tagList,
      tipAmount: Number(tip) || 0,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 400);
  };

  const inputCommon = {
    backgroundColor: colors.secondary,
    color: colors.foreground,
    borderColor: colors.border,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'New Wish',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
          headerRight: () => (
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} disabled={isSubmitting}>
              <Text style={[styles.headerPost, { color: colors.primary, opacity: isSubmitting ? 0.5 : 1 }]}>
                Post
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.form,
            { paddingBottom: insets.bottom + 40 },
          ]}
        >
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            What do you miss? Be specific — Knights will try to capture it.
          </Text>

          <TextInput
            style={[styles.input, inputCommon, { height: 54, fontSize: 18, fontFamily: 'Inter_600SemiBold' }]}
            placeholder="I miss..."
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />

          <TextInput
            style={[styles.input, inputCommon, styles.textArea]}
            placeholder="Tell the story. When did it happen? What made it special? What would it mean to see it again?"
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={1200}
          />

          <View style={[styles.input, inputCommon, styles.locationRow]}>
            <Feather name="map-pin" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.locationInput, { color: colors.foreground }]}
              placeholder="City, neighborhood, or exact address"
              placeholderTextColor={colors.mutedForeground}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={[styles.input, inputCommon, styles.locationRow]}>
            <Feather name="tag" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.locationInput, { color: colors.foreground }]}
              placeholder="Tags separated by commas, e.g. Beach, 90s, Family"
              placeholderTextColor={colors.mutedForeground}
              value={tags}
              onChangeText={setTags}
            />
          </View>

          <View style={[styles.input, inputCommon, styles.locationRow]}>
            <Feather name="dollar-sign" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.locationInput, { color: colors.foreground }]}
              placeholder="Optional tip for a Knight (points)"
              placeholderTextColor={colors.mutedForeground}
              value={tip}
              onChangeText={setTip}
              keyboardType="numeric"
            />
          </View>

          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}

          <View style={[styles.tipBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="info" size={16} color={colors.mutedForeground} />
            <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
              Wishers and Knights are both welcome. A great wish includes a feeling, a time, and a place.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16, paddingTop: 12, gap: 14 },
  headerPost: { fontFamily: 'Inter_700Bold', fontSize: 16, paddingHorizontal: 12 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginBottom: 4 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: { minHeight: 140, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, paddingTop: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 0 },
  locationInput: { flex: 1, height: 50, fontFamily: 'Inter_400Regular', fontSize: 15 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 14, textAlign: 'center' },
  tipBox: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'flex-start',
  },
  tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
});
