# Backend Implementation Plan
## Micro-Investment & Savings Platform for Gig Workers

**Basis:** PS-02 Product Requirements Document  
**Backend:** Node.js + Express + TypeScript + PostgreSQL + Prisma  
**Agent:** LangGraph + OpenRouter/Groq  
**Deployment:** Render/Railway + Neon/Supabase

---

# 1. Backend Goal

Build a financial intelligence backend that supports the complete workflow:

**AA online income + manual offline income → unified income ledger → income analysis → Smart Save → goal-based Smart Wallet → interest → investment recommendation → tax assistant → explanations/dashboard.**

The prototype uses synthetic/mock financial data. The architecture must keep AA, banking/payment, and application intelligence separated so real regulated integrations can be added later.

---

# 2. Core Backend Features

The following are **MVP/core features**, not optional extras:

1. Account Aggregator data architecture
2. Online income ingestion through AA/mock AA
3. Manual offline/cash income entry
4. Unified income ledger
5. Income classification
6. Income pattern analysis
7. Smart Save engine
8. Safety Mode
9. Smart Wallet
10. Goal-Based Savings
11. Manual deposits
12. Automatic savings simulation
13. Goal withdrawals
14. Interest tracking/calculation
15. Investment Recommendation Engine
16. Tax Assistant
17. Explanation layer
18. What-if income simulator
19. Multi-persona demo support
20. Dashboard aggregation API

---

# 3. High-Level Architecture

```text
                           USER
                             |
              +--------------+--------------+
              |                             |
              v                             v
      ACCOUNT AGGREGATOR              MANUAL INCOME
       Online Earnings                Offline/Cash
              |                             |
              +--------------+--------------+
                             |
                             v
                  UNIFIED INCOME LEDGER
                             |
                             v
                  INCOME CLASSIFICATION
                             |
                             v
                  INCOME PATTERN ENGINE
                             |
             +---------------+----------------+
             |               |                |
             v               v                v
        SMART SAVE     INVESTMENT           TAX
          ENGINE       RECOMMENDATION      ASSISTANT
             |               |                |
             v               v                v
       SAFETY ENGINE     CATEGORY +       TAX ESTIMATE
             |            EXPLANATION          |
             v                                 |
       GOAL ALLOCATION                          |
             |                                 |
             v                                 |
        SMART WALLET <-------------------------+
             |
       +-----+-----+----------------+
       |           |                |
       v           v                v
   Emergency    Medical          Growth
       |
       +--------------------------+
                                  |
                                  v
                           INTEREST ENGINE
                                  |
                                  v
                             WALLET LEDGER
                                  |
                                  v
                              DASHBOARD
```

---

# 4. Important Financial Separation

The backend must distinguish between:

### Income

Money the user earns.

```text
AA online income
+
manual offline income
=
total eligible income
```

### Wallet

Money actually represented in the eligible savings product.

```text
manual deposit
+
auto-save
+
interest
-
withdrawal
=
eligible wallet balance
```

**Income is not automatically a wallet deposit.**

For example, if a user earns ₹500 in cash, the system records ₹500 of offline income but must not pretend that ₹500 entered the regulated savings account.

---

# 5. Recommended Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── constants.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   │
│   │   ├── aa/
│   │   │   ├── aa.controller.ts
│   │   │   ├── aa.service.ts
│   │   │   ├── aa.adapter.ts
│   │   │   ├── aa.mock.ts
│   │   │   └── aa.routes.ts
│   │   │
│   │   ├── income/
│   │   │   ├── income.controller.ts
│   │   │   ├── income.service.ts
│   │   │   ├── income.routes.ts
│   │   │   ├── sources/
│   │   │   │   ├── aa-income.service.ts
│   │   │   │   └── manual-income.service.ts
│   │   │   ├── classification/
│   │   │   │   └── income-classifier.ts
│   │   │   ├── aggregation/
│   │   │   │   └── daily-income.service.ts
│   │   │   └── pattern/
│   │   │       └── income-pattern.engine.ts
│   │   │
│   │   ├── savings/
│   │   │   ├── smart-save.engine.ts
│   │   │   ├── safety.engine.ts
│   │   │   ├── savings.service.ts
│   │   │   └── savings.routes.ts
│   │   │
│   │   ├── wallet/
│   │   │   ├── wallet.service.ts
│   │   │   ├── wallet-ledger.service.ts
│   │   │   ├── deposit.service.ts
│   │   │   ├── withdrawal.service.ts
│   │   │   └── wallet.routes.ts
│   │   │
│   │   ├── goals/
│   │   │   ├── goal.service.ts
│   │   │   ├── allocation.engine.ts
│   │   │   └── goal.routes.ts
│   │   │
│   │   ├── interest/
│   │   │   ├── interest.service.ts
│   │   │   ├── interest.engine.ts
│   │   │   └── interest.routes.ts
│   │   │
│   │   ├── recommendations/
│   │   │   ├── recommendation.service.ts
│   │   │   ├── recommendation.engine.ts
│   │   │   └── recommendation.routes.ts
│   │   │
│   │   ├── tax/
│   │   │   ├── tax.service.ts
│   │   │   ├── tax.engine.ts
│   │   │   ├── tax.rules.ts
│   │   │   └── tax.routes.ts
│   │   │
│   │   ├── simulation/
│   │   │   └── simulation.routes.ts
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.service.ts
│   │       └── dashboard.routes.ts
│   │
│   ├── agent/
│   │   ├── graph.ts
│   │   ├── state.ts
│   │   ├── nodes/
│   │   │   ├── income.node.ts
│   │   │   ├── pattern.node.ts
│   │   │   ├── savings.node.ts
│   │   │   ├── safety.node.ts
│   │   │   ├── recommendation.node.ts
│   │   │   ├── tax.node.ts
│   │   │   └── explanation.node.ts
│   │   └── prompts/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── utils/
│   │   ├── money.ts
│   │   ├── dates.ts
│   │   └── logger.ts
│   │
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── scripts/
│   └── generate-demo-data.ts
│
└── package.json
```

---

# 6. Database Model

## User

```text
User
----
id
name
email
phone
persona
riskProfile
smartSaveEnabled
maxDailyAutoSave
minimumBalance
savingPercentage
createdAt
updatedAt
```

## AA Consent

```text
AAConsent
---------
id
userId
provider
consentId
status
purpose
expiresAt
createdAt
updatedAt
```

## Financial Account

```text
FinancialAccount
----------------
id
userId
aaConsentId
institutionName
accountType
maskedAccountNumber
currency
status
lastSyncedAt
```

## Transaction / Unified Income Ledger

```text
Transaction
-----------
id
userId
accountId              nullable
externalId             nullable
amount
date
type
description
merchant
sourcePlatform
category

sourceType             AA | MANUAL
incomeMode             ONLINE | OFFLINE

isIncome
classificationConfidence
classificationReason

createdAt
updatedAt
```

The `sourceType` and `incomeMode` fields are important because AA income and manually entered offline income must ultimately feed the same income engine.

---

# 7. Online Income Through AA

## Prototype

```text
Mock AA Provider
      ↓
Seeded Transactions
      ↓
Normalize Transactions
      ↓
Classify Income
      ↓
Unified Income Ledger
```

## Production

```text
User
 ↓
AA Consent
 ↓
AA Provider
 ↓
Financial Institution
 ↓
Financial Information
 ↓
AA Adapter
 ↓
Transaction Normalizer
```

Use an adapter so the prototype does not depend on a real AA provider:

```ts
interface AccountAggregatorProvider {
  createConsent(userId: string): Promise<Consent>;
  getConsentStatus(consentId: string): Promise<ConsentStatus>;
  fetchFinancialData(consentId: string): Promise<FinancialData>;
  revokeConsent(consentId: string): Promise<void>;
}
```

---

# 8. Offline Income

Users must be able to manually enter income received outside connected financial accounts.

Example:

```http
POST /api/income/manual
```

```json
{
  "amount": 700,
  "date": "2026-09-23",
  "description": "Cash delivery earnings",
  "category": "DELIVERY"
}
```

Backend flow:

```text
Manual Income
     ↓
Validate
     ↓
Create Transaction
     ↓
sourceType = MANUAL
incomeMode = OFFLINE
isIncome = true
     ↓
Unified Income Ledger
     ↓
Recalculate Daily Income
```

Manual income must affect:

- income pattern
- Smart Save decision
- investment recommendation inputs
- tax planning

But manual income must **not automatically increase the wallet balance**.

---

# 9. Income Classification

The system must not treat every bank credit as income.

Classification inputs:

```text
description
merchant
source platform
transaction type
amount
frequency
historical behaviour
```

Output:

```json
{
  "isIncome": true,
  "confidence": 0.94,
  "reason": "Likely gig-platform earning"
}
```

Manual income is already explicitly marked as income after validation.

---

# 10. Unified Income Calculation

Example:

```text
AA Income
Swiggy       ₹900
Uber         ₹400

Offline Income
Cash work    ₹300

-------------------
Total        ₹1,600
```

The pattern engine receives:

```text
todayIncome = ₹1,600
```

not separate independent datasets.

Dashboard response should expose the breakdown:

```json
{
  "totalIncome": 28450,
  "onlineIncome": 21000,
  "offlineIncome": 7450
}
```

---

# 11. Income Pattern Engine

Calculate:

```text
rollingAverage
medianIncome
variance
standardDeviation
volatilityClass
goodDayThreshold
lowDayThreshold
drySpellFrequency
earningFrequency
```

Example:

```json
{
  "averageIncome": 900,
  "variance": 18500,
  "volatilityClass": "medium",
  "goodDayThreshold": 1170,
  "lowDayThreshold": 650,
  "drySpellFrequency": 0.12
}
```

---

# 12. Smart Save Engine

Core formula:

```text
surplus = today's eligible income - rolling average

if surplus <= 0:
    save = 0

else:
    save = surplus × savingPercentage
```

Then apply:

```text
minimum balance
maximum daily auto-save
smart-save enabled
safety mode
```

Example:

```text
Today's income     ₹1,400
Normal income        ₹900
Surplus               ₹500
Savings rate            15%
Auto-save               ₹75
```

Return an auditable decision:

```json
{
  "decision": "SAVE",
  "income": 1400,
  "normalIncome": 900,
  "surplus": 500,
  "savedAmount": 75,
  "reason": "Higher-than-usual earning day"
}
```

---

# 13. Safety Engine

Before saving:

```text
Smart Save enabled?
        ↓
Income above normal?
        ↓
Low-income streak?
        ↓
Minimum balance preserved?
        ↓
Daily limit respected?
        ↓
SAVE / REDUCE / PAUSE
```

Example:

```json
{
  "decision": "PAUSE",
  "amount": 0,
  "reason": "Income has remained below normal for several days"
}
```

---

# 14. Smart Wallet

The Smart Wallet is an application-level representation of the user's eligible savings balance.

```text
Wallet
│
├── Eligible Balance
├── Interest
├── Emergency Goal
├── Medical Goal
├── Growth Goal
├── Custom Goals
├── Deposits
├── Auto-Saves
├── Withdrawals
└── Ledger
```

Actual customer funds remain with the regulated partner in production.

---

# 15. Goal-Based Savings

## Goal Model

```text
Goal
----
id
userId
walletId
type
name
targetAmount
allocatedBalance
allocationPercentage
priority
status
createdAt
updatedAt
```

Default:

```text
Emergency Fund
Medical Fund
Growth Fund
```

Custom:

```text
Vehicle
Education
Equipment
Travel
```

## Allocation

Do not hard-code 50/30/20.

Store the allocation configuration:

```json
{
  "emergency": 50,
  "medical": 30,
  "growth": 20
}
```

For ₹100:

```text
Emergency ₹50
Medical   ₹30
Growth    ₹20
```

All wallet and goal updates should occur in one PostgreSQL transaction.

---

# 16. Wallet Ledger

Every money movement gets a ledger entry.

```text
MANUAL_DEPOSIT
AUTO_SAVE
GOAL_ALLOCATION
WITHDRAWAL
INTEREST_CREDIT
ADJUSTMENT
```

Example:

```json
{
  "type": "AUTO_SAVE",
  "amount": 75,
  "reason": "Higher-than-usual earning day",
  "status": "COMPLETED"
}
```

Use database transactions so wallet and goal balances cannot become inconsistent.

---

# 17. Interest Engine

Interest is a core feature.

The application should track applicable interest on the **eligible underlying balance**, rather than treating interest as something exclusive to the Growth Fund.

## Models

```text
InterestAccount
---------------
id
walletId
partnerName
productName
annualRate
rateType
eligibleBalance
lastCalculatedAt
lastCreditedAt
```

```text
InterestEntry
-------------
id
walletId
amount
eligibleBalance
rate
periodStart
periodEnd
status
source
createdAt
```

## Prototype calculation

```text
dailyInterest =
eligibleBalance × annualRate / 365

periodInterest =
dailyInterest × eligibleDays
```

Use an abstraction:

```ts
interface InterestProvider {
  getApplicableRate(productId: string): Promise<number>;
  calculateInterest(
    balance: number,
    rate: number,
    period: InterestPeriod
  ): Promise<InterestResult>;
}
```

Production should use applicable partner-product terms instead of assuming a universal rate.

---

# 18. Investment Recommendation Engine

Investment recommendation is a **core PS requirement**.

Inputs:

```text
average income
income variance
volatility
dry-spell frequency
online/offline income mix
financial behaviour
available savings
risk profile
```

Example input:

```json
{
  "averageIncome": 920,
  "incomeVariance": 18500,
  "volatilityClass": "high",
  "drySpellFrequency": 0.18,
  "availableSavings": 4200,
  "riskProfile": "moderate"
}
```

The deterministic recommendation engine produces an illustrative category:

```json
{
  "category": "Conservative",
  "reasonCodes": [
    "HIGH_INCOME_VOLATILITY",
    "MODERATE_RISK_PROFILE",
    "LIMITED_AVAILABLE_SAVINGS"
  ]
}
```

Then the LLM generates the plain-language explanation.

The LLM must not independently calculate financial values.

Every recommendation must include:

```text
Illustrative information, not personalized financial advice.
```

---

# 19. Recommendation Data Model

```text
Recommendation
--------------
id
userId
category
reasoning
confidence
createdAt
```

Also store the inputs used:

```text
RecommendationInput
-------------------
id
userId
averageIncome
incomeVariance
volatilityClass
drySpellFrequency
savingsRate
availableSavings
riskProfile
createdAt
```

This makes the recommendation explainable and auditable.

---

# 20. Tax Assistant

Tax is another core backend module.

Flow:

```text
AA Income
     +
Offline Income
     ↓
Cumulative Eligible Income
     ↓
Tax Rule Set
     ↓
Deterministic Tax Engine
     ↓
Estimated Liability
     ↓
Suggested Set-Aside
```

## Models

```text
TaxRuleSet
----------
id
name
effectiveFrom
effectiveTo
assumptions
createdAt
```

```text
TaxEstimate
-----------
id
userId
quarter
cumulativeIncome
estimatedLiability
suggestedSetAside
ruleSetId
createdAt
```

Keep the calculation deterministic.

The LLM can explain:

```text
Your estimated liability increased because your cumulative eligible income increased.
```

The UI must state:

```text
Planning estimate only.
Not tax filing or professional tax advice.
```

---

# 21. LangGraph Agent

LangGraph orchestrates the workflow.

```text
Income Ingestion
      ↓
Classification
      ↓
Pattern Analysis
      ↓
Smart Save
      ↓
Safety
      ↓
Goal Allocation
      ↓
Recommendation
      ↓
Tax
      ↓
Explanation
```

State:

```ts
interface FinancialAgentState {
  userId: string;

  averageIncome: number;
  incomeVariance: number;
  volatilityClass: string;
  drySpellFrequency: number;

  todayIncome: number;
  surplus: number;
  savingsAmount: number;

  smartSaveEnabled: boolean;
  safetyMode: boolean;

  walletBalance: number;
  goalAllocations: Record<string, number>;

  riskProfile: string;

  recommendation?: string;
  explanation?: string;

  taxEstimate?: number;
}
```

### LLM responsibility

The LLM may:

- explain savings decisions
- summarize income patterns
- explain recommendations
- explain tax estimates

The LLM must not calculate:

- income
- variance
- savings
- goal allocation
- interest
- tax liability

---

# 22. Dashboard API

Use one aggregation endpoint:

```http
GET /api/dashboard/:userId
```

Response:

```json
{
  "income": {
    "today": 1450,
    "average": 900,
    "monthly": 28450,
    "online": 21000,
    "offline": 7450,
    "volatility": "medium"
  },

  "wallet": {
    "balance": 10000,
    "interestEarned": 120
  },

  "goals": {
    "emergency": 5000,
    "medical": 3000,
    "growth": 2000
  },

  "savings": {
    "total": 3250,
    "todayAutoSave": 75,
    "manualDeposits": 500
  },

  "recommendation": {
    "category": "Conservative",
    "reason": "..."
  },

  "tax": {
    "estimatedLiability": 4200,
    "suggestedSetAside": 5000
  }
}
```

---

# 23. API Design

## AA

```http
POST   /api/aa/consent
GET    /api/aa/consent/:userId
POST   /api/aa/sync/:userId
DELETE /api/aa/consent/:consentId
```

## Income

```http
POST   /api/income/manual
GET    /api/income/:userId
GET    /api/income/:userId/stats
GET    /api/income/:userId/offline
PATCH  /api/income/manual/:incomeId
DELETE /api/income/manual/:incomeId
```

## Savings

```http
GET  /api/savings/:userId
POST /api/savings/decision
POST /api/savings/enable
POST /api/savings/pause
```

## Wallet

```http
GET  /api/wallet/:userId
POST /api/wallet/deposit
POST /api/wallet/auto-save
POST /api/wallet/:userId/withdraw
```

## Goals

```http
GET    /api/wallet/:userId/goals
POST   /api/wallet/:userId/goals
PATCH  /api/wallet/:userId/goals/:goalId
DELETE /api/wallet/:userId/goals/:goalId
POST   /api/wallet/:userId/goals/allocate
```

## Interest

```http
GET /api/wallet/:userId/interest
GET /api/wallet/:userId/interest/history
```

## Investment Recommendation

```http
GET  /api/recommendation/:userId
POST /api/recommendation/generate
```

## Tax

```http
GET  /api/tax/:userId
POST /api/tax/calculate
```

## Simulation

```http
POST /api/simulation/income
POST /api/simulation/persona
```

## Dashboard

```http
GET /api/dashboard/:userId
```

---

# 24. What-If Simulator

The simulator must not modify real wallet data.

```http
POST /api/simulation/income
```

Input:

```json
{
  "userId": "123",
  "todayIncome": 1500
}
```

Flow:

```text
Current User Data
       ↓
Temporarily replace today's income
       ↓
Pattern Engine
       ↓
Smart Save
       ↓
Safety
       ↓
Goal Allocation
       ↓
Recommendation
       ↓
Tax Context
       ↓
Simulation Response
```

Example:

```json
{
  "income": 1500,
  "normalIncome": 900,
  "surplus": 600,
  "recommendedSave": 90,
  "decision": "SAVE",
  "goalAllocation": {
    "emergency": 45,
    "medical": 27,
    "growth": 18
  }
}
```

---

# 25. Idempotency and Consistency

Every AA transaction must have a unique external ID.

```text
First sync:
txn_82931 → process

Second sync:
txn_82931 → ignore
```

Financial operations must use PostgreSQL transactions.

Example auto-save:

```text
BEGIN

Create wallet transaction
Increase eligible balance
Allocate Emergency
Allocate Medical
Allocate Growth
Create savings ledger
Create explanation event

COMMIT
```

If anything fails:

```text
ROLLBACK
```

---

# 26. Demo Data

Create at least three personas.

## Delivery Rider

```text
₹850
₹920
₹780
₹950
₹900
₹870
₹1450
```

## Ride-share Driver

```text
₹1400
₹1550
₹1600
₹1450
₹1700
```

## Freelancer

```text
₹0
₹2500
₹0
₹4000
₹1500
₹6000
```

Also include a mixture of:

```text
AA online income
+
manual offline income
```

to demonstrate the unified income engine.

---

# 27. Backend Implementation Sequence

## Phase 1 — Foundation

- Node.js + Express + TypeScript
- PostgreSQL
- Prisma
- Zod
- Environment configuration
- Authentication
- Error handling

## Phase 2 — Database

Create:

```text
User
AAConsent
FinancialAccount
Transaction
IncomeStats
Wallet
Goal
WalletTransaction
SavingsLedger
InterestAccount
InterestEntry
Recommendation
RecommendationInput
TaxRuleSet
TaxEstimate
```

## Phase 3 — Income

- Mock AA provider
- AA sync
- Transaction normalization
- Income classification
- Manual offline income
- Unified income ledger

## Phase 4 — Intelligence

- Rolling average
- Variance
- Volatility
- Dry-spell detection
- Smart Save
- Safety Mode

## Phase 5 — Wallet

- Wallet service
- Goal management
- Goal allocation
- Deposit simulation
- Withdrawal simulation
- Ledger

## Phase 6 — Interest

- Interest account
- Interest calculation
- Interest history
- Wallet integration

## Phase 7 — Investment

- Risk profile
- Financial behaviour statistics
- Recommendation engine
- Recommendation persistence
- Explanation generation

## Phase 8 — Tax

- Tax rule set
- Deterministic tax engine
- Tax estimate
- Set-aside calculation
- Explanation

## Phase 9 — Agent

- LangGraph state
- Income node
- Pattern node
- Savings node
- Safety node
- Recommendation node
- Tax node
- Explanation node

## Phase 10 — Demo

- Dashboard API
- What-if simulator
- Persona switching
- Seed data
- Integration testing
- Deployment

---

# 28. 36-Hour Execution Plan

| Time | Backend Task |
|---|---|
| 0–2h | Express + TypeScript + Prisma + PostgreSQL |
| 2–4h | Schema + migrations + seed |
| 4–6h | Mock AA + online income |
| 6–7h | Manual offline income |
| 7–9h | Classification + unified income |
| 9–11h | Pattern engine |
| 11–14h | Smart Save + Safety |
| 14–17h | Smart Wallet + goals |
| 17–19h | Deposit + withdrawal + ledger |
| 19–21h | **Interest engine** |
| 21–24h | **Investment recommendation engine** |
| 24–26h | **Tax engine** |
| 26–29h | LangGraph + explanations |
| 29–31h | Dashboard API |
| 31–33h | What-if simulator |
| 33–35h | Integration testing |
| 35–36h | Deployment + demo preparation |

---

# 29. End-to-End Demo Scenario

```text
User selects Delivery Rider
        ↓
AA syncs online income
        ↓
User manually adds ₹300 offline income
        ↓
Backend combines both
        ↓
Today's total income = ₹1,600
        ↓
Normal income = ₹900
        ↓
High-income day detected
        ↓
Smart Save calculates ₹105
        ↓
Safety checks pass
        ↓
₹105 allocated:
Emergency ₹52.50
Medical   ₹31.50
Growth    ₹21
        ↓
Smart Wallet updated
        ↓
Applicable interest displayed
        ↓
Investment recommendation updated
        ↓
Cumulative income updates tax estimate
        ↓
LangGraph generates explanation
        ↓
Dashboard updates
```

---

# 30. Success Criteria

Before the demo, verify:

- AA/mock AA can provide online transactions.
- User can manually enter offline income.
- Online + offline income appears in one unified income view.
- Bank credits are not automatically treated as income.
- Income statistics change when income changes.
- Smart Save uses actual income statistics.
- Low-income periods reduce/pause saving.
- Smart Wallet and goals remain consistent.
- Manual deposits work.
- Auto-save simulation works.
- Goal withdrawals work.
- Interest is displayed separately and transparently.
- Investment recommendations use computed financial statistics.
- Recommendations change when financial behaviour changes.
- Tax estimates use cumulative eligible income.
- Tax estimates update when income changes.
- LLM does not calculate financial numbers.
- Every important decision has an explanation.
- What-if simulation does not mutate real wallet data.
- AA production architecture is separated from the prototype mock.
- Customer funds are never represented as being held by the application itself.

---

# 31. Final Backend Architecture

```text
                         USER
                           |
              +------------+-------------+
              |                          |
              v                          v
       ACCOUNT AGGREGATOR          MANUAL OFFLINE
        ONLINE INCOME                INCOME ENTRY
              |                          |
              +------------+-------------+
                           |
                           v
                 UNIFIED INCOME LEDGER
                           |
                           v
                 INCOME CLASSIFICATION
                           |
                           v
                 INCOME PATTERN ENGINE
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      SMART SAVE     INVESTMENT           TAX
        ENGINE       RECOMMENDATION      ASSISTANT
          |                |                |
          v                v                v
       SAFETY          CATEGORY +       LIABILITY +
        MODE           EXPLANATION       SET-ASIDE
          |
          v
    GOAL ALLOCATION
          |
    +-----+------+------+
    |            |      |
    v            v      v
Emergency     Medical  Growth
    |            |      |
    +------------+------+
                 |
                 v
            SMART WALLET
                 |
       +---------+---------+
       |         |         |
       v         v         v
   Deposits   Interest  Withdrawals
       |         |         |
       +---------+---------+
                 |
                 v
             LEDGER
                 |
                 v
             DASHBOARD

              LANGGRAPH
                 |
       Orchestrates the workflow
                 |
                 v
            EXPLANATION
```

## Core principle

**AA provides online financial data. Manual entry captures offline income. Both feed the same income intelligence engine. That single financial picture drives adaptive savings, goal allocation, interest tracking, investment suggestions, and tax planning.**

This keeps the backend aligned with the PRD while making AA, offline income, goal-based savings, interest, investment recommendations, and tax assistance first-class features.
