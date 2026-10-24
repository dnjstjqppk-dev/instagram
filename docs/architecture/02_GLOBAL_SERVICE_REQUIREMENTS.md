# 02. GLOBAL SERVICE REQUIREMENTS & COMPLIANCE ARCHITECTURE
**Standard:** Enterprise Internationalization (i18n), Regulatory Compliance & Regional Adaptability  
**Target Languages:** Korean (ko-KR, Primary), English (en-US, Primary), with scalable support for Japanese (ja-JP), Spanish (es-ES), and Arabic (ar-SA, RTL).

---

## 1. Internationalization (i18n) & Localization (l10n)
1. **Locale Routing**:
   - Web: URL-prefix or Accept-Language header routing (`/en/`, `/ko/`).
   - Mobile: Synchronized with device system locale with manual override in Account Settings.
2. **Pluralization & Time Formatting**:
   - ICU message format for dynamic strings with gender and plural categories.
   - Relative timestamps ("2m ago", "5h ago", "3d ago") localized using UTC base timestamps.
3. **Right-to-Left (RTL) Layout**:
   - Bidirectional CSS via CSS logical properties (`margin-inline-start`, `padding-inline-end`).
   - Flutter `Directionality.of(context)` flipping chevron icons and horizontal gestures.

---

## 2. Regional Regulatory Frameworks & Compliance

| Jurisdiction | Relevant Regulation | System Mandate | Technical Enforcement |
|---|---|---|---|
| **European Union** | GDPR / Digital Services Act (DSA) | User consent tracking, Right to Erasure, Transparency in recommendation algorithms. | `user_consents` audit log, 30-day soft-delete grace period, "Why am I seeing this?" API metadata. |
| **United States** | COPPA / CCPA / State Age Laws | Age verification for minors under 13/16. Opt-out of data sale. | Birthdate collection on registration; teens < 16 automatically default to Private and Strict content filters. |
| **South Korea** | PIPA / Youth Protection Act / Telecommunications Business Act | Explicit itemized consent, Domestic Agent appointment, Nighttime notification pause ("Shutdown" guidance). | Opt-in checkboxes for marketing/location; default quiet hours (22:00 - 08:00 KST) for teen push notifications. |
| **Global Financial** | PCI-DSS, KYC / AML | Zero storage of raw PAN/CVV; Merchant & Creator identity verification before payouts. | Tokenized payment gateways (Stripe / Toss Payments); Payouts require verified tax ID and bank verification. |

---

## 3. Currency & Multi-Region Financial Engine
1. **Supported Base Currencies**: USD ($), KRW (₩), EUR (€), JPY (¥).
2. **Exchange Rates**: Hourly ECB / OpenExchangeRates ticker synced to Redis.
3. **Tax Handling**:
   - US: Sales tax calculated via postal code nexus.
   - EU / KR: VAT-inclusive pricing display (10% VAT itemized on billing receipts).

---

## 4. Regional Feature Flags Architecture

```json
{
  "feature_flags": {
    "in_app_checkout": {
      "default": false,
      "regional_allowlist": ["US", "KR"],
      "teen_enabled": false
    },
    "creator_subscriptions": {
      "default": true,
      "regional_blocklist": ["CU", "IR", "KP", "SY"]
    },
    "music_sticker_library": {
      "default": false,
      "requires_royalty_free_only": true
    },
    "teen_quiet_hours": {
      "default": true,
      "mandatory_regions": ["KR", "EU"]
    }
  }
}
```
