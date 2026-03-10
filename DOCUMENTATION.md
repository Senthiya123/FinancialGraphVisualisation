# GoM (Game of Money) — Technical Documentation

> **Insight Wealth Planning** — Australian wealth planning quick-modelling application

---

## 1. Overview

| Aspect | Description |
|--------|-------------|
| **Name** | GoM — Game of Money |
| **Purpose** | Wealth planning quick-modelling tool for Australian financial advisers |
| **Audience** | Financial advisers and clients (Insight Wealth Planning) |
| **Architecture** | Single-page React app, client-side only (no backend or database) |
| **Deployment** | Static hosting (Vercel, Netlify, S3, etc.) |

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.7 |
| Framework | React 19 |
| Build tool | Vite 6 |
| UI libraries | Chakra UI 2, MUI 7, MUI X Charts |
| Drag & drop | react-dnd (HTML5 backend) |
| Icons | react-icons |
| Animations | framer-motion |
| Styling | Emotion, Chakra, MUI |
| Node | 20 LTS (see `.nvmrc`) |

---

## 3. Project Structure

```
gom/
├── index.html                 # Entry HTML
├── package.json
├── .nvmrc                     # Node 20 for nvm
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx               # React entry
│   ├── App.tsx
│   ├── theme.ts               # Chakra UI theme
│   ├── data/                  # State & business logic
│   │   ├── AllProviders.tsx   # Context provider nesting
│   │   ├── TimeframeContext.tsx
│   │   ├── *Context.tsx       # Savings, Insurance, Loans, Super, Portfolio
│   │   ├── *Calculations.ts   # Domain calculation logic
│   │   └── dataset.ts
│   ├── components/
│   │   ├── Dropzone.tsx       # Central drop target
│   │   ├── TokenColumn.tsx
│   │   └── atoms/             # Budget cards, slider, tokens
│   └── screens/
│       ├── GameOfMoney.tsx    # Main screen
│       ├── layout/            # Header, ContentContainer
│       └── modals/            # Projections, graphs, summaries
```

---

## 4. Core Concepts

### 4.1 Token System

| Token type | Label | Icon | Colour | Purpose |
|------------|-------|------|--------|---------|
| `insurance` | Insurance | MdOutlineGppGood | `#5ad4b6` | Insurance coverage, premiums, deductibles |
| `super` | Super/Tax | MdOutlineSavings | `#5ab8d4` | Superannuation, SCG, contributions |
| `savings` | Savings | MdOutlineMonetizationOn | `#e684d1` | Savings balance, contributions, interest |
| `loans` | Loans | MdOutlineCottage | `#d4cc5a` | Home loans, repayments, offset |
| `portfolio` | Portfolio | MdOutlineTrendingUp | `#d4a35a` | Investment portfolio, DCA, recycling |

### 4.2 User Flow

1. **Select** — User drags a token from the left column to the centre dropzone.
2. **Configure** — Modal opens with inputs, graph, and summary for that module.
3. **Compare** — User edits “Current” vs “Proposed” parameters.
4. **Visualise** — Dropzone rings and budget cards update based on values.

---

## 5. Architecture

### 5.1 Provider Hierarchy

```
ChakraProvider (theme)
└── App
    └── Header
    └── ContentContainer
        └── GameOfMoney
            └── DndProvider (react-dnd)
                └── TimeframeProvider
                    └── AllProviders
                        ├── SuperannuationProvider
                        ├── InsuranceProvider
                        ├── LoansProvider
                        ├── SavingsProvider
                        └── PortfolioProvider
```

### 5.2 State Management

| State | Location | Purpose |
|-------|----------|---------|
| `droppedTokenTypes` | `GameOfMoney` | Tokens in the dropzone |
| `showModalContent` | `GameOfMoney` | Whether projection modal is open |
| `activeToken` | `GameOfMoney` | Token being edited |
| `timeframe` | `TimeframeContext` | Planning horizon (0–60 years), default 30 |
| `inputCards` | Domain contexts | Current vs proposed input values |

---

## 6. Domain Modules

### 6.1 Savings

| Input cards | Key fields |
|-------------|------------|
| Current Savings | Current Balance, Monthly Contrib., Interest Rate, Savings Goal Progress, Time Horizon |
| Proposed Savings | New Monthly Contribution, Target Interest Rate, New Goal Progress, New Time Horizon |
| Additional Contributions | Current Contributions, Proposed Contributions |

**Calculations:** `calculateProjectedSavings`, `calculateTimeToGoal`, `generateSavingsDataset`, `calculateGoalProgress`

> **See §15** for detailed input-to-graph behaviour (which fields affect the graph and which do not).

### 6.2 Insurance

| Input cards | Key fields |
|-------------|------------|
| Current | Annual Premium, Coverage Amount, Premium Increase, Deductible, Claim Probability, Additional Riders |
| Proposed | Coverage Amount, Annual Premium, Deductible, Additional Riders, Premium Discount |

**Calculations:** `calculateOutOfPocketDifference`, `calculateMonthlyCostDifference`, `generateInsuranceDataset`

### 6.3 Loans

| Input cards | Key fields |
|-------------|------------|
| Current Loans | Loan Amount, Interest Rate, Loan Term, Monthly Repayment, Offset Account Balance |
| Proposed Loans | Same structure |

**Calculations:** `calculateInterestSaved`, `calculateProjectedLoans`, `calculateMonthlyRepaymentChange`, `calculateLoanTermChange`

### 6.4 Superannuation

| Input cards | Key fields |
|-------------|------------|
| Current | Salary, SCG, Pay Increase, Balance, Return, Conc Contribution |
| Proposed | Return, Conc Contribution, Non Conc Contrib, Catch Up Conc. Con., Gov Contribution |

**Calculations:** `calculateProjectedBalance`, `calculateWeeklyCost`, `calculateAnnualIncome`, `generateRealDataset`

### 6.5 Portfolio

| Input cards | Key fields |
|-------------|------------|
| Own Funds | Lump Sum, DCA Monthly |
| Borrowed Funds | Lump Sum, DCA Monthly, Current Loan to Value Ratio |
| Superannuation Recycling | Annual Concessional Contribution, Recycling Allocation from Super |

**Calculations:** `calculateProjectedPortfolioValue`, `calculateMonthlyInvestmentDifference`, `generatePortfolioGrowthDataset`

---

## 7. Input Card Format

All contexts use a shared input structure:

```typescript
interface InputCardData {
  name: string;
  variant?: string;
  bg: string;
  inputs: Array<Array<{
    field: string;   // "symbol,Label" e.g. "$,Current Balance"
    value: number;
    defaultValue: number;
  }>>;
  showCheckbox?: boolean;
  applyMaxSCG?: boolean;    // Super only
  applyMaxCoverage?: boolean; // Insurance only
}
```

`field` format: `"symbol,Label"` — split to get prefix symbol and label for `InputField`.

---

## 8. Dropzone Logic

| Concept | Description |
|---------|-------------|
| Current value | `Math.floor(2979954 / 30) * timeframe` (fixed) |
| Proposed value | Sum of values from dropped tokens |
| Token values | From domain calculations (e.g. `calculateProjectedBalance`, `calculateInterestSaved`) |
| Ring width | Proportional to token value; min 8px, max 50px |
| Token layout | Dropped tokens arranged in a circle around the centre |

---

## 9. Budget Cards

| Card | Behaviour |
|------|-----------|
| **Estimated Budget** | Static/estimated weekly budget |
| **Proposed Budget** | Uses Super weekly cost, Portfolio monthly difference, Insurance monthly difference, plus fees; only visible when tokens are dropped |

---

## 10. Modal Layout

Each projection modal uses:

| Section | Component | Purpose |
|---------|-----------|---------|
| Header | `ModalHeader` | Module title and close |
| Inputs | `ModalInputs` → `InputCard` → `InputField` | Current vs proposed inputs |
| Graph | `*BarGraph` (domain-specific) | Projections over years |
| Summary | `*Summary` (domain-specific) | Metrics, SAVE/CANCEL |

---

## 11. Key Files Reference

| File | Responsibility |
|------|----------------|
| `main.tsx` | Chakra provider, root render |
| `App.tsx` | Header + ContentContainer + GameOfMoney |
| `GameOfMoney.tsx` | Layout, token state, modal routing |
| `Dropzone.tsx` | Drop target, value aggregation, rings, dropped tokens |
| `TokenColumn.tsx` | Left column with draggable tokens |
| `ModalLayout.tsx` | Shared modal structure |
| `*Projections.tsx` | Per-domain modal (wraps provider + ModalLayout) |

---

## 12. NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Development server |
| `build` | `tsc -b && vite build` | Type-check and build |
| `lint` | `eslint .` | Lint |
| `preview` | `vite preview` | Preview production build |

---

## 13. Australian Context

- Currency: AUD
- Superannuation terms: concessional / non-concessional contributions, SCG
- Number format: `Intl.NumberFormat('en-AU', { currency: 'AUD' })`
- Examples: offset accounts, loan terms, typical rates

---

## 14. Known Notes

| Item | Detail |
|------|--------|
| Hardcoded names | "Charles", "Charles Davies", "Tabitha Tworek" |
| Modal default | `showModalContent` initialised as `true` (TODO: revert to `false`) |
| Persistence | `saveInputs` logs only; no `localStorage` or backend |
| Dropzone current | Fixed formula `2979954 / 30 * timeframe` |
| Header tabs | "Foundations" and "Goals" — present but non-functional |

> **See §16** for a full list of non-functional UI elements.

---

## 15. Savings Projection — Input-to-Graph Behaviour

This section documents how each Savings input field affects (or does not affect) the bar graph in the Savings Projection modal. Observed behaviour is based on the implementation in `SavingsBarGraph.tsx` → `generateSavingsDataset()`.

### 15.1 Graph Overview

The Savings bar graph displays:
- **X-axis:** Years (0 to `timeframe`)
- **Y-axis:** Balance ($)
- **Series:** Current Situation, Proposed Interest, Proposed Contributions
- **Timeframe source:** The graph uses the **global timeframe** from the main TimeframeSlider (0–60 years), **not** the "Time Horizon" or "New Time Horizon" fields in the Savings inputs.

---

### 15.2 Current Savings → Graph Impact

| Field | Affects graph? | How |
|-------|----------------|-----|
| **Current Balance** | ✅ Yes | Initial balance for both current and proposed curves; changes starting point |
| **Monthly Contrib.** | ✅ Yes | Drives the "Current Situation" line (monthly contributions + compounding) |
| **Interest Rate** | ✅ Yes | Drives the "Current Situation" line (compounding factor) |
| **Savings Goal Progress** | ❌ No | Not used by `generateSavingsDataset`; only read by `calculateGoalProgress` for the Summary bar |
| **Time Horizon** | ❌ No | Graph uses global `TimeframeContext`, not this field; value is stored but ignored for the graph |

---

### 15.3 Proposed Savings → Graph Impact

| Field | Affects graph? | How |
|-------|----------------|-----|
| **New Monthly Contribution** | ✅ Yes | Drives the proposed series (contributions + interest); if 0, proposed bars are hidden |
| **Target Interest Rate** | ✅ Yes | Drives the proposed series (compounding factor) |
| **New Goal Progress** | ❌ No | Not used by `generateSavingsDataset`; only in Summary bar |
| **New Time Horizon** | ❌ No | Graph uses global timeframe; this field has no effect on the graph |

---

### 15.4 Additional Contributions Card

| Field | Affects graph? | How |
|-------|----------------|-----|
| **Current Contributions** | ❌ No | Not used by `generateSavingsDataset` |
| **Proposed Contributions** | ❌ No | Not used by `generateSavingsDataset` |

*Used by `calculateAnnualContributions`; not wired into the bar graph.*

---

### 15.5 Data Flow Summary

```
SavingsBarGraph
    └── timeframe: from TimeframeContext (main slider), NOT from input cards
    └── dataset: generateSavingsDataset(inputCards, timeframe)

generateSavingsDataset uses:
    Current card:   Current Balance, Monthly Contrib., Interest Rate
    Proposed card:  New Monthly Contribution, Target Interest Rate

generateSavingsDataset does NOT use:
    Current card:   Savings Goal Progress, Time Horizon
    Proposed card:  New Goal Progress, New Time Horizon
    Additional:     Current Contributions, Proposed Contributions
```

---

### 15.6 Summary Bar vs Graph

| Output | Source | Inputs used |
|--------|--------|------------|
| **Bar graph** | `generateSavingsDataset` | Current Balance, Monthly Contrib., Interest Rate; New Monthly Contribution, Target Interest Rate; global timeframe |
| **Time to goal** | `calculateTimeToGoal` | Same 5 graph inputs + hardcoded `goalAmount = 50000` |
| **Goal progress** | `calculateGoalProgress` | Savings Goal Progress, New Goal Progress (display only) |
| **Monthly difference** | `calculateMonthlySavingsDifference` | Monthly Contrib., New Monthly Contribution |

---

### 15.7 Known Gaps (Observed Behaviour)

| Behaviour | Detail |
|-----------|--------|
| Time Horizon / New Time Horizon | Displayed but ignored by graph; graph always uses main slider |
| Savings Goal Progress / New Goal Progress | Displayed but not visualised; only used in Summary metrics |
| Goal amount for "Time to goal" | Hardcoded as $50,000 in `SavingsSummary.tsx`; not configurable from inputs |
| Additional Contributions | Stored but not used by graph or core projections |

---

## 16. Non-Functional UI

UI elements that are present but do not affect behaviour, have no effect on calculations/graphs, or are placeholders.

| Location | Element | Issue |
|----------|---------|------|
| **Header** | Foundations tab | No `onChange` or routing; click does nothing except visual focus |
| **Header** | Goals tab | Same as above |
| **Header** | Log out menu item | No `onClick`; does not log out or redirect |
| **Superannuation modal** | “Apply SCG maximum amount” checkbox | Toggles `applyMaxSCG` in state; value is never read by `SuperannuationCalculations.ts`, `SuperBarGraph`, or `SuperSummary` |
| **Insurance modal** | “Apply SCG maximum amount” checkbox | Uses same `InputCard`; label is incorrect for Insurance (SCG is super). Insurance stores `applyMaxCoverage` but `InputCard` reads `applyMaxSCG`, so checkbox never appears checked. `applyMaxCoverage` is never used in calculations |
| **All projection modals** | SAVE button | Calls `saveInputs()` which only `console.log`s; no `localStorage`, backend, or persistence |
| **Savings modal** | Savings Goal Progress field | Editable but does not affect bar graph |
| **Savings modal** | Time Horizon field | Editable but graph uses global TimeframeSlider; this value is ignored |
| **Savings modal** | New Goal Progress field | Same as above |
| **Savings modal** | New Time Horizon field | Same as above |
| **Savings modal** | Additional Contributions card | Both fields stored but not used by `generateSavingsDataset` or bar graph |
| **Savings summary** | Time to goal | Uses hardcoded `goalAmount = 50000`; not configurable from inputs |
| **Dropzone** | Current value | Fixed formula `2979954 / 30 * timeframe`; not derived from user inputs |

### 16.1 Checkbox Implementation Note

`InputCard` hardcodes:

- Label: `"Apply SCG maximum amount"` (Superannuation term; incorrect for Insurance)
- Checked state: `card.applyMaxSCG`

Superannuation defines `applyMaxSCG`; Insurance defines `applyMaxCoverage`. As a result, the Insurance checkbox never displays as checked and has the wrong label. Neither checkbox value is used in calculations.

### 16.2 SAVE Button Behaviour

`saveInputs()` in all contexts only logs to the console. State remains in React memory for the session; there is no persistence. SAVE effectively just closes the modal.

### 16.3 Input Fields With No Graph Impact

For Savings, see §15. Other modules may have similar fields; this list should be extended as discovered.

---

## 17. Adding a New Module

1. Add token type to `TokenType` in `Token.tsx`.
2. Define token style in `tokenStyles`.
3. Create `*Context.tsx` and `*Calculations.ts` in `data/`.
4. Add provider to `AllProviders.tsx`.
5. Create `*Projections.tsx`, `*BarGraph.tsx`, `*Summary.tsx` in `screens/modals/`.
6. Wire token into `GameOfMoney`, `Dropzone`, `TokenColumn`, and `ProposedBudgetCard` if used in budget.
