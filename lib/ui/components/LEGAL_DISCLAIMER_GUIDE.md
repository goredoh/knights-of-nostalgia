/**
 * Implementation Guide: LegalDisclaimer Component
 * 
 * This guide shows where and how to integrate the LegalDisclaimer component
 * throughout your web and mobile applications.
 */

// ============================================================================
// WEB APP IMPLEMENTATIONS
// ============================================================================

// 1. FOOTER IMPLEMENTATION (Most Common)
// File: artifacts/web/src/components/Footer.tsx
// ============================================================================
/*
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Footer content */}
        </div>
        
        {/* Legal Disclaimer - Compact with expand option */}
        <LegalDisclaimer compact={true} className="mt-8 border-white/20" />
        
        <div className="border-t border-gray-700 pt-4 mt-8">
          <p className="text-gray-400 text-sm">© 2026 Knights of Nostalgia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
*/

// 2. ONBOARDING MODAL (First-Time Users)
// File: artifacts/web/src/components/OnboardingModal.tsx
// ============================================================================
/*
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Knights of Nostalgia</h2>
          
          {/* Full disclaimer - not collapsible */}
          <LegalDisclaimer forceFull={true} />
          
          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="accept" className="text-sm">
              I have read and agree to the legal terms and user responsibilities
            </label>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              onClick={onComplete}
              disabled={!accepted}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

// 3. UPLOAD MEDIA PAGE
// File: artifacts/web/src/pages/UploadMedia.tsx
// ============================================================================
/*
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function UploadMediaPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Share Your Nostalgic Memory</h1>
      
      {/* Compact disclaimer at the top */}
      <LegalDisclaimer compact={true} />
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        {/* Upload form here */}
      </div>
    </div>
  );
}
*/

// 4. SETTINGS PAGE
// File: artifacts/web/src/pages/Settings.tsx
// ============================================================================
/*
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Account settings */}
        {/* Privacy settings */}
        {/* Etc */}
        
        {/* Full disclaimer in settings */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Legal & Policies</h2>
          <LegalDisclaimer compact={false} />
        </section>
      </div>
    </div>
  );
}
*/

// ============================================================================
// MOBILE APP IMPLEMENTATIONS (Expo/React Native)
// ============================================================================

// 5. MOBILE SETTINGS SCREEN
// File: artifacts/mobile/src/screens/SettingsScreen.tsx
// ============================================================================
/*
import { View, ScrollView, Text } from 'react-native';
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Settings</Text>
        
        {/* Settings content */}
        
        {/* Disclaimer section */}
        <View className="mt-8">
          <LegalDisclaimer compact={false} />
        </View>
      </View>
    </ScrollView>
  );
}
*/

// 6. MOBILE UPLOAD SCREEN
// File: artifacts/mobile/src/screens/UploadScreen.tsx
// ============================================================================
/*
import { View, ScrollView } from 'react-native';
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function UploadScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Show disclaimer before upload form */}
        <LegalDisclaimer compact={true} />
        
        {/* Upload form */}
      </View>
    </ScrollView>
  );
}
*/

// 7. MOBILE ONBOARDING
// File: artifacts/mobile/src/screens/OnboardingScreen.tsx
// ============================================================================
/*
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LegalDisclaimer } from '@workspace/ui/components/LegalDisclaimer';

export function OnboardingScreen({ navigation }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Welcome!</Text>
        
        {/* Full disclaimer - required reading */}
        <LegalDisclaimer forceFull={true} />
        
        <TouchableOpacity
          onPress={() => setAccepted(!accepted)}
          className="flex-row items-center mt-6"
        >
          <View className={`w-5 h-5 border-2 rounded mr-3 ${
            accepted ? 'bg-red-600 border-red-600' : 'border-gray-400'
          }`}>
            {accepted && <Text className="text-white font-bold">✓</Text>}
          </View>
          <Text className="text-sm flex-1">
            I understand and accept these terms
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          disabled={!accepted}
          className={`mt-6 p-4 rounded-lg ${
            accepted ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-white font-bold text-center">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
*/

// ============================================================================
// PLACEMENT STRATEGY
// ============================================================================

/*
COMPACT MODE (compact={true}):
- Footer of every page
- Before upload forms
- In list item previews
- Sidebar disclaimers
- Best for: Recurring visibility without interruption

FULL MODE (compact={false}):
- Settings/Legal pages
- Dedicated disclaimer sections
- Legal documentation pages
- Best for: When users explicitly seek full terms

FORCE FULL MODE (forceFull={true}):
- Onboarding flow (critical - must be read)
- First-time upload experience
- Account creation
- Best for: Non-negotiable acknowledgment

PLACEMENT BEST PRACTICES:
1. ALWAYS show on upload pages
2. ALWAYS show in onboarding
3. ALWAYS show in footer (compact)
4. Show in settings (full)
5. Show before location sharing features
6. Show in mobile bottom navigation links
*/

export const DISCLAIMER_IMPLEMENTATION_COMPLETE = true;
