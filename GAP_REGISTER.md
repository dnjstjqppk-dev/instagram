# GLOBAL SOCIAL PLATFORM — GAP REGISTER & EXTERNAL DEPENDENCY LOG
**Baseline Date:** 2026-10-20  
**Standard:** Enterprise / Commercial Launch Integrity  
**Principle:** Any non-implemented, mocked, or externally blocked dependency must be logged here. No phantom completion claims permitted.

---

## Severity Classification
- **BLOCKER (P0)**: Core product functionality blocked; prevents production launch or critical workflow completion.
- **CRITICAL (P1)**: Major business/legal requirement partially met; requires explicit sign-off or fallback mechanism.
- **MAJOR (P2)**: Non-blocking feature limitation; regional or progressive rollout planned.
- **MINOR (P3)**: Enhancement, non-functional optimization, or cosmetic edge case.

---

## Active Gap & Dependency Register

| Gap ID | Related Feature | Category | Description | Mitigating Strategy / Fallback Architecture | Target Resolution / Status |
|---|---|---|---|---|---|
| GAP-001 | FEAT-088 (Shop / Commerce) | Financial / Payment Partner | Native in-app checkout requires merchant merchant-of-record agreements (e.g., Stripe Connect Custom, PG approval per jurisdiction). | Provide native checkout engine with standard mockable PG sandbox adapter (Stripe / PortOne / Toss Payments compliant) with automatic webhook validation. | ARCHITECTED_SANDBOX |
| GAP-002 | FEAT-046, FEAT-057 (Audio / Music) | Legal / Copyright Licensing | Meta has bilateral master recording / publishing synchronization licenses with major record labels (UMG, Sony, Warner). An independent platform cannot bundle copyrighted music without commercial license. | Platform implements native Royalty-Free Audio Library & User Original Audio ingestion pipeline with fingerprinting hook placeholder. | INDEPENDENT_COMPLIANT |
| GAP-003 | FEAT-089 (App Store IAP) | Platform Policy | Apple App Store & Google Play require 30%/15% IAP fee for digital subscriptions and virtual tipping in mobile apps. | Mobile app integrates `in_app_purchase` Flutter package abstraction; Web Partner Center supports direct card/PG checkout. | DUAL_RAIL_ROUTING |
| GAP-004 | FEAT-060 (Push Notifications) | External Service | APNs (Apple) & FCM (Google) require registered developer team credentials and bundle IDs to deliver push packets to physical devices. | Unified push delivery service with local web-push VAPID fallback and sandbox mocked push log sink for test verification. | DUAL_MODE_GATEWAY |
| GAP-005 | FEAT-059 (WebRTC Calling) | Infrastructure | Production WebRTC across carrier NATs requires dedicated Coturn (STUN/TURN) servers with high egress bandwidth. | Deploy open-source Coturn container in IaC/docker-compose with ephemeral credential generation over REST. | INFRA_READY |
| GAP-006 | FEAT-065 (Harmful Content AI) | Machine Learning | Meta uses multi-billion parameter proprietary vision/text safety classifiers. | Implement lightweight ONNX / PyTorch microservice with NSFW image filter + detoxifying text regex/embedding classification engine. | SELF_HOSTED_ML |
| GAP-007 | FEAT-030 (Verified Badge Audit) | Operational Governance | Verification badges require real-world legal entity and ID verification procedures (KYC). | Self-contained Admin Verification queue with government ID upload, reviewer workflow, and audit logging. | FULL_OPS_WORKFLOW |

---

## Gap Resolution Sign-Off Rules
1. A gap cannot be marked `CLOSED` without automated test or architectural proof of fallback.
2. In the final release decision, any remaining P0 gap forces `NO-GO`.
