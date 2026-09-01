import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

/**
 * LegalDisclaimer Component
 * 
 * A reusable disclaimer component for both web and mobile versions.
 * Displays critical legal warnings about property access, media gathering, and liability.
 * 
 * Features:
 * - Expandable/collapsible design for compact display
 * - Accessible with proper ARIA labels
 * - Works on both web (React + Tailwind) and mobile (Expo/React Native)
 * - Professional styling with clear visual hierarchy
 * 
 * Usage Examples:
 * 
 * Web Footer:
 * ```tsx
 * <LegalDisclaimer compact={true} />
 * ```
 * 
 * Onboarding Modal:
 * ```tsx
 * <LegalDisclaimer forceFull={true} />
 * ```
 * 
 * Settings Page:
 * ```tsx
 * <LegalDisclaimer compact={false} />
 * ```
 */

interface LegalDisclaimerProps {
  /** Show compact version (header + expand button) */
  compact?: boolean;
  /** Force full display (no collapse option) */
  forceFull?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  compact = true,
  forceFull = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact || forceFull);

  const toggleExpand = () => {
    if (compact && !forceFull) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`border-l-4 border-red-500 bg-red-50 p-4 my-4 rounded ${className}`}
      role="alert"
      aria-label="Legal disclaimer and user responsibilities"
    >
      {/* Header */}
      <div
        className={`flex items-start gap-3 ${
          compact && !forceFull ? 'cursor-pointer hover:bg-red-100 p-2 -m-2 rounded transition-colors' : ''
        }`}
        onClick={toggleExpand}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && compact && !forceFull) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role={compact && !forceFull ? 'button' : undefined}
        tabIndex={compact && !forceFull ? 0 : undefined}
      >
        <AlertTriangle
          className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 text-lg">
            ⚠️ Important Legal Notice & User Responsibilities
          </h3>
          {compact && !forceFull && (
            <p className="text-sm text-red-700 mt-1">
              Click to read important terms before gathering media or visiting locations.
            </p>
          )}
        </div>
        {compact && !forceFull && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-red-600 hover:text-red-800 flex-shrink-0 p-1 hover:bg-red-200 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse disclaimer' : 'Expand disclaimer'}
            type="button"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* Full Content */}
      {isExpanded && (
        <div className="mt-4 text-sm text-red-900 space-y-4">
          {/* Property Rights Section */}
          <section>
            <h4 className="font-semibold text-red-950 mb-2 flex items-center gap-2">
              <span>🚫</span> Property Rights & Trespassing
            </h4>
            <p className="leading-relaxed">
              You are <strong>solely responsible</strong> for ensuring you have proper authorization before capturing any media (photos, videos, etc.) on any property. Do not enter private property, restricted areas, or locations without explicit permission from the owner or authorized representative. <strong>Trespassing is illegal and we do not condone such activity.</strong>
            </p>
          </section>

          {/* Respect for Locations Section */}
          <section>
            <h4 className="font-semibold text-red-950 mb-2 flex items-center gap-2">
              <span>📍</span> Respect for Privacy & Locations
            </h4>
            <p className="leading-relaxed">
              When visiting nostalgic sites or properties, you must obtain all necessary permits and permissions. Respect "No Trespassing" signs, private boundaries, and local regulations. Any damage to property, disturbance of residents, or unauthorized access is <strong>your responsibility alone.</strong>
            </p>
          </section>

          {/* No Liability Section */}
          <section>
            <h4 className="font-semibold text-red-950 mb-2 flex items-center gap-2">
              <span>⚖️</span> Limited Liability
            </h4>
            <p className="leading-relaxed mb-2">
              Knights of Nostalgia and its operators assume <strong>no responsibility</strong> for:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1 text-red-900">
              <li>Legal consequences from your failure to obtain permissions</li>
              <li>Trespassing, property damage, or disturbances you cause</li>
              <li>Violations of local, state, or federal laws</li>
              <li>Civil or criminal liability from your activities</li>
              <li>Any actions taken based on information or locations shared on this platform</li>
            </ul>
          </section>

          {/* Content Ownership Section */}
          <section>
            <h4 className="font-semibold text-red-950 mb-2 flex items-center gap-2">
              <span>📸</span> Content Ownership & Rights
            </h4>
            <p className="leading-relaxed">
              You warrant that you own or have legal rights to all media you upload. You are responsible for ensuring compliance with copyright, privacy, and property laws. Do not upload media captured without permission, containing identifiable individuals without consent, or from locations where you lack authorization.
            </p>
          </section>

          {/* User Agreement Section */}
          <section>
            <h4 className="font-semibold text-red-950 mb-2 flex items-center gap-2">
              <span>✅</span> By Using This Platform, You Agree To:
            </h4>
            <ul className="list-disc list-inside ml-2 space-y-1 text-red-900">
              <li>Follow all applicable laws and regulations in your jurisdiction</li>
              <li>Respect private property and local ordinances</li>
              <li>Obtain all necessary permissions and permits before visiting locations</li>
              <li>Act ethically and responsibly in all activities</li>
              <li>Accept full legal liability for your actions</li>
              <li>Indemnify Knights of Nostalgia from any claims or damages</li>
            </ul>
          </section>

          {/* Warning Box */}
          <section className="bg-red-100 p-3 rounded-md border border-red-300 mt-4">
            <p className="text-xs text-red-950 font-semibold">
              🔴 <strong>VIOLATION WARNING:</strong> Violation of these terms may result in immediate account suspension, removal of all content, and potential legal action. Users may be held liable for any damages or illegal activities.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default LegalDisclaimer;