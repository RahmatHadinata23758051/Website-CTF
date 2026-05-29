import { FileText } from "lucide-react";
import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function TermsPage() {
  return (
    <LegalPageLayout
      icon={<FileText className="h-4 w-4" />}
      tag="02 // TERMS OF SERVICE"
      title={<>Terms of <span className="font-semibold text-slate-400">Service</span></>}
      subtitle="By accessing and using RBLXSec, you agree to these terms. Please read them before creating an account or participating in challenges."
      lastUpdated="May 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing, registering, or participating in any activity on RBLXSec, you confirm that you have read, understood, and agree to be bound by these Terms of Service and the accompanying Platform Rules.
        </p>
        <p className="mt-2">
          If you do not agree with any part of these terms, you must stop using the platform immediately.
        </p>
      </LegalSection>

      <LegalSection title="2. Platform Purpose">
        <p>
          RBLXSec is a cybersecurity learning and Capture The Flag (CTF) challenge platform. Its purpose is to provide a safe, structured environment for individuals to learn offensive and defensive security techniques through hands-on challenges.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> The platform is intended for educational use, personal skill development, and portfolio demonstration.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> It is not intended for malicious use, unauthorized penetration testing, or illegal activity.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. User Responsibilities">
        <p>
          Users are fully responsible for their behavior and the content they interact with on the platform.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Users must comply with all Platform Rules and these Terms of Service.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Users are responsible for all actions performed under their accounts.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Techniques learned on this platform must only be used in legal, authorized contexts.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Account Security">
        <p>
          Maintaining the security of your account is your responsibility as a registered user.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Use a strong, unique passphrase for your RBLXSec account.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not share your credentials or authentication tokens with other parties.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> The platform may invalidate sessions or suspend accounts if suspicious activity or policy violations are detected.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Challenge Content">
        <p>
          Challenges, hints, attachments, and scoreboards are provided exclusively for learning and competition purposes within RBLXSec.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Challenge attachments and files should only be downloaded and analyzed in safe, isolated environments.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Challenge content may not be redistributed, sold, or published without administrator authorization.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Hints are provided to assist learning and do not expose flags, flag hashes, or sensitive system information.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Acceptable Use">
        <p>
          The following constitute unacceptable uses of this platform and are strictly prohibited.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Any activity that violates applicable local, national, or international law.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Attacking systems, networks, or individuals outside the defined challenge targets.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Attempting to disrupt or degrade service availability for other users.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Circumventing or bypassing security controls outside a defined challenge context.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Uploading or distributing malicious content, including executables intended to harm users.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Admin and Moderation Rights">
        <p>
          Platform administrators retain the right to manage all aspects of the platform to preserve its integrity and educational purpose.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Admins may add, edit, deactivate, or remove challenges, hints, and attachments at any time.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Admins may suspend or permanently remove user accounts that violate rules or these terms.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Solve records and scoreboard rankings may be adjusted or reset if abuse is confirmed.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Availability and Changes">
        <p>
          RBLXSec is currently a portfolio and development-stage platform. Availability, features, and content are subject to change at any time.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> The platform may be temporarily or permanently unavailable during development, maintenance, or rebuilds.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Database resets may occur during development phases, resulting in loss of challenge progress and scores.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> These terms may be updated at any time. Continued use of the platform constitutes acceptance of updated terms.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Disclaimer">
        <p>
          RBLXSec is provided as-is for educational and portfolio demonstration purposes.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> No guarantee of uninterrupted, error-free service is made.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> The platform is not liable for misuse of techniques, tools, or knowledge obtained through participation.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Users assume all responsibility for their actions inside and outside the platform.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Contact / Maintainer">
        <p>
          RBLXSec is maintained as a personal cybersecurity portfolio project. If you have questions, concerns, or wish to report a policy violation or platform issue, please contact the maintainer directly through the platform's listed contact channel.
        </p>
        <p className="mt-2">
          We appreciate responsible reporting and aim to address genuine concerns promptly.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
