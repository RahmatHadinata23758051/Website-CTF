import { ShieldAlert } from "lucide-react";
import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function RulesPage() {
  return (
    <LegalPageLayout
      icon={<ShieldAlert className="h-4 w-4" />}
      tag="01 // PLATFORM RULES"
      title={<>RBLXSEC <span className="font-semibold text-slate-400">Rules</span></>}
      subtitle="These rules define how participants are expected to engage with the RBLXSec cybersecurity lab. Read them carefully before participating in challenges."
      lastUpdated="May 2026"
    >
      <LegalSection title="1. Fair Play">
        <p>
          All participants are expected to solve challenges through their own analysis, research, and skill development. The goal of RBLXSec is to learn — not to collect flags from external sources.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Sharing notes, techniques, and general methodologies between participants is acceptable and encouraged.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Sharing direct flags or complete challenge solutions publicly is discouraged unless authorized by a platform administrator.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not use flag databases, spoilers, or pre-solved writeups to submit flags without attempting the challenge first.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Challenge Scope">
        <p>
          Each challenge in RBLXSec explicitly defines its attack target. Participants must stay within those defined boundaries.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Attack only targets explicitly provided by the challenge description or attached resources.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not scan, probe, or attack infrastructure outside the defined challenge scope.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not attempt to access or disrupt unrelated external systems.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Flag Submission">
        <p>
          Flags must be submitted through the official RBLXSec submission interface. The submission system enforces fairness and auditing.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Submit flags only through the challenge detail page submission box.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not brute-force flag submissions aggressively. Rate limiting is enforced server-side.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not automate abusive bulk submissions intended to circumvent controls.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Account Usage">
        <p>
          Each participant is responsible for their own account and the activity that occurs under it.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Use your own registered account. Account sharing is not permitted.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not impersonate other participants or platform administrators.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not attempt to access admin-only features or endpoints without explicit authorization.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Prohibited Behavior">
        <p>
          The following actions are strictly prohibited and may result in account suspension or removal from the platform.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Exploiting vulnerabilities in the RBLXSec platform itself, unless a challenge explicitly invites platform-level testing.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Attacking, interfering with, or disrupting other participants.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Uploading malicious files or payloads intended to harm other users or the platform infrastructure.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Attempting to bypass role-based access controls or privilege escalation outside a challenge context.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">✗</span> Denial-of-service behavior or flooding the platform with high-volume automated requests.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Responsible Testing">
        <p>
          RBLXSec is a controlled cybersecurity learning environment. The skills and techniques practiced here are powerful and must be applied responsibly.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Use techniques learned on RBLXSec only in legal and authorized contexts.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not apply offensive techniques against real-world targets without explicit written authorization.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Participating in this platform does not grant authorization to test external systems.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Reporting Issues">
        <p>
          If you discover a bug, vulnerability, or unexpected behavior in the RBLXSec platform, please report it responsibly.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Contact the platform maintainer directly with a detailed report.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Do not exploit discovered platform issues to gain unfair advantages or access unauthorized data.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Responsible disclosure is appreciated and respected.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Platform Integrity">
        <p>
          The platform maintainer reserves the right to take action to preserve fairness and platform stability.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Accounts found in violation of these rules may be suspended or removed without prior notice.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Challenge submissions, solves, or scores may be invalidated if abuse is detected.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Platform administrators may modify, disable, or remove any challenge or content without obligation.</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
