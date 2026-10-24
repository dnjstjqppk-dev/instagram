# 01. USER ROLES & PERMISSIONS SPECIFICATION (RBAC & ABAC)
**Standard:** Enterprise Security Standard (ISO 27001, SOC 2, Least Privilege)  
**Document Version:** 1.0.0 (2026-10-20)

---

## 1. Role Taxonomy (16 Defined Roles)

| Role ID | Role Name | System Category | Description & Authority Scope |
|---|---|---|---|
| `ROLE_GUEST` | Unauthenticated Guest | Public Client | Can view public profiles, public posts, and search terms. Cannot interact, comment, message, or purchase. |
| `ROLE_USER` | Standard User | User Platform | Standard authenticated user. Can post, comment, follow, direct message, view stories/reels. |
| `ROLE_PRIVATE_USER` | Private Account User | User Platform | Follower approval required. Content hidden from non-followers, explore, and search engines. |
| `ROLE_TEEN_USER` | Teen User (Under 16/18) | Regulated User | Default private. Restricted DM reception from adults. Sensitive content filtering locked to Strict. |
| `ROLE_CREATOR` | Professional Creator | Professional | Access to Creator Dashboard, Insights, In-app monetization, Live badges, and Creator Marketplace. |
| `ROLE_BUSINESS` | Verified Business Account | Professional | Access to Business Contact buttons, Shop integration, Action buttons, Meta Business Suite link. |
| `ROLE_ADVERTISER` | Direct Advertiser | Commercial | Can create and fund Ad Accounts, launch Feed/Stories/Reels campaigns, manage ad budgets. |
| `ROLE_AGENCY` | Marketing Agency | Commercial | Multi-client tenant delegation. Operates ad campaigns and creator collabs on behalf of brands. |
| `ROLE_MERCHANT` | E-Commerce Merchant | Commerce | Product Catalog manager, SKU inventory manager, order fulfillment, shipping & refund operator. |
| `ROLE_PARTNER` | Ecosystem Partner | Partner Org | Technology & content partner with verified API access, Webhooks, and data feeds. |
| `ROLE_MODERATOR` | Content Moderator | Operations | Review queue operator. Can quarantine posts, approve/reject flags, triage reports. Blurring applied to PII/NSFW. |
| `ROLE_SUPPORT_AGENT` | Customer Support Agent | Operations | Customer ticket handling, user inquiries, verification triage, account appeal intake. |
| `ROLE_FINANCE_OPERATOR`| Finance & Billing Specialist| Operations | Ledger auditor, creator payout processor, refund reconciliation, tax document reviewer. |
| `ROLE_SECURITY_OPERATOR`| Security / Anti-Fraud Analyst| Operations | Session invalidator, suspicious login auditor, Sybil/bot quarantine manager, IP CIDR blocker. |
| `ROLE_ADMIN` | Platform Administrator | Operations | Internal tenant manager, staff permission assigner, platform configuration, policy updates. |
| `ROLE_SUPER_ADMIN` | Platform Executive / Root Admin| Operations | Dual-custody system changes, master kill-switch, emergency database access, KMS key operations. |

---

## 2. RBAC Permission Matrix

| Capability / Resource | Guest | User | Teen | Creator | Business | Advertiser | Merchant | Moderator | Support | Finance | Security | Admin | SuperAdmin |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Read Public Content | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Post Photos / Videos / Reels | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Create Stories / Highlights | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Direct Messaging (1:1 / Group) | ✗ | ✓ | Restricted | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Professional Dashboard | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Create Paid Ads / Campaigns | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage Shop / Inventory | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Creator Subscriptions / Tips | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Review Abuse Queue | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Ban User / Suspend Account | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Escalate | Escalate | ✗ | ✓ | ✓ | ✓ |
| Process Creator Payouts | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | Dual-Auth| Dual-Auth|
| Invalidate User Sessions | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Grant Role / Assign Permissions| ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| System Killswitch / Emergency | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## 3. ABAC (Attribute-Based Access Control) Policies

1. **Relation-Based Privacy (Social Graph ABAC)**:
   - IF `target_user.is_private == true` AND `requestor NOT IN target_user.followers` THEN `DENY(ViewContent)`.
   - IF `requestor IN target_user.blocks` OR `target_user IN requestor.blocks` THEN `DENY(AllDirectInteractions)` + `HIDE(Search)`.
2. **Teen Safety Guardrails (Child Online Safety ABAC)**:
   - IF `requestor.age < 16` AND `target_user.age >= 18` AND `NOT follows(requestor, target_user)` THEN `DENY(SendDirectMessage)`.
   - IF `requestor.age < 16` THEN `ENFORCE(SensitiveContentFilter = STRICT)` AND `ENFORCE(DailyTimeReminder = 60min)`.
3. **Multi-Tenant Organization Isolation (Partner ABAC)**:
   - An agency operator can only view `ad_account` IF `ad_account.org_id == session.active_org_id` AND `session.membership.role IN ['ORG_ADMIN', 'MEDIA_BUYER']`.
4. **Admin Separation of Duty (SoD ABAC)**:
   - A single operator CANNOT both approve a creator payout and initiate the banking wire (`Four-Eyes Principle`).
