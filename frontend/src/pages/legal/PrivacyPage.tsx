import { Lock } from "lucide-react";
import { LegalPageLayout, LegalSection } from "../../components/legal/LegalPageLayout";

export function PrivacyPage() {
  return (
    <LegalPageLayout
      icon={<Lock className="h-4 w-4" />}
      tag="03 // PRIVACY POLICY"
      title={<>Privacy <span className="font-semibold text-slate-400">Policy</span></>}
      subtitle="This policy explains what data RBLXSec collects, how it is used, and your rights as a user. RBLXSec does not sell or share your data with third parties."
      lastUpdated="May 2026"
    >
      <LegalSection title="1. Data We Collect">
        <p>
          RBLXSec collects minimal data necessary for platform operation. We do not collect data beyond what is needed to provide authentication, challenge tracking, and scoreboard functionality.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Account data:</strong> Display name, email address, role, account creation timestamp.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Challenge activity:</strong> Flag submission records, solve records, submission timestamps.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Admin-uploaded files:</strong> Attachment metadata (filename, path) for challenge downloads.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Technical logs:</strong> Server-side request logs for debugging and auditing purposes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Authentication Data">
        <p>
          Authentication on RBLXSec is handled using industry-standard security practices.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Passwords are never stored in plaintext. They are hashed using a salted hashing algorithm before being stored in the database.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Authentication is managed using signed JSON Web Tokens (JWT).</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> For the current MVP, the authentication token is stored in your browser's localStorage. This is standard practice for development-stage platforms.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Password hashes, JWT secrets, and raw passwords are never returned in any API response.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Challenge Activity">
        <p>
          Challenge participation generates records that are used for scoreboard computation and platform auditing.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Submitted flags (both correct and incorrect) may be logged by the backend for submission history and rate-limiting purposes.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Solve records — which challenge was solved, by whom, and when — are used to calculate scoreboard rankings.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Flag hashes stored in the database are never exposed to any user, including admins, via API responses.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Uploaded Files">
        <p>
          Challenge attachments uploaded by administrators are stored on the platform server for user download.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Files are stored under a controlled upload directory and served via static file routing.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Only administrator accounts may upload challenge files. Normal users cannot upload files to the platform.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Users should not upload personally sensitive files as challenge attachments. The platform is not designed as a personal file storage service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Logs and Technical Data">
        <p>
          The platform may generate server-side technical logs to support debugging, performance monitoring, and security auditing.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Logs may include request timestamps, HTTP methods, routes accessed, and response status codes.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Logs are used for platform maintenance and are not shared externally.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> JWT tokens or authentication secrets are not logged in any accessible log files.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. How Data Is Used">
        <p>
          Collected data is used exclusively to operate, maintain, and improve the RBLXSec platform.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Authentication:</strong> Verifying user identity and maintaining active sessions.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Challenge progress:</strong> Tracking which challenges you have solved.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Scoreboard:</strong> Computing and displaying public rankings based on solve records.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Admin management:</strong> Enabling authorized administrators to manage challenges, users, and platform content.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> <strong className="text-slate-300">Maintenance:</strong> Debugging and resolving technical issues using server logs.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Data Sharing">
        <p>
          RBLXSec does not sell, rent, or trade user data. Data is not shared with advertisers, marketing services, or external analytics platforms.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Scoreboard data (player display names and scores) may be publicly visible to all logged-in users, as it is the core competitive feature of the platform.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Email addresses and account details are private and never displayed publicly.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Data may be disclosed if required by applicable law or legal process, though no specific infrastructure for this currently exists at the development stage.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Data Retention">
        <p>
          As a development-stage platform, data retention policies are not yet fully formalized.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Development data may be periodically reset, including user accounts, challenge progress, and scoreboard data.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Administrators may deactivate or permanently delete user accounts and associated records as needed.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Uploaded challenge files may be removed by administrators at any time.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          RBLXSec implements standard security practices to protect user data. However, no system can guarantee perfect security.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Passwords are stored as salted hashes and cannot be recovered by administrators.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Sensitive fields such as password hashes, flag hashes, and raw flags are never returned in any public API response.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> The platform uses role-based access controls to separate public, authenticated, and admin-level capabilities.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-crimson font-mono shrink-0">!</span> RBLXSec is a learning platform and may not provide the same security guarantees as production commercial services. Use appropriate caution with any sensitive personal data.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. User Choices">
        <p>
          As a registered user, you have choices about your account and data on the platform.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> You may stop using the platform and discontinue your account at any time.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> If RBLXSec becomes a public platform, you may request removal of your account and associated data by contacting the platform maintainer directly.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> You may clear your browser's localStorage to remove stored authentication tokens at any time.</li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Development Notice">
        <p>
          RBLXSec is currently a portfolio and development-stage platform. This Privacy Policy reflects current implementation and will evolve before any public production release.
        </p>
        <ul className="list-none space-y-1.5 mt-2">
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Privacy practices may change as the platform matures toward production readiness.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> Users will be informed of significant policy changes through platform updates.</li>
          <li className="flex gap-2 items-start"><span className="text-cyber-cyan font-mono shrink-0">→</span> This platform is built with privacy-first principles: minimal data collection, no third-party sharing, and no advertising infrastructure.</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
