# 02. PLATFORM INFORMATION ARCHITECTURE (IA)
**Standard:** Enterprise Multi-Surface Navigation & Route Topology  
**Target Applications:**
1. `apps/web`: User Web Application (Nuxt / Vue 3)
2. `apps/admin`: Operational Admin Center (Vue 3 SPA)
3. `apps/partner`: Business & Partner Center (Vue 3 SPA)
4. `apps/mobile`: Mobile Native App (Flutter iOS/Android)

---

## 1. User Web Application (`apps/web`)

```text
/                                         # Home Feed (Following & Suggested, Stories Tray)
├── /explore/                             # Grid discovery, trending topics
├── /reels/                               # Vertical Reels player
│   └── /reels/:id                        # Deep link single reel modal
├── /direct/                              # Messages inbox
│   ├── /direct/inbox                     # Conversation list & Notes header
│   ├── /direct/t/:threadId               # Active 1:1 or Group conversation
│   └── /direct/requests                  # Filtered message requests & spam
├── /notifications                        # Activity feed (Likes, comments, follows)
├── /create                               # Creation modal (Photo/Video/Reel)
├── /search                               # Search overlay (Accounts, Tags, Places)
├── /settings/                            # Account & Privacy settings
│   ├── /settings/profile                 # Edit profile (bio, pronouns, photo)
│   ├── /settings/privacy                 # Private account, blocked, muted
│   ├── /settings/security                # 2FA, Passkeys, Login activity
│   ├── /settings/notifications           # Push & email preferences
│   └── /settings/data-download           # GDPR data portability & delete account
├── /:username/                           # Public or Private Profile page
│   ├── /:username/reels                  # User reels grid
│   ├── /:username/saved                  # User saved collections (self only)
│   └── /:username/tagged                 # Photos of user
├── /p/:postId                            # Standalone Post detail view
├── /stories/:username/:storyId           # Full-screen story viewer
└── /auth/                                # Authentication flows
    ├── /auth/login                       # Username/Email/Phone login
    ├── /auth/signup                      # Progressive onboarding wizard
    └── /auth/reset-password              # Recovery flow
```

---

## 2. Independent Admin Center (`apps/admin`)

```text
/admin/
├── /dashboard                            # Real-time DAU/MAU, RPS, Error rate, SLA health
├── /users                                # User master directory
│   ├── /users/search                     # Query by ID, email, phone, IP, device ID
│   └── /users/:id                        # User 360: Profile, graph, flags, sessions, sanctions
├── /moderation                           # Trust & Safety Operations
│   ├── /moderation/queue                 # Triage queues: NSFW, Hate, Harassment, Copyright
│   ├── /moderation/cases/:caseId         # Case dossier, evidence snapshots, action buttons
│   └── /moderation/appeals               # User appeal pipeline
├── /security                             # Anti-Abuse & Security Operations
│   ├── /security/incidents               # DDoS, credential stuffing, bot spikes
│   ├── /security/ip-rules                # CIDR blocklist/allowlist
│   └── /security/sessions                # Global session termination console
├── /finance                              # Revenue & Payout Operations
│   ├── /finance/ad-revenue               # Ad spend realization & billing ledger
│   ├── /finance/payouts                  # Creator payout approval batch (Four-Eyes check)
│   └── /finance/disputes                 # Chargeback & refund triage
├── /commercial                           # Ad & Merchant Compliance
│   ├── /commercial/ad-creatives          # Pre-flight ad review queue
│   └── /commercial/merchants             # Merchant shop qualification
├── /audit-log                            # Immutable system-wide operator audit trails
└── /settings                             # Admin RBAC, Feature flags, Emergency stop switch
```

---

## 3. Independent Partner Center (`apps/partner`)

```text
/partner/
├── /dashboard                            # Organization switcher & cross-asset summary
├── /creator/                             # Creator Professional Tools
│   ├── /creator/insights                 # Reach, engagement, demographic analytics
│   ├── /creator/studio                   # Desktop upload, multi-video scheduler, drafts
│   └── /creator/marketplace              # Brand sponsorship discovery & proposals
├── /ads/                                 # Ads Manager
│   ├── /ads/campaigns                    # Campaign hierarchy (Campaign -> AdSet -> Creative)
│   ├── /ads/create                       # Step-by-step campaign builder & audience builder
│   ├── /ads/metrics                      # ROAS, Impressions, CTR, Conversion analytics
│   └── /ads/billing                      # Payment methods, invoices, credit lines
├── /commerce/                            # Merchant Commerce Manager
│   ├── /commerce/catalog                 # Product catalog & SKU inventory manager
│   ├── /commerce/orders                  # Order processing, shipping labels, returns
│   └── /commerce/disputes                # Buyer dispute resolution
└── /organization/                        # Business Settings
    ├── /organization/members             # Team members, role assignments (Agency/Brand)
    └── /organization/developer           # API Keys, Webhook endpoints, OAuth Apps
```

---

## 4. Mobile Native Application (`apps/mobile`)

```text
Main Bottom Navigation (5 Core Tabs):
1. Feed Tab:
   - Header: App Logo (Brand), Story Tray (Horizontal scroll), Direct Message Badge / Entry, Heart (Notifications)
   - Body: Infinite vertical feed with post media, captions, like/comment buttons, share sheet
2. Explore Tab:
   - Header: Universal Search bar (Accounts, Tags, Audio, Places)
   - Body: Staggered grid (2x2 images + 1x2 Reel tile format)
3. Creation Modal (Bottom Sheet / Center Action):
   - Modes: Post (Carousel), Story (Camera/Stickers), Reel (Vertical Video/Audio Trim), Live (Signaling)
4. Reels Tab:
   - Fullscreen immersive vertical page-view swipe
   - Overlay: Right rail actions (Like, Comment, Share, Remix, Audio Pill)
5. Profile Tab:
   - Header: Avatar, Stats (Posts, Followers, Following), Edit Profile, Professional Dashboard (if Creator/Business)
   - Highlights Tray: Circular highlighted stories
   - Tab Bar: Grid Posts, Reels, Saved (self), Tagged
```
