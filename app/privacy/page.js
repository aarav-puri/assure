import { SiteNav, SiteFooter } from '@/components/SiteChrome';

export const metadata = { title: 'Privacy Policy | Assure' };

export default function PrivacyPage() {
  return (
    <div className="site">
      <SiteNav />
      <main className="legal">
          <h1>Privacy Policy</h1>
          <div className="updated tnum">Last updated: 8/18/2026</div>

          <h2>1. What we collect</h2>
          <p>We only collect what the service needs to work:</p>
          <ul>
            <li>Your name and email address, from when you register</li>
            <li>Warranty details you enter, such as product names, brands, retailers, dates, prices, and serial numbers</li>
            <li>Receipt images you upload for AI scanning</li>
            <li>Messages you send to the AI claim assistant</li>
            <li>Basic account settings, such as your name</li>
          </ul>
          <p>We never see or store your password. Sign in is handled by Neon Auth, which stores only a hashed form of it.</p>

          <h2>2. How we use it</h2>
          <ul>
            <li>To create and run your account</li>
            <li>To store your warranty records and show them back to you</li>
            <li>To power AI receipt scanning and the claim assistant</li>
            <li>To keep the service working, secure, and free of abuse</li>
          </ul>
          <p>We do not use your data for advertising, and we do not build profiles of you.</p>

          <h2>3. Where your data is stored</h2>
          <p>We do not sell or rent your personal information, and we never share it with other users. Your account and your warranty records live in a Neon Postgres database, so the day to day safety of your data rests on infrastructure Neon secures and audits rather than on servers we maintain ourselves.</p>
          <p>Measures that apply to data held there include:</p>
          <ul>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Encryption at rest:</strong> stored data and its backups are encrypted on disk</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Encryption in transit:</strong> every connection between the application and the database is made over TLS, and so is the traffic between you and the application</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Isolated storage per project:</strong> the database is dedicated to Assure rather than shared with other customers' data</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Credentials never held in the clear:</strong> passwords are hashed by the authentication service, so neither we nor it can read them</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Scoped queries:</strong> every read and write is filtered by your own account id, so one account cannot reach another's records</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Independent auditing:</strong> the platform is assessed against recognised standards such as SOC 2 by outside auditors</li>
          </ul>
          <p>We may also disclose information where the law requires it, or where it is necessary to protect the service, our rights, or someone's safety.</p>

          <h2>4. How AI features handle your data</h2>
          <p>When you scan a receipt, the image is sent to an external AI provider to be read. When you use the claim assistant, your messages and the warranty details relevant to that claim are sent the same way. This happens only when you actively use those features, and it is the only time your content leaves our own storage.</p>
          <p>We do not use your content to train AI models, and we do not permit our providers to train on it either.</p>

          <h2>5. Security</h2>
          <p>The measures we rely on:</p>
          <ul>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Encryption in transit:</strong> traffic between your device and our services is protected with TLS</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Encryption at rest:</strong> the database and uploaded receipt images are encrypted on disk by the platforms that host them</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Account scoped access:</strong> the database is never reachable from your browser. Every read and write goes through our server, which filters it by your own account id, so one account cannot reach another's records</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Private receipt storage:</strong> uploaded receipt images are stored privately and served only to you through an authenticated route</li>
            <li><strong style={{ color:'var(--ink)', fontWeight:500 }}>Signed session cookies:</strong> sessions are held in signed, expiring cookies rather than credentials stored in your browser</li>
          </ul>
          <p>No service can promise perfect security, and we will not pretend otherwise. We keep our practices under review and will tell you promptly if a breach affects your data.</p>

          <h2>6. How long we keep it</h2>
          <p>Your warranty records and receipt images stay until you delete them or ask us to close your account, at which point we remove them from our active systems. Residual copies may persist briefly in provider backups before being overwritten.</p>

          <h2>7. Your rights</h2>
          <p>You can:</p>
          <ul>
            <li>See and correct the information held about you</li>
            <li>Delete individual warranty records at any time from within the app</li>
            <li>Ask us to delete your account and everything attached to it</li>
            <li>Ask for a copy of your data</li>
          </ul>
          <p>Depending on where you live, you may have further rights under laws such as the GDPR or the CCPA, including the right to object to processing or to complain to your local data protection authority.</p>

          <h2>8. Changes to this policy</h2>
          <p>We will post any update here with a new date, and we will give at least 14 days' notice before a material change takes effect.</p>

      </main>
      <SiteFooter />
    </div>
  );
}
