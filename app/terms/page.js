import { SiteNav, SiteFooter } from '@/components/SiteChrome';

export const metadata = { title: 'Terms of Service | Assure' };

export default function TermsPage() {
  return (
    <div className="site">
      <SiteNav />
      <main className="legal">
          <h1>Terms of Service</h1>
          <div className="updated tnum">Last updated: 11/24/2026</div>

          <h2>1. Acceptance of these terms</h2>
          <p>By creating an account or using Assure, you agree to these Terms. If you don't agree, please don't use the service. If you're using Assure on behalf of an organisation, you're confirming you have authority to accept these Terms for it.</p>

          <h2>2. Description of the service</h2>
          <p>Assure is a record keeping tool. You enter the products you own and their warranty periods, and we store that information, show you what is still in coverage, and remind you before it runs out. We also offer AI features that read receipt images and help you think through a claim.</p>
          <p>We are not a party to any warranty between you and a manufacturer or retailer, and we do not file or pursue claims on your behalf. Whether a claim succeeds is between you and whoever issued the warranty.</p>

          <h2>3. Your account</h2>
          <p>You're responsible for keeping your login credentials secure and for everything that happens under your account. Tell us promptly if you believe someone else has gained access to it.</p>

          <h2>4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Upload content you don't have the right to upload, or anything unlawful or malicious</li>
            <li>Attempt to access another user's account or data</li>
            <li>Probe, scrape, overload, or interfere with the service or the infrastructure behind it</li>
            <li>Reverse engineer the service, except where that restriction is unenforceable by law</li>
            <li>Resell or redistribute the service without our written permission</li>
          </ul>

          <h2>5. Your content stays yours</h2>
          <p>You keep all rights to the warranty records, receipt images, and messages you put into Assure. You grant us only the narrow licence we need to actually run the service for you: to store your content, display it back to you, and pass it to the service providers described in our <a href="/privacy">Privacy Policy</a> so features like receipt scanning can work. We don't use your content to train AI models, and we don't sell it.</p>

          <h2>6. AI features come with limits</h2>
          <p>Receipt scanning and the claim assistant are conveniences, not authorities. They are built on language models that make mistakes, misread images, and state wrong things confidently. Nothing either feature produces is legal, financial, or professional advice. Check anything that matters against the original receipt or warranty document before relying on it.</p>

          <h2>7. Plans and billing</h2>
          <p>Assure is currently offered on a free plan. It includes a limit on tracked warranties and a monthly allowance of AI receipt scans and AI claim sessions, as shown on our <a href="/pricing">pricing page</a>. The monthly allowance resets on the 1st of each month, and unused scans or sessions do not carry over. A paid plan, Assure+, is planned but is not yet available, and no payment method is collected. If it launches, we will publish its terms before they take effect, and moving to a paid plan will always be something you actively choose.</p>

          <h2>8. Availability and changes to the service</h2>
          <p>We may add, change, or remove features, and the service may be unavailable at times for maintenance or reasons outside our control. We don't guarantee uninterrupted access. Assure is not a backup service, so please keep your own copies of receipts and documents that matter to you.</p>

          <h2>9. Ending your use of Assure</h2>
          <p>You can stop using Assure at any time and ask us to delete your account and the data attached to it. We may suspend or close an account that breaches these Terms or puts the service or other users at risk. Where it's reasonable to do so, we'll give notice first.</p>

          <h2>10. Disclaimers and limitation of liability</h2>
          <p>Assure is provided "as is" and "as available", without warranties of any kind, to the fullest extent the law allows. In particular, we do not warrant that warranty information stored in the service is accurate or complete, since most of it comes from you or from AI reading your receipts.</p>
          <p>To the extent permitted by law, we are not liable for indirect or consequential losses, and that expressly includes the value of a warranty claim you missed, were denied, or couldn't pursue. Our total liability to you is capped at the greater of what you paid us in the previous 12 months or $50. Nothing here limits liability that can't be limited by law.</p>

          <h2>11. Governing law</h2>
          <p>These Terms are governed by the laws of the State of California and the laws of the United States that apply there, without regard to conflict of law rules. You agree that the state and federal courts located in California have exclusive jurisdiction over any dispute arising from these Terms or your use of Assure.</p>

          <h2>12. Changes to these Terms</h2>
          <p>We may update these Terms. If a change is material, we'll give you at least 14 days' notice by posting the updated Terms here with a new date, and continuing to use Assure after that means you accept them.</p>


      </main>
      <SiteFooter />
    </div>
  );
}
