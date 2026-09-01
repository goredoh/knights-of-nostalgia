import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

/**
 * LegalDisclaimer Component
 * 
 * A reusable disclaimer component for both web and mobile versions.
 * Displays critical legal warnings about property access, media gathering, and liability.
 * 
 * Usage:
 * - Web: Import and place in footer or modal
 * - Mobile: Import and place in settings or onboarding flow
 */

interface LegalDisclaimerProps {
  compact?: boolean; // Show compact version (just header + expand button)
  forceFull?: boolean; // Force full display
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  compact = true,
  forceFull = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact || forceFull);

  return (
    <div
      className={`border-l-4 border-red-500 bg-red-50 p-4 my-4 ${className}`}
      role="alert"
      aria-label="Legal disclaimer"
    >
      {/* Header */}
      <div
        className={`flex items-start gap-3 ${
          compact && !forceFull ? 'cursor-pointer' : ''
        }`}
        onClick={() => compact && !forceFull && setIsExpanded(!isExpanded)}
      >
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">
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
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-600 hover:text-red-800 flex-shrink-0"
            aria-label={isExpanded ? 'Collapse disclaimer' : 'Expand disclaimer'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Full Content */}
      {isExpanded && (
        <div className="mt-4 text-sm text-red-900 space-y-3">
          <section>
            <h4 className="font-semibold text-red-950 mb-1">
              🚫 Property Rights & Trespassing
            </h4>
            <p>
              You are <strong>solely responsible</strong> for ensuring you have proper authorization before capturing any media (photos, videos, etc.) on any property. Do not enter private property, restricted areas, or locations without explicit permission from the owner or authorized representative. <strong>Trespassing is illegal.</strong>
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-red-950 mb-1">
              📍 Respect for Locations & Communities
            </h4>
            <p>
              When visiting nostalgic sites or properties, you must obtain all necessary permits and permissions. Respect "No Trespassing" signs, private boundaries, and local regulations. Any damage to property, disturbance of residents, or unauthorized access is <strong>your responsibility alone.</strong>
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-red-950 mb-1">
              ⚖️ No Liability
            </h4>
            <p>
              Knights of Nostalgia and its operators assume <strong>no responsibility</strong> for:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1 mt-2">
              <li>Legal consequences from your failure to obtain permissions</li>
              <li>Trespassing, property damage, or disturbances you cause</li>
              <li>Violations of local, state, or federal laws</li>
              <li>Civil or criminal liability from your activities</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-red-950 mb-1">
              📸 Content You Share
            </h4>
            <p>
              You warrant that you own or have legal rights to all media you upload. You are responsible for ensuring compliance with copyright, privacy, and property laws. Do not upload media captured without permission.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-red-950 mb-1">
              ✅ By Using This Platform, You Agree To:
            </h4>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Follow all applicable laws and regulations</li>
              <li>Respect private property and local ordinances</li>
              <li>Obtain all necessary permissions and permits</li>
              <li>Act ethically and responsibly in all activities</li>
              <li>Accept full legal liability for your actions</li>
            </ul>
          </section>

          <section className="bg-red-100 p-3 rounded-md border border-red-200 mt-3">
            <p className="text-xs text-red-900">
              <strong>Violation of these terms may result in immediate account suspension and removal of content.</strong>
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default LegalDisclaimer;
