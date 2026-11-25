// Single source of truth for plan limits and pricing copy.
//
// The API routes enforce these numbers, and the landing page, pricing page, and
// dashboard usage meters all render them, so a limit can only be changed here.
//
// `period` is how usage is counted:
//   'lifetime'  a one-time allowance that never resets (no plan uses this now)
//   'month'     resets on the 1st of each month
//
// Assure+ limits are sized against model cost. At the AI Gateway rates for the
// configured model ($1.50 per million input tokens, $7.50 per million output),
// a receipt scan costs roughly a cent. A claim conversation is capped at
// `claimMessages` messages, which bounds it to roughly ten cents even if every
// reply runs long. 50 scans and 25 conversations a month therefore stays well
// inside the $5 price after payment fees even at full use.
//
// Voice input (Whisper) is billed by audio length at about $0.006 a minute, so
// it is counted in seconds: 10 free minutes is at most 6 cents, 60 is 36 cents.
export const PLANS = {
  free: {
    key: 'free',
    name: 'Free',
    price: '$0',
    interval: null,
    // A permanent free plan rather than a one-time trial: warranties last for
    // years, so people need a reason to stay until a reminder pays off. At
    // roughly a cent per scan and at most ten cents per claim session, a fully
    // used free account costs about 12 cents a month.
    period: 'month',
    limits: { warranties: 10, scans: 2, claims: 1, claimMessages: 10, voiceMinutes: 10 },
    features: [
      'Track up to 10 warranties',
      '2 AI receipt scans per month',
      '1 AI claim session per month (up to 10 messages)',
      '10 minutes of voice input per month',
      'Expiry countdown and reminders',
    ],
  },
  plus: {
    key: 'plus',
    name: 'Assure+',
    price: '$5',
    interval: 'month',
    period: 'month',
    limits: { warranties: 100, scans: 50, claims: 25, claimMessages: 10, voiceMinutes: 60 },
    features: [
      'Track up to 100 warranties',
      '50 AI receipt scans per month',
      '25 AI claim sessions per month (up to 10 messages each)',
      '60 minutes of voice input per month',
      'Expiry countdown',
    ],
  },
};

// There is no billing yet, so nobody can be on Assure+ and every account is
// on the Free plan. When billing lands this becomes a per-user lookup.
export const ENFORCED_PLAN = PLANS.free;
