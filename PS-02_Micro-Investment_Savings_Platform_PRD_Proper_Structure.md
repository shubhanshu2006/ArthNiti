# Product Requirements Document

# Micro-Investment & Savings Platform for Gig Workers

**Binary Hacks 4.0 · PS-02 · FinTech / Data Analytics**

---

## 1. Problem Statement

Gig workers such as delivery riders, drivers, and freelancers often have irregular income. They may earn ₹1,500 on one day, ₹500 on another, or even ₹0.

Traditional savings and investment products are generally designed around predictable income and fixed monthly planning. This makes disciplined saving difficult for workers whose cash flow changes frequently.

The platform is designed around **volatile income rather than a fixed monthly salary**.

---

## 2. Core USP

> **We don't ask gig workers to save — we detect when they can save, and do it for them automatically, based on their own income pattern.**

The platform learns what a normal earning day looks like for each user. When the user earns significantly more than their normal level, the system can automatically save a small portion of the surplus using a user-authorized automatic saving mechanism.

The product uses a **Smart Wallet** experience with virtual financial goals. The app provides the wallet interface, goal allocation, savings intelligence, and ledger, while actual customer funds are held by a regulated banking/financial partner rather than by the platform itself.

Every automatic action is explained in simple language, and users can pause automatic saving, set limits, and withdraw available funds according to the partner product's rules.

**Example:**

> You earned ₹1,450 today, compared with your usual ₹900. We saved ₹80 because this was a higher-than-usual earning day.

---

## 3. Objectives

Build an intelligent financial platform that:

1. Understands a gig worker's income pattern.
2. Detects high-earning and low-earning periods.
3. Automatically triggers small savings when the user can reasonably afford them.
4. Explains every savings decision in plain language.
5. Provides a Smart Wallet with goal-based savings.
6. Recommends suitable investment categories based on income stability, financial behaviour, and risk preference.
7. Assists with tax planning through a transparent rule-based tax estimate.
8. Allows users to manually deposit money and manage their savings goals.
9. Shows income, wallet balance, goals, savings, recommendations, and tax information in one dashboard.
10. Protects cash flow by reducing or pausing automatic savings during prolonged low-income periods.

### Primary Hackathon Success Criterion

A judge should be able to change or switch the user's income pattern and immediately see:

- the income pattern change,
- the savings decision change,
- the Smart Wallet allocation change,
- the explanation change,
- the investment recommendation change,
- and the tax estimate update.

The system should demonstrate **adaptation**, not just display a static budgeting dashboard.

---

## 4. PS-02 Requirement Coverage

| Problem Statement Requirement | Product Capability |
|---|---|
| Analyse irregular income | Income Classification + Income Pattern Engine |
| Automatically enable micro-savings | Smart Save + user-authorized automatic saving |
| Avoid daily manual management | One-time Smart Save authorization + configurable limits |
| Recommend investment options | Investment Recommendation Engine |
| Use financial behaviour and risk preferences | Income stability, volatility, savings behaviour + risk profile |
| Assist with tax-related tasks | Tax Assistant / Tax Estimator |
| Make financial planning accessible | Smart Wallet + goals + dashboard + explanations |
| Use financial data in production | Consent-based Account Aggregator architecture |
| Protect users during low-income periods | Safety Mode |

### PS-Aligned Financial Agent

```text
                         FINANCIAL AGENT
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
  SMART SAVINGS          INVESTMENT               TAX ASSISTANT
        |                RECOMMENDATION                 |
        v                       |                       v
 Income Pattern           Risk + Behaviour         Income + Tax
    Analysis                 Analysis              Estimation
        |                       |                       |
        +-----------------------+-----------------------+
                                |
                                v
                          SMART WALLET
                                |
                 +--------------+--------------+
                 |              |              |
                 v              v              v
             Emergency       Medical         Growth
```

The hackathon prototype uses synthetic financial data and simulated money movement. The production design separates financial-data access, actual fund custody, and application intelligence through appropriate regulated partners.

---

## 5. Target Users

### Primary Users

- Delivery workers
- Ride-sharing drivers
- Freelancers
- Other gig/platform workers with irregular daily or weekly income

### Secondary Users

- Financial-inclusion organizations
- Fintech platforms serving gig workers
- Organizations supporting informal workers

---

## 6. Production Financial Data & Banking Architecture

### 6.1 Account Aggregator Framework

In a production version, the platform can use India's **Account Aggregator (AA) ecosystem** as a consent-based route for accessing financial information.

The Account Aggregator acts as a secure, consent-driven bridge between the financial institution holding the user's data and the authorized application requesting that data.

AA is used for **financial-data access**. It is not the place where the user's money is stored and is not itself the application's wallet.

### 6.2 Production Data Flow

```text
                         USER
                           |
              +------------+------------+
              |                         |
              v                         v
      Account Aggregator          Banking / UPI Partner
              |                         |
        User Consent                    |
              |                         |
              v                         v
       Financial Institution     Regulated Bank Account
              |                         |
              v                    Actual Funds Held
       Transaction Data                  |
              |                         |
              v                         |
      Transaction Analyzer              |
              |                         |
              v                         |
      Income Classification             |
              |                         |
              v                         |
       Income Pattern Engine             |
              |                         |
              v                         |
         Smart Save Engine --------------+
              |
              v
          Smart Wallet
              |
       +------+------+------+
       |             |      |
       v             v      v
   Emergency      Medical  Growth
       |
       v
Supported withdrawal mechanism
```

### 6.3 Responsibilities

**Account Aggregator**

- Provides consent-based access to supported financial information.
- Shares financial data with the authorized application according to the user's consent.

**Regulated Banking / Financial Partner**

- Holds the user's actual funds in the applicable financial product.
- Supports the production deposit and withdrawal mechanism.
- Provides the applicable interest according to the selected product's terms.

**Our Platform**

- Analyses income patterns.
- Determines savings opportunities.
- Maintains the Smart Wallet and goal ledger.
- Explains savings decisions.
- Provides investment recommendations and tax planning assistance.
- Does not claim custody of customer funds.

### 6.4 Important Product Principle

The platform should **not claim that every bank credit is income**.

For example:

```text
UPI CREDIT    ₹1,450
```

does not automatically mean that the user earned ₹1,450.

The system therefore needs an **Income Classification Layer** to identify likely earning transactions using available transaction information and, where necessary, user confirmation.

### 6.5 Hackathon Implementation

Real bank, Account Aggregator, UPI, and partner-bank integrations are out of scope for the prototype.

Instead, the prototype uses realistic synthetic transaction data.

```text
Synthetic Transactions
        |
        v
Income Classification
        |
        v
Daily Income
        |
        v
Pattern Analysis
        |
        v
Auto-Savings
        |
        v
Smart Wallet
```

This allows the complete product workflow to be demonstrated without requiring real financial accounts.

---

## 7. Smart Wallet & Goal-Based Savings

The **Smart Wallet** is the user's central savings interface.

It represents how the user's total eligible balance is allocated across financial goals.

### 7.1 Core Goals

Default goals:

- **Emergency Fund** — unexpected expenses.
- **Medical Fund** — health-related expenses.
- **Growth Fund** — longer-term/general savings.
- **Custom Goals** — vehicle, education, equipment, travel, or other planned expenses.

### 7.2 Custody Model

The app should **not hold customer money in its own company account or application database**.

Instead:

```text
User
  |
  v
Regulated Banking Partner
  |
  +--> Actual Money
  |
  v
Smart Wallet
  |
  +--> Emergency
  +--> Medical
  +--> Growth
  +--> Custom Goals
```

The Smart Wallet goal balances are an application-level representation of the user's actual eligible balance.

### 7.3 Example

If the underlying eligible bank balance is ₹10,000:

```text
Smart Wallet
-------------------------
Emergency Fund     ₹5,000
Medical Fund       ₹3,000
Growth Fund        ₹2,000
-------------------------
Total              ₹10,000
```

### 7.4 Interest Model

The preferred model is an eligible interest-bearing bank/savings product through the regulated partner.

The user receives the **applicable interest according to the underlying bank product's terms**.

For the primary product design, interest is associated with the underlying eligible balance rather than being assigned only to the Growth Fund.

```text
Eligible Bank Balance
          |
          v
Applicable Bank Interest
          |
          v
       User
```

The PRD does **not** assume that the bank shares the user's interest with the platform.

Any platform revenue from the banking partner is a separate contractual arrangement for permitted services such as technology, distribution, customer acquisition, API/infrastructure services, or other agreed partner services.

### 7.5 Manual Deposit

Users can manually add money when they want.

```text
User
  |
  v
Add Money
  |
  v
Enter ₹500
  |
  v
UPI Payment
  |
  v
Regulated Bank / Partner
  |
  v
Smart Wallet
  |
  v
Goal Allocation
```

For the hackathon, the UPI movement is simulated.

### 7.6 Automatic Saving

Automatic saving is the core differentiator.

The user enables **Smart Save** once and provides controls such as:

- Maximum auto-save per day
- Minimum balance to maintain
- Pause/resume automatic saving
- Savings percentage or permitted range

Example:

```text
Normal income       ₹900
Today's income    ₹1,400
Surplus              ₹500
Savings rate          15%
Auto-save             ₹75
```

With appropriate user authorization and a supported production banking/UPI mechanism, the saving can be initiated automatically without requiring manual approval for every small transaction.

The production implementation must not store or request the user's UPI PIN or banking credentials.

The hackathon prototype only simulates the movement.

### 7.7 Goal Allocation

A configurable example:

```text
Emergency Fund   50%
Medical Fund     30%
Growth Fund      20%
```

For a ₹100 auto-save:

```text
Emergency    ₹50
Medical      ₹30
Growth       ₹20
```

The allocation is configurable rather than hard-coded.

### 7.8 Withdrawal

Users can request money from an available goal.

Example:

```text
Emergency Fund = ₹5,000

Withdrawal request = ₹2,000
          |
          v
Partner-supported withdrawal
          |
          v
User receives ₹2,000
          |
          v
Emergency Fund = ₹3,000
```

For the prototype, this is simulated. In production, actual withdrawal availability, settlement, limits, and supported rails depend on the regulated partner and underlying product.

---

## 8. Scope

### 8.1 MVP — Must Ship

| # | Feature | Description |
|---|---|---|
| 1 | Income ingestion | Load realistic synthetic transaction/earning history using CSV/JSON or seeded data |
| 2 | Income classification | Identify earning transactions from supplied transaction data |
| 3 | Income pattern detection | Calculate rolling average, variance, volatility, and earning rhythm |
| 4 | Smart Save trigger | Save a configurable percentage of earnings above the user's rolling average |
| 5 | Smart Wallet & goals | Show total savings and allocate them across Emergency, Medical, Growth, and custom goals |
| 6 | Savings ledger | Track automatic saves, manual deposits, goal allocations, and withdrawals |
| 7 | Interest display | Show applicable interest earned on the eligible underlying bank balance |
| 8 | Withdrawal flow | Simulate goal withdrawal through the partner-supported flow |
| 9 | Investment recommendation | Suggest an illustrative investment category using income stability, financial behaviour, and risk profile |
| 10 | Tax Assistant | Provide a rule-based tax estimate and planning set-aside |
| 11 | Explanation layer | Explain savings, wallet actions, recommendations, and tax results in plain language |
| 12 | Dashboard | Show income, wallet balance, goals, savings, interest, recommendations, and tax information |
| 13 | Multi-persona demo | Demonstrate different behaviour for different income patterns |

### 8.2 Stretch Features

| # | Feature | Description |
|---|---|---|
| 14 | Risk-profile questionnaire | Short onboarding questionnaire to understand risk preference |
| 15 | What-if simulator | Change daily income and watch savings/recommendations adapt |
| 16 | Multi-platform income view | Combine income from multiple gig sources |
| 17 | Smart notification feed | Show high-income days, automatic savings, and wallet events |
| 18 | Safety mode | Pause or reduce savings during prolonged low-income periods |
| 19 | Weekly financial summary | Summarize income, savings, goals, and financial activity |
| 20 | Income-source breakdown | Show income from different sources separately |
| 21 | AI financial assistant | Answer questions about the user's income, savings, and goals |

### 8.3 Out of Scope for Hackathon Prototype

- Live bank integration
- Live Account Aggregator integration
- Live UPI/payment execution
- Actual movement of customer money
- Actual investment execution
- Brokerage integration
- Real tax filing
- Production-grade authentication
- Production partner onboarding

The production architecture is designed to support these integrations later.

---

## 9. Core User Workflow

```text
                         USER
                           |
                           v
                  Select / Create Profile
                           |
                           v
                    Load Income Data
                           |
                           v
                 Income Classification
                           |
                           v
                 Income Pattern Engine
                           |
              +------------+------------+
              |                         |
              v                         v
         High Income                Low Income
              |                         |
              v                         v
         Calculate Save           Protect Cash
              |                         |
              +------------+------------+
                           |
                           v
                    Smart Save Decision
                           |
                           v
                  Update Savings Ledger
                           |
                           v
                    Allocate to Goals
                           |
                           v
                     Smart Wallet
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
      Emergency         Medical           Growth
          |
          v
       Withdrawal
                           |
                           v
              Investment Recommendation
                           |
                           v
                    Tax Assistant
                           |
                           v
                     Dashboard
```

---

## 10. Income Pattern Engine

The system should learn the user's normal earning behaviour.

### Example

```text
Previous earnings:

₹850
₹920
₹780
₹950
₹900
₹870

Average ≈ ₹878
```

If the user earns:

```text
Today = ₹1,450
```

the system identifies this as a higher-than-usual earning day.

### Important Principle

A delivery rider and a freelancer should not have the same definition of a "good day."

```text
Delivery Rider
Normal = ₹900/day
Good day = ₹1,300+

Freelancer
Normal = ₹2,500/day
Good day = ₹4,000+
```

The system adapts to the individual user's history.

---

## 11. Smart Save Engine

### 11.1 Core Rule

```text
Today's Income > User's Normal Income
            |
            v
     Calculate Surplus
            |
            v
      Apply Savings %
            |
            v
       Save Amount
            |
            v
       Allocate Goals
```

### 11.2 Example

```text
Rolling average = ₹900
Today's income  = ₹1,400

Surplus = ₹500

Savings percentage = 15%

Automatic savings = ₹75
```

The system records:

```text
Income: ₹1,400
Normal income: ₹900
Surplus: ₹500
Saved: ₹75
Reason: Higher-than-usual earning day
```

The exact percentage should be configurable for the prototype.

### 11.3 Automatic Debit / Authorization Principle

The user authorizes Smart Save during setup rather than manually approving every small saving action.

Production implementation must use an appropriate regulated banking/UPI mechanism and must not store or request UPI PINs or banking credentials.

The prototype only simulates the automatic movement.

---

## 12. Safety Mechanism

The system should not blindly save money every day.

If the user experiences a prolonged low-income period:

```text
Income below normal
        |
        v
Detect low-income period
        |
        v
Reduce / pause automatic savings
        |
        v
Keep more cash available
```

Example:

> Your earnings have been lower than usual this week, so automatic savings have been paused to keep more money available.

This demonstrates that the platform is designed to **protect the user's cash flow**, not simply maximize savings.

---

## 13. Investment Recommendation

Investment recommendation is a direct PS-02 requirement.

The platform can recommend an **illustrative investment category** based on:

- Income stability
- Income volatility
- Financial behaviour
- Risk preference
- Available savings

### Example

```text
Stable income + lower risk
        ↓
Conservative category

Moderately variable income
        ↓
Moderate category

Higher stability + higher risk preference
        ↓
Growth-oriented category
```

The recommendation should always be presented as:

> **Illustrative information, not personalized financial advice.**

### Grounding Requirement

The recommendation engine must receive actual computed statistics.

```json
{
  "averageIncome": 920,
  "incomeVariance": 18500,
  "volatilityClass": "high",
  "drySpellFrequency": 0.18,
  "riskProfile": "moderate"
}
```

The explanation should reference those values rather than generating generic financial advice.

---

## 14. Tax Assistant

The platform provides a **tax estimate for planning**, not tax filing.

The tax assistant can use:

- Cumulative income
- Selected tax assumptions
- Relevant presumptive-tax rules configured for the prototype

### Flow

```text
Cumulative Income
        |
        v
Tax Calculation Rules
        |
        v
Estimated Tax Liability
        |
        v
Suggested Amount to Set Aside
```

The UI should clearly state:

> **This is an estimate for planning purposes and is not a tax filing or professional tax advice.**

---

## 15. Agent Architecture

The intelligent workflow can be implemented using **LangGraph**.

```text
┌──────────────────────────┐
│ Income Ingestion         │
│ Node                     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Income Classification    │
│ Node                     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Pattern Analysis         │
│ Average / Variance /     │
│ Volatility / Dry Spells  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Smart Save Trigger       │
│ Node                     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Safety / Goal Allocation │
│ Node                     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Router                   │
│ Volatility + Risk        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Investment Recommendation│
│ LLM + Actual Statistics  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Tax Assistant            │
│ Deterministic Engine     │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Explanation / Output     │
└────────────┬─────────────┘
             ↓
          Dashboard
```

### Important Agent Principle

The LLM should **not calculate financial numbers**.

Deterministic code calculates:

- Income
- Average
- Variance
- Volatility
- Savings amount
- Goal allocation
- Tax estimate

The LLM is primarily used to:

- Explain decisions
- Summarize the user's financial pattern
- Explain investment recommendations in simple language

This makes the system easier to audit and demonstrate.

---

## 16. Explanation Layer

Every important decision should have a human-readable explanation.

### Savings

> **₹75 saved automatically**

> You earned ₹500 more than your usual daily income today. We saved 15% of that extra amount.

### Goal Allocation

> **₹75 added to your Smart Wallet**

```text
Emergency   ₹37.50
Medical     ₹22.50
Growth      ₹15.00
```

### Savings Paused

> **Savings paused**

> Your earnings have been below your normal level for several days, so we are keeping more money available.

### Investment Recommendation

> **Why this recommendation?**

> Your income has high variability and you selected a moderate risk preference, so the system is showing a more conservative illustrative option.

### Tax Assistant

> **Estimated tax liability: ₹X,XXX**

> This estimate is based on your cumulative income and the tax assumptions selected for the prototype.

The user should never see only:

```text
trigger = TRUE
```

The system should explain **why**.

---

## 17. Dashboard

### 17.1 Income

```text
Today's income        ₹1,450
Normal daily income     ₹900
This month's income   ₹28,450
```

### 17.2 Smart Wallet

```text
Total wallet balance  ₹10,000
Interest earned          ₹120

Emergency Fund          ₹5,000
Medical Fund             ₹3,000
Growth Fund              ₹2,000
```

### 17.3 Savings

```text
Total saved             ₹3,250
Today's auto-save          ₹75
Manual deposits            ₹500
```

### 17.4 Income Pattern

```text
Average income          ₹900
Volatility              High
Good earning days       6
Low earning days        4
```

### 17.5 Investment Recommendation

```text
Current profile
Moderate / High volatility

Illustrative option
Conservative category

Why?
Based on recent income stability,
financial behaviour, and selected risk preference.
```

### 17.6 Tax Assistant

```text
Quarterly income        ₹85,000
Estimated liability      ₹X,XXX
Suggested set-aside      ₹X,XXX
```

---

## 18. What-If Simulator

A strong demo feature:

```text
Today's income

₹500 ─────────●──────── ₹2,000
              ₹1,450
```

When the judge changes the income:

```text
₹800
 ↓
No automatic saving

₹1,000
 ↓
Small saving

₹1,500
 ↓
Higher saving

₹2,000
 ↓
Higher saving
```

The dashboard should update immediately.

This proves that the system responds to changing income rather than using a fixed monthly saving amount.

---

## 19. Multi-Persona Demo

Use at least two or three realistic synthetic personas.

### Persona 1 — Delivery Rider

```text
Normal income: ₹900/day
Volatility: Medium
```

### Persona 2 — Ride-Share Driver

```text
Normal income: ₹1,500/day
Volatility: Low/Medium
```

### Persona 3 — Freelancer

```text
Normal income: ₹2,500/day
Volatility: High
```

The same income amount should not necessarily produce the same savings behaviour for every persona.

This demonstrates personalization.

---

## 20. Data Model

```text
users
-----
id
name
risk_profile
smart_save_enabled
max_daily_auto_save
minimum_balance
created_at


transactions
------------
id
user_id
amount
date
type
description
source_platform
is_income
classification_confidence


income_stats
------------
id
user_id
rolling_average
rolling_variance
volatility_class
dry_spell_frequency
computed_at


wallets
-------
id
user_id
partner_reference
eligible_balance
interest_earned
updated_at


wallet_goals
------------
id
user_id
wallet_id
goal_type
goal_name
allocated_balance
allocation_percentage
created_at
updated_at


wallet_transactions
-------------------
id
user_id
wallet_id
goal_id
type
amount
source
status
reason
created_at


savings_ledger
--------------
id
user_id
transaction_id
amount_saved
trigger_reason
allocation_details
triggered_at


recommendations
---------------
id
user_id
option
reasoning
confidence
created_at


tax_estimates
-------------
id
user_id
quarter
cumulative_income
estimated_liability
suggested_set_aside
created_at
```

---

## 21. API Design

### Income

```http
POST /api/income
```

Ingest synthetic transactions.

```http
GET /api/income/:user_id
```

Return income history.

```http
GET /api/income/:user_id/stats
```

Return:

- Rolling average
- Variance
- Volatility
- Dry-spell frequency

### Savings

```http
GET /api/savings/:user_id
```

Return savings ledger and total.

### Smart Wallet

```http
GET /api/wallet/:user_id
```

Return:

- Total eligible wallet balance
- Applicable interest earned
- Goal allocations

```http
POST /api/wallet/deposit
```

Simulate a manual UPI deposit.

```http
POST /api/wallet/auto-save
```

Simulate an automatic saving event based on the savings engine.

```http
GET /api/wallet/:user_id/goals
```

Return Emergency, Medical, Growth, and custom goal balances.

```http
POST /api/wallet/:user_id/withdraw
```

Simulate a withdrawal from an available goal.

### Recommendation

```http
GET /api/recommendation/:user_id
```

Return latest recommendation and reasoning.

### Tax

```http
GET /api/tax/:user_id
```

Return current estimated tax liability and planning set-aside.

### Simulation

```http
POST /api/simulation/income
```

Simulate a changed income value and return the updated savings decision.

---

## 22. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Dashboard and interactive demo |
| Styling | Tailwind CSS | UI |
| Backend | Node.js + Express | API and business logic |
| Agent orchestration | LangGraph | Agent workflow |
| LLM | OpenRouter / Groq | Explanation and recommendation generation |
| Database | PostgreSQL | Users, transactions, wallet, goals, savings and recommendations |
| Income analysis | Node.js | Rolling average, variance and volatility |
| Tax engine | Node.js | Deterministic tax estimation |
| Synthetic data | Seeded scripts | Realistic demo transactions |
| Production banking | Regulated bank/financial partner | Actual custody, deposits, withdrawals and applicable interest |
| Production data access | Account Aggregator ecosystem | Consent-based financial data access |
| Deployment | Vercel + Render/Railway + Neon/Supabase | Demo hosting |

No custom ML model is required for the hackathon prototype. A transparent rules-based income and savings engine is sufficient for demonstrating the core concept.

---

## 23. Business & Partner Model

The product is designed so that **the user earns from eligible savings while the platform earns separately from permitted partner economics**.

### User Value

- Actual funds remain with the regulated banking/financial partner.
- User organizes savings into financial goals through the Smart Wallet.
- User receives applicable interest according to the underlying eligible bank product.
- User can manually deposit.
- User can enable automatic saving.
- User can pause Smart Save.
- User can withdraw according to the product's rules.

### Platform Revenue

The product does not require a subscription from users.

Potential production revenue can come from contractual arrangements with regulated partners for permitted services such as:

- Technology/platform services
- Customer acquisition
- Distribution
- Partner API/infrastructure services
- Other commercially agreed and legally permitted services

**The PRD does not assume that the bank shares the user's interest with the platform. Customer interest and platform revenue are separate concepts.**

### Higher-Risk Products

P2P lending and market-linked investments are not part of the core MVP.

If introduced later, they require separate regulatory, risk, disclosure, and partner considerations.

---

## 24. Demo Flow — 90 Seconds

### Step 1 — Select Persona

> Select **Delivery Rider**

Show volatile income history.

### Step 2 — Show Pattern

> Normal income: ₹900/day

### Step 3 — Trigger

Change today's income to:

> ₹1,450

The system detects a high-income day.

### Step 4 — Automatic Saving

Show:

> **₹75 automatically saved**

Then immediately show:

> **Why? You earned ₹550 above your usual daily income.**

### Step 5 — Smart Wallet

Show:

```text
Smart Wallet
Emergency   ₹37.50
Medical     ₹22.50
Growth      ₹15.00
Total       ₹75.00
```

### Step 6 — Interest

Show:

> **Applicable interest earned on eligible bank balance**

Clarify that the interest depends on the underlying partner product.

### Step 7 — Withdrawal

Demonstrate:

> **Withdraw ₹50 from Emergency Fund**

Show the updated goal balance and wallet ledger.

### Step 8 — Investment Recommendation

Show the illustrative recommendation and explain that it is based on calculated income volatility, financial behaviour, and risk preference.

### Step 9 — Switch Persona

Switch to a freelancer with a different income pattern.

Show that savings behaviour and recommendation change.

### Step 10 — Tax

Show cumulative income increasing and the tax estimate updating.

### Step 11 — Finish

> **"We don't ask gig workers to save. We identify when they can save."**

---

## 25. Key Product Features to Highlight

### Adaptive Savings

The system learns the user's own income pattern instead of applying the same saving rule to everyone.

### Automatic

The user does not have to decide every day whether they can save.

### Smart Wallet

Savings are organized into Emergency, Medical, Growth, and custom goals.

### Explainable

Every important action has a simple reason.

### Protective

During prolonged low-income periods, the system can reduce or pause automatic saving.

### Personalized

Different users receive different behaviour based on their income pattern, financial behaviour, and risk preference.

### Data-Driven

Decisions are based on actual computed income statistics rather than generic financial assumptions.

### PS-Compliant

The platform addresses micro-savings, investment recommendations, and tax-related assistance while providing a production path for AA-based financial data access.

---

## 26. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Bank transaction is mistaken for income | Use an income-classification layer and user confirmation where necessary |
| Recommendation appears generic | Pass actual computed income statistics into the LLM prompt |
| Synthetic data looks unrealistic | Generate realistic earning patterns for different gig personas |
| Savings trigger is too aggressive | Use configurable limits and safety-mode logic |
| Tax calculation is oversimplified | Clearly label it as an estimate and keep calculation deterministic |
| Scope expands into banking integration | Keep live AA/bank/UPI integration outside the hackathon MVP |
| LLM produces incorrect financial calculations | Never ask the LLM to calculate savings or tax values |
| User does not trust automatic saving | Show a clear explanation for every action and provide pause/control mechanisms |
| Confusion between app wallet and actual money custody | Clearly state that Smart Wallet is the app interface/ledger and actual funds are held by the regulated partner |
| Interest expectations are misleading | Display only applicable interest information from the underlying partner product |
| Automatic debit is implemented unsafely | Require user authorization and use only supported regulated banking/UPI mechanisms |
| Goal withdrawal is unavailable or delayed | Clearly show partner/product withdrawal rules and settlement status |
| Platform revenue is confused with customer interest | Keep customer interest and partner/platform revenue as separate accounting concepts |

---

## 27. Build Timeline — 36 Hours

| Time | Milestone |
|---|---|
| 0–4h | Project setup, PostgreSQL schema, synthetic transaction generator |
| 4–8h | Income classification and transaction processing |
| 8–12h | Rolling average, variance and volatility engine |
| 12–16h | Smart Save trigger, goal allocation and savings ledger |
| 16–20h | Smart Wallet dashboard and simulated deposit/withdrawal |
| 20–24h | LangGraph workflow and investment recommendation node |
| 24–27h | Explanation layer and Tax Assistant |
| 27–31h | Dashboard, wallet UI and income timeline |
| 31–33h | What-if simulator and multi-persona demo |
| 33–35h | Testing, polish and deployment |
| 35–36h | Final demo preparation |

---

## 28. Success Metrics

Before judging, verify that:

- The system correctly identifies income from the supplied transaction dataset.
- Savings triggers reference actual daily income and rolling average.
- Savings behaviour changes when income changes.
- Saved amounts are correctly allocated across goals.
- Smart Wallet balance and goal balances remain consistent.
- Manual deposit flow works in the prototype.
- Automatic saving requires an enabled user authorization setting.
- Automatic saving can be paused.
- Goal withdrawal works in the prototype.
- Applicable interest is displayed as an underlying partner-product benefit rather than a universal guaranteed rate.
- Different personas produce different income patterns.
- Investment recommendations change according to volatility, financial behaviour, and risk inputs.
- Explanations reference actual computed statistics.
- Tax estimates update when cumulative income changes.
- Low-income periods can pause/reduce savings.
- The AA production architecture is clearly separated from the synthetic-data prototype.
- The complete workflow runs without manual financial calculations.
- The judge can understand the core idea within 90 seconds.

---

## 29. One-Line Pitch

> **An intelligent financial assistant that learns when a gig worker can afford to save and automatically puts a small amount aside — based on their actual income pattern, not a fixed monthly salary.**

---

## 30. Simple Explanation for Non-Technical Judges

> **"A normal employee gets a predictable salary, so saving ₹2,000 every month can be easy. A gig worker might earn ₹1,500 today and nothing tomorrow. Our platform watches their income pattern, understands what a normal earning day looks like, and when they have a particularly good day, it automatically saves a small portion of the extra income. That money is organized into goals such as Emergency, Medical, and Growth through a Smart Wallet backed by a regulated financial partner. When earnings fall, the system protects their cash by reducing or pausing savings. It also provides illustrative investment recommendations based on financial behaviour and risk preference, and helps estimate tax obligations. Every important decision is explained in simple language."**
