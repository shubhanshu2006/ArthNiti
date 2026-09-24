# ArthNiti (अर्थनीति)
### Micro-Investment & Autonomous Savings Platform for Gig & Platform Workers

> **Binary Hacks 4.0 · Track: PS-02 (FinTech / Data Analytics)**  
> **Core USP:** *"We don’t ask gig workers to save — we detect when they can save, and do it for them automatically, strictly based on their own volatile income pattern."*

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Core Innovations & Philosophy](#-core-innovations--philosophy)
3. [End-to-End System Architecture](#-end-to-end-system-architecture)
4. [Backend Implementation Deep Dive](#-backend-implementation-deep-dive)
   - [Unified Income Ledger & Ingestion (AA + Cash)](#unified-income-ledger--ingestion-aa--cash)
   - [Income Pattern & Volatility Engine](#income-pattern--volatility-engine)
   - [Autonomous Smart Save Engine & Safety Mode](#autonomous-smart-save-engine--safety-mode)
   - [Smart Wallet & Goal-Based Segregation](#smart-wallet--goal-based-segregation)
   - [Interest Accrual Engine](#interest-accrual-engine)
   - [Rule-Based Investment Recommendation Engine](#rule-based-investment-recommendation-engine)
   - [Presumptive Tax Assistant](#presumptive-tax-assistant)
   - [LangGraph Multi-Node Financial Agent](#langgraph-multi-node-financial-agent)
5. [Frontend Implementation Deep Dive](#-frontend-implementation-deep-dive)
   - [Design Aesthetics & Token System](#design-aesthetics--token-system)
   - [App Router Architecture & Route Groups](#app-router-architecture--route-groups)
   - [Feature Modules & Interactive Views](#feature-modules--interactive-views)
   - [Deterministic UI Principle](#deterministic-ui-principle)
6. [Data Model & Prisma Schema](#-data-model--prisma-schema)
7. [API Reference Directory](#-api-reference-directory)
8. [Multi-Persona Demo Personas](#-multi-persona-demo-personas)
9. [Getting Started & Local Setup](#-getting-started--local-setup)
   - [Prerequisites](#prerequisites)
   - [Backend Configuration & Database Seeding](#backend-configuration--database-seeding)
   - [Frontend Configuration & Running](#frontend-configuration--running)
   - [Using Docker Compose for Database](#using-docker-compose-for-database)
10. [Hackathon Evaluation & Verification Script](#-hackathon-evaluation--verification-script)
11. [Regulatory Boundaries & Production Roadmap](#-regulatory-boundaries--production-roadmap)

---

## 🎯 Executive Summary & Problem Statement

### The Problem
India's 12+ million gig and platform workers (delivery partners, rideshare drivers, taskers, freelance creators) face **severe cashflow volatility**. Unlike salaried professionals with predictable monthly income cycles:
- A worker might earn **₹1,800 on a festival Saturday**, **₹600 on a Tuesday**, and **₹0 on a rest or illness day**.
- Traditional financial products (fixed recurring deposits, monthly SIPs, static 50/30/20 budgeting) fail because a fixed debit on a low-earning day bounces, incurs bank penalties, or drains cash needed for daily fuel and groceries.
- Consequently, workers accumulate cash surplus on windfall days and inadvertently spend it before the next dry spell.

### The ArthNiti Solution
ArthNiti inverts the savings paradigm:
1. **Dynamic Baseline Learning:** Continually calculates the worker's rolling normal baseline, median income, standard deviation, and dry-spell frequency across both digital platform payouts (Account Aggregator) and cash tips (Manual Ledger).
2. **Surplus-Only Micro-Savings:** Automatically intercepts a safe percentage (e.g. 15%) **only from the surplus above normal earnings** on above-average days.
3. **Safety Mode Cashflow Armor:** Instantly halts or reduces auto-debits if earnings fall below the baseline, if the user experiences a 3-day dry spell, or if the liquid balance would drop below a user-defined safety floor.
4. **Virtual Goal Segregation:** Automatically channels savings into prioritized virtual buckets: **Emergency (50%)**, **Medical (30%)**, and **Growth (20%)**, earning underlying daily interest.
5. **Contextual Intelligence:** Powers personalized, risk-aligned investment guidance, quarterly presumptive tax set-asides (Section 44ADA), and an autonomous LangGraph agent generating human explanations for every rupee saved.

---

## 💡 Core Innovations & Philosophy

| Principle | Traditional FinTech | ArthNiti Engine |
|---|---|---|
| **Savings Trigger** | Fixed calendar date (e.g. 1st of month) | Volatility-aware: triggers only when surplus is detected on good earning days |
| **Cashflow Protection** | None (penalties for insufficient balance) | **Safety Mode**: pauses auto-save on dry spells or below-baseline days |
| **Financial Computation** | LLM hallucinations or opaque black-boxes | **Strict Determinism**: 100% of financial math runs in auditable TypeScript/Postgres engines; LLM only explains |
| **Income Scope** | Bank statements only | **Dual Ledger**: RBI Account Aggregator (AA) digital payouts + cash/offline ledger |
| **Money Segregation** | Commingled savings accounts | **Smart Wallet**: Application-level segregated virtual goals without breaking partner interest accrual |
| **What-If Simulation** | Static calculators | **Real-time Live Simulator**: Non-mutating (`mutated: false`) scenario sandboxing |

---

## 🏗 End-to-End System Architecture

```text
                                  ┌────────────────────────┐
                                  │   Gig / Platform User  │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
       ┌────────────────────────┐                          ┌────────────────────────┐
       │ Account Aggregator (AA)│                          │ Manual Offline / Cash  │
       │ Swiggy, Zomato, Uber   │                          │ Tips, Private Errand   │
       └────────────┬───────────┘                          └────────────┬───────────┘
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │    Unified Income Ledger    │
                               │  (Classification Heuristics)│
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │    Income Pattern Engine    │
                               │ Rolling Avg, Volatility Class│
                               │   Good-Day & Dry Thresholds │
                               └──────────────┬──────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
       ┌────────────────────────┐┌────────────────────────┐┌────────────────────────┐
       │   Smart Save Engine    ││   Investment Engine    ││  Presumptive Tax Asst  │
       │ Surplus Detection Math ││ Risk Matrix & Suitability│ Section 44ADA Estimation│
       └────────────┬───────────┘└────────────┬───────────┘└────────────┬───────────┘
                    │                         │                         │
                    ▼                         │                         │
       ┌────────────────────────┐             │                         │
       │   Safety Mode Engine   │             │                         │
       │ 3-Day Streak & Floors  │             │                         │
       └────────────┬───────────┘             │                         │
                    │                         │                         │
                    ▼                         │                         │
       ┌────────────────────────┐             │                         │
       │ Goal Allocation Engine │             │                         │
       │ 50% Emerg / 30% Med    │             │                         │
       └────────────┬───────────┘             │                         │
                    │                         │                         │
                    ▼                         ▼                         ▼
       ┌────────────────────────────────────────────────────────────────────────────┐
       │                    LangGraph Financial Agent Pipeline                      │
       │      [income] ➔ [pattern] ➔ [savings] ➔ [safety] ➔ [goals] ➔ [tax] ➔ [LLM] │
       └──────────────────────────────────────┬─────────────────────────────────────┘
                                              │
                                              ▼
       ┌────────────────────────────────────────────────────────────────────────────┐
       │                 Frontend App Shell (Next.js 16 + Tailwind v4)              │
       │  Dashboard Cockpit · Smart Wallet · What-If Simulator · Explanation Feed   │
       └────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Backend Implementation Deep Dive

The backend is built with **Node.js, Express, TypeScript, Prisma ORM, PostgreSQL**, and **LangGraph**. It is architected into modular domain packages located in `backend/src/modules/`:

### Unified Income Ledger & Ingestion (`aa` & `income`)
- **Dual-Stream Ingestion:** Combines digital gig payouts fetched through RBI-compliant Account Aggregator consent flows (mocked for demo reproducibility with Swiggy, Zomato, Uber, Ola, Upwork, Razorpay) with cash/offline income entered by the user.
- **Rule-Based Classifier (`income-classifier.ts`):** Distinguishes business earnings from peer-to-peer personal transfers using regex pattern matching, source identifiers, and threshold checks, tagging transactions with `isIncome`, `incomeMode` (`ONLINE` / `OFFLINE`), and `classificationConfidence`.

### Income Pattern & Volatility Engine (`income/pattern`)
Calculates statistical indices over a rolling 30-day window:
- **Baseline (Normal Income):** Trimmed mean and median to prevent one-off spikes from skewing baseline expectations.
- **Good-Day Threshold:** Typically set at $1.15 \times \text{Normal Income}$ or $\text{Rolling Mean} + (0.5 \times \text{StdDev})$.
- **Volatility Classification:**
  - $\text{Coefficient of Variation (CV)} = \frac{\sigma}{\mu}$
  - $\text{CV} \le 0.25 \implies \text{LOW}$
  - $0.25 < \text{CV} \le 0.50 \implies \text{MEDIUM}$
  - $\text{CV} > 0.50 \implies \text{HIGH}$
- **Dry-Spell Frequency:** Ratio of zero or near-zero income days over the active period.

### Autonomous Smart Save Engine & Safety Mode (`savings`)
- **Surplus Detection Formula:**
  $$\text{Surplus} = \max(0, \text{Income}_{\text{today}} - \text{Income}_{\text{normal}})$$
- **Preliminary Save Amount:**
  $$\text{Proposed Save} = \min(\text{Surplus} \times \text{Saving Percentage}, \text{Max Daily AutoSave})$$
- **Safety Mode Execution Chain (`safety.engine.ts`):**
  1. *Enabled Check:* If `smartSaveEnabled === false` $\implies$ `PAUSE`.
  2. *Surplus Check:* If $\text{Income}_{\text{today}} \le \text{Income}_{\text{normal}} \implies$ `PAUSE` (no surplus).
  3. *Streak Protection:* If user has had $\ge 3$ consecutive dry days $\implies$ `PAUSE` to protect working capital.
  4. *Safety Floor:* Verifies that $(\text{Available Balance} - \text{Proposed Save}) \ge \text{Minimum Balance}$. If breached $\implies$ `REDUCE` or `PAUSE`.

### Smart Wallet & Goal-Based Segregation (`wallet` & `goals`)
- **Custody Separation:** Distinguishes between cumulative income earned and actual liquid balances deposited in the savings instrument.
- **Virtual Goal Allocation:**
  - **Emergency Fund (Priority 1):** 50% of auto-saved funds
  - **Medical Buffer (Priority 2):** 30% of auto-saved funds
  - **Growth Fund (Priority 3):** 20% of auto-saved funds
- Supports instant manual top-ups, custom goal creation, and partial/full goal withdrawals.

### Interest Accrual Engine (`interest`)
- Simulates an underlying regulated partner product (e.g. liquid mutual fund or high-yield savings partner) offering **6.5% p.a.**
- Calculates daily accrual: $\text{Daily Interest} = \frac{\text{Eligible Balance} \times 0.065}{365}$.
- Generates transparent interest ledger entries with timestamped credit actions.

### Rule-Based Investment Recommendation Engine (`recommendations`)
- Categorizes users into **Conservative**, **Balanced**, or **Growth** profiles based on their assessed income volatility class, emergency fund coverage, dry-spell frequency, and user-selected risk appetite.
- Generates auditable machine reason codes (e.g. `HIGH_INCOME_VOLATILITY`, `FREQUENT_DRY_SPELLS`, `LIMITED_AVAILABLE_SAVINGS`).
- Enforces mandatory SEBI non-advisory compliance disclaimers on every response.

### Presumptive Tax Assistant (`tax`)
- Applies Section 44ADA / Presumptive Business Income provisions for freelancers and gig workers under the Indian Income Tax New Regime.
- Calculates estimated annual liability and provides a transparent **Suggested Quarterly Set-Aside** to prevent year-end liquidity crunches.

### LangGraph Multi-Node Financial Agent (`backend/src/agent`)
Coordinates the entire lifecycle through a state graph with 8 deterministic calculation nodes and 1 LLM explanation node:

```text
[START] ➔ [incomeNode] ➔ [patternNode] ➔ (Conditional: errors?)
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                                  [END]                 [savingsNode]
                                                            │
                                                            ▼
                                                       [safetyNode]
                                                            │
                                                            ▼
                                                   [goalAllocationNode]
                                                            │
                                                            ▼
                                                  [recommendationNode]
                                                            │
                                                            ▼
                                                        [taxNode]
                                                            │
                                                            ▼
                                                    [explanationNode]
                                                            │
                                                            ▼
                                                          [END]
```

- **Zero-Hallucination Guardrail:** The LLM (powered by **Groq `llama-3.3-70b-versatile`**) receives strictly pre-computed values from preceding deterministic nodes in state. It is **never** permitted to calculate numbers or make financial decisions—only to translate decisions into plain, empathetic language.
- **Active Groq Integration & Fallback:** Groq provides ultra-fast (~800 tokens/sec), zero-latency natural language explanations. If an API key is absent or an external provider times out, the node gracefully falls back to deterministic template synthesis without throwing an exception.

---

## 🎨 Frontend Implementation Deep Dive

The frontend is built with **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, SWR**, and **Recharts**.

### Design Aesthetics & Token System
- **Palette:** Warm, premium FinTech aesthetic inspired by modern wealth platforms. Crisp `#FCFAF6` canvas, deep `#18181B` typography, vibrant energetic orange/coral accents (`#F97316` / `#E5533D`), emerald accents for positive cashflows, and neutral stone borders.
- **Typography:** `Inter` for clear, readable numeric dashboards paired with `Instrument Serif` italics for editorial accent headings.
- **Micro-Interactions:** Hover-lift bento cards, smooth progress bars, real-time recalculation feedback, and glassmorphic modal overlays.

### App Router Architecture & Route Groups
```text
frontend/app/
├── (marketing)/                # Public Marketing Pages
│   └── page.tsx                # Hero, 6 Bento Widgets, Testimonials, Dashboard Preview, Footer
├── (auth)/                     # Frictionless Demo Access
│   ├── sign-in/page.tsx        # Email-only authentication with quick-demo pills
│   └── get-started/page.tsx    # Interactive Persona Picker (Ravi, Priya, Arjun)
└── (app)/                      # Authenticated Application Shell
    ├── layout.tsx              # AppShell wrapper with responsive Sidebar & Topbar
    ├── dashboard/page.tsx      # Central cockpit with wallet, charts, agent feed, goals
    ├── wallet/page.tsx         # Smart Wallet balance, interest stats, deposit/withdraw modals
    ├── goals/page.tsx          # Goal cards, allocation sliders, progress metrics
    ├── income/page.tsx         # 30-day volatility curve, cash income logging, breakdown
    ├── recommendations/page.tsx# Investment categories, suitability badges, SEBI disclaimers
    ├── tax/page.tsx            # Presumptive tax calculation, quarterly set-aside buffer
    ├── simulator/page.tsx      # Interactive What-If slider with non-mutating badge
    └── settings/page.tsx       # Safety limits, risk profile, AA Consent & Sync manager
```

### Deterministic UI Principle
In adherence to PRD §15 and system architecture guidelines, **the frontend UI never calculates money**. Every balance, surplus, recommended save, tax estimate, and goal share rendered on screen originates directly from the backend API responses.

---

## 🗄 Data Model & Prisma Schema

```mermaid
erDiagram
    User ||--o{ AAConsent : grants
    User ||--o{ FinancialAccount : owns
    User ||--o{ Transaction : logs
    User ||--o{ IncomeStats : analyzes
    User ||--|| Wallet : holds
    User ||--o{ Goal : creates
    User ||--o{ Recommendation : receives
    User ||--o{ TaxEstimate : estimates

    Wallet ||--o{ Goal : allocates
    Wallet ||--o{ WalletTransaction : records
    Wallet ||--o{ SavingsLedger : tracks
    Wallet ||--|| InterestAccount : links
    Wallet ||--o{ InterestEntry : accrues

    TaxRuleSet ||--o{ TaxEstimate : governs
```

### Core Database Entities

| Model | Purpose | Key Attributes |
|---|---|---|
| `User` | Core worker profile | `persona`, `riskProfile`, `smartSaveEnabled`, `maxDailyAutoSave`, `minimumBalance`, `savingPercentage` |
| `AAConsent` | Account Aggregator consent | `provider`, `consentId`, `status`, `expiresAt` |
| `FinancialAccount` | Linked bank / platform accounts | `institutionName`, `accountType`, `maskedAccountNumber`, `currency` |
| `Transaction` | Unified income & debit ledger | `amount`, `date`, `sourcePlatform`, `sourceType` (`AA`/`MANUAL`), `incomeMode` (`ONLINE`/`OFFLINE`), `isIncome` |
| `IncomeStats` | Cached 30-day pattern analytics | `rollingAverage`, `medianIncome`, `variance`, `volatilityClass`, `goodDayThreshold`, `drySpellFrequency` |
| `Wallet` | Eligible savings wallet view | `balance`, `interestEarned`, `updatedAt` |
| `Goal` | Segregated financial targets | `type` (`EMERGENCY`/`MEDICAL`/`GROWTH`/`CUSTOM`), `targetAmount`, `allocatedBalance`, `allocationPercentage`, `priority` |
| `SavingsLedger` | Auto-save execution record | `amount`, `type` (`AUTOSAVE`/`MANUAL`), `reason` |
| `InterestAccount` | Partner custody product metadata | `partnerName`, `productName`, `annualRate` (e.g. 6.5%) |
| `InterestEntry` | Daily interest credit audit trail | `amount`, `eligibleBalance`, `rate`, `periodStart`, `periodEnd` |
| `TaxEstimate` | Section 44ADA projections | `quarter`, `cumulativeIncome`, `estimatedLiability`, `suggestedSetAside` |

---

## 📡 API Reference Directory

All authenticated routes accept standard JWT headers: `Authorization: Bearer <TOKEN>`.

### 1. Authentication & Users
- `POST /api/auth/login` — Login or auto-provision with email. Returns JWT token and user profile.
- `GET /api/users/:id` — Fetch complete user settings and financial parameters.
- `PATCH /api/users/:id` — Update risk profile, saving percentage, daily caps, or safety floor.

### 2. Account Aggregator & Transactions
- `POST /api/aa/consent` — Initialize mock AA consent artifact.
- `GET /api/aa/consent/:userId` — Fetch active AA consent status.
- `POST /api/aa/sync/:userId` — Pull latest simulated platform payouts from Swiggy/Zomato/Uber.
- `DELETE /api/aa/consent/:consentId` — Revoke AA data sharing consent.

### 3. Income Analysis & Manual Ledger
- `GET /api/income/:userId/summary` — Full 30-day analysis (rolling average, volatility, good day threshold, dry spell frequency).
- `GET /api/income/:userId/daily` — Daily time series of earnings split by online vs. offline.
- `GET /api/income/:userId/today` — Current day's accrued earnings.
- `POST /api/income/manual` — Log manual cash/offline income (e.g. tips or cash errands).

### 4. Smart Save & Safety Controls
- `GET /api/savings/:userId/decision` — Evaluates today's earnings and returns `SAVE`, `PAUSE`, or `REDUCE`.
- `POST /api/savings/:userId/execute` — Atomically executes the auto-save decision and credits the Smart Wallet.
- `GET /api/savings/:userId/history` — Audit trail of automatic savings events.
- `PATCH /api/savings/:userId/toggle` — Instant toggle to pause or resume Smart Save automation.

### 5. Smart Wallet & Goals
- `GET /api/wallet/:userId` — Liquid balance and interest stats.
- `POST /api/wallet/:userId/deposit` — Manual funds deposit.
- `POST /api/wallet/:userId/withdraw` — Withdraw funds from wallet or a specific goal.
- `GET /api/wallet/:userId/ledger` — Complete wallet transaction history.
- `GET /api/wallet/:userId/goals` — List of all virtual goals and current balances.
- `POST /api/wallet/:userId/goals` — Create a new goal.
- `PATCH /api/wallet/:userId/goals/allocation` — Update percentage splits across goals.

### 6. Partner Interest Accrual
- `GET /api/wallet/:userId/interest` — Partner interest rate, eligible balance, accrued earnings.
- `POST /api/wallet/:userId/interest/calculate` — Trigger on-demand daily interest accrual calculation.

### 7. Recommendations & Tax
- `GET /api/recommendation/:userId` — Algorithmic category, confidence score, and reason codes.
- `GET /api/tax/:userId/estimate` — Cumulative income, tax liability estimate, and quarterly set-aside buffer.

### 8. LangGraph Financial Agent
- `POST /api/agent/run` — Executes the full 8-node state machine and outputs structured decisions and LLM explanations.

### 9. What-If Scenario Simulator
- `POST /api/simulation/income` — Non-mutating (`mutated: false`) endpoint that accepts an arbitrary `todayIncome` and returns simulated surplus, auto-save amount, goal allocation, and safety checks in real-time.

---

## 👥 Multi-Persona Demo Personas

The database comes pre-seeded with 3 realistic gig worker profiles designed to demonstrate adaptive behavior during evaluation:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. Ravi Kumar (Delivery Rider)                                              │
│ Email: ravi.kumar@demo.com                                                 │
│ Normal Income: ₹900/day · Volatility: Medium · Risk: Conservative          │
│ Baseline: Swiggy/Zomato daily deliveries with occasional cash tips.        │
│ Smart Save: 15% · Max Daily: ₹200 · Minimum Balance Floor: ₹200            │
├────────────────────────────────────────────────────────────────────────────┤
│ 2. Priya Sharma (Rideshare Driver)                                         │
│ Email: priya.sharma@demo.com                                               │
│ Normal Income: ₹1,500/day · Volatility: Low-Medium · Risk: Moderate        │
│ Baseline: Uber/Ola trips with private airport cash bookings.               │
│ Smart Save: 18% · Max Daily: ₹350 · Minimum Balance Floor: ₹200            │
├────────────────────────────────────────────────────────────────────────────┤
│ 3. Arjun Mehta (Freelancer)                                                │
│ Email: arjun.mehta@demo.com                                                │
│ Normal Income: ₹2,500/day · Volatility: High · Risk: Aggressive            │
│ Baseline: Large Razorpay/Upwork milestones interspersed with zero-pay dry  │
│ spells. Smart Save: 20% · Max Daily: ₹1,000 · Minimum Balance Floor: ₹200 │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js:** v20.x or higher
- **Package Manager:** `npm` (v10+)
- **Database:** PostgreSQL (local, Docker, or Neon/Supabase cloud instance)

---

### Backend Configuration & Database Seeding

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fintech?sslmode=disable"
   PORT=5000
   NODE_ENV=development
   JWT_SECRET="arthniti-super-secret-jwt-key-2025"
   JWT_EXPIRES_IN=7d
   
   # --- LLM Agent Configuration (Groq Active) ---
   LLM_PROVIDER="groq"
   LLM_MODEL="llama-3.3-70b-versatile"
   GROQ_API_KEY="gsk_your_groq_api_key_here"
   ```

4. Run Prisma database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Seed the database with the demo personas and transactions:
   ```bash
   npm run prisma:seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The Express API will be running at `http://localhost:5000` (Healthcheck: `http://localhost:5000/health`).*

---

### Frontend Configuration & Running

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `frontend/.env.local` points to your running backend:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:3000`.*

---

### Using Docker Compose for Database

If you do not have a local PostgreSQL instance or cloud URL, start one in seconds using Docker:
```bash
cd backend
docker compose up -d
```
*This launches PostgreSQL 16 on port `5432` with user `fintech`, password `fintech`, and database `fintech`.*

---

## 🧪 Hackathon Evaluation & Verification Script

Follow this step-by-step walkthrough to verify all core capabilities required by Problem Statement **PS-02**:

### Step 1: Persona Onboarding
1. Navigate to `http://localhost:3000`.
2. Click **"Get Started"** in the top navigation.
3. Select **Ravi Kumar (Delivery Rider)**. Notice the instant auto-authentication and redirect to the authenticated dashboard.

### Step 2: Income Volatility & Surplus Detection
1. On the **Dashboard**, observe the **Income Pattern Analysis** card.
2. Note Ravi's calculated baseline ($\approx$ ₹900) and today's income.
3. Observe the **Smart Save Decision** banner: because today's earning is above baseline, the engine automatically identifies surplus and shows the exact recommended save amount.
4. Click **"Execute Auto-Save Now"**. Notice the instant update across the Smart Wallet card, Goal allocations, and Recent Money Movement ledger.

### Step 3: LangGraph Agent Execution
1. Scroll down to the **Financial Agent Intelligence Engine** section.
2. Click **"Run Full Agent Pipeline"**.
3. Watch the sequential node status update:
   `[Income Ingestion] ➔ [Volatility Pattern] ➔ [Smart Save Decision] ➔ [Safety Check] ➔ [Goal Allocation] ➔ [Recommendation] ➔ [Tax Assessment] ➔ [Plain-Language LLM]`.
4. Review the generated empathetic narrative explaining exactly why funds were saved and allocated.

### Step 4: What-If Income Simulator (Non-Mutating)
1. In the sidebar, navigate to **What-If Simulator** (`/simulator`).
2. Drag the income slider down to **₹400** (below normal).
   - *Result:* Decision immediately flips to **`PAUSE`**, Surplus drops to ₹0, and the Safety Engine explains that earnings are below baseline.
3. Drag the slider up to **₹2,200** (surge day).
   - *Result:* Decision immediately flips to **`SAVE`**, surplus is detected, and real-time allocations to Emergency, Medical, and Growth funds appear.
4. Confirm the distinct **`SIMULATED / NON-MUTATING`** badge, verifying that the actual wallet balance has not been altered.

### Step 5: Multi-Persona Adaptation
1. Click the persona badge in the Topbar and switch to **Arjun Mehta (Freelancer)**.
2. Notice how the dashboard immediately recalibrates:
   - Baseline shifts from ₹900 to ₹2,500.
   - Volatility shifts from Medium to High.
   - Investment Recommendation dynamically switches to **Growth** (aggressive risk profile).
   - Tax Assistant projects a significantly higher quarterly set-aside under Section 44ADA.

### Step 6: Cash Income & Safety Floor
1. Click **"+ Log Cash"** in the Topbar.
2. Enter a cash delivery tip of **₹300**.
3. Observe how the unified income ledger updates without falsely assuming the cash has been credited to the regulated bank wallet.
4. Navigate to **Settings** (`/settings`) and adjust the **Minimum Balance Floor** to observe how Safety Mode enforces protection limits.

---

## 🛡 Regulatory Boundaries & Production Roadmap

### System Separation of Concerns
ArthNiti is engineered to respect the boundaries between application-level intelligence and regulated banking infrastructure:
- **No Escrow / Custodial Holding:** The platform does not hold user funds. In a production rollout, funds reside in an RBI-regulated bank account or SEBI-registered liquid mutual fund partner.
- **Account Aggregator Protocol:** Financial data ingestion is structured around the **RBI Account Aggregator (AA) framework** using consent handles and encrypted data flows.
- **Explainability over Black-Boxes:** All financial decisions are verifiable via explicit mathematical formulas and audit ledgers, complying with emerging AI governance frameworks in financial services.

### Production Roadmap
- **Live AA Gateway:** Integration with certified Sahamati Account Aggregator SDKs (e.g. Setu, Anumati, OneMoney).
- **Auto-Debit Rails:** Integration with NPCI **UPI 2.0 / e-Mandate** for user-authorized recurring micro-debits matching the Smart Save surplus schedule.
- **Partner Embedded Banking:** API-driven account opening and liquid fund sweeping with an RBI-regulated banking partner.
- **Multilingual Voice Explanations:** Audio briefings in regional Indian languages (Hindi, Tamil, Telugu, Kannada) tailored for gig workers on the road.

---

<div align="center">
  <b>Built for Binary Hacks 4.0 · FinTech & Data Analytics (PS-02)</b><br/>
  <i>Empowering India's gig workforce with autonomous, volatility-aware financial stability.</i>
</div>
