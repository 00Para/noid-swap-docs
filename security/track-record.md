# Live Track Record

We believe you should know **exactly** what has been tested on real networks versus what has only been tested offline. This page summarizes every real run recorded in `00Para/noid-swap` up to release v0.1.7.

{% hint style="warning" %}
**Honest headline:**
* **1 Ethereum mainnet swap** has settled end-to-end (Run 8: 5 NOID ↔ 0.001 ETH, using the terminal swap tools).
* **3 two-machine desktop rehearsals** (Windows + macOS installers, 4.10–4.12) have settled on **Sepolia + Parano1d mainnet**.
* **0 swaps between two separate people** have run yet, and the **desktop app's mainnet mode** has not yet completed a live mainnet run (Run 23 stopped safely before any deposit due to the Parano1d miner-concentration screen).
{% endhint %}

---

## Summary of Real Runs

### Happy-Path & Mainnet Runs

| Run | Network & Setup | Amounts | Outcome |
|---|---|---|---|
| **Runs 1–2** | Parano1d mainnet + local Hardhat | 10 NOID ↔ 0.001 ETH | Settled (Run 1) and clean mutual refund when Alice never revealed (Run 2). |
| **Runs 3–4** | Parano1d mainnet + **public Sepolia** (SHA-256 + ZK equiv) | 10 NOID ↔ 0.001 ETH | Settled in 44 min (Run 3); clean Alice NOID recovery when Bob never locked (Run 4). |
| **Runs 5–6** | Parano1d mainnet + **public Sepolia** (`poseidon`, proof-free) | 10 NOID ↔ 0.001 ETH | Settled in 47 min (Run 5); clean mutual refund after Bob's lock (Run 6). |
| **Run 8** | Parano1d mainnet + **Ethereum Mainnet** (`poseidon`, `production`) | **5 NOID ↔ 0.001 ETH** | **Settled in 54 minutes** from funding to both sides final (`docs/live-run-8.md`). |
| **Runs 9–14** | Two machines + two Parano1d nodes (Sepolia, `poseidon`) | 5 NOID ↔ 0.001 ETH | Tested accidental triple-funding recovery (Run 9), post-lock abort (Run 10), two-machine happy path (Run 11: 44 min), two-node cross-check (Run 12: 45 min), operator console (Run 13: 50 min), and finality-18 update (Run 14: 51 m 49 s). |
| **Run 22** | Swap's own NOID wallet on Parano1d mainnet + Sepolia | 5 NOID | Verified funding, recovery close after `D`, and leftover sweeps (20,700 μNOID total fees). |
| **Run 23** | Desktop app on **Ethereum Mainnet** | — | Stopped cleanly **before any deposit** by Bob's producer-concentration screen (`docs/live-run-23.md`). |

### Hostile-Counterparty Campaign (Runs 15–20, Sepolia + Parano1d Mainnet)

All six hostile scenarios were run live against real chains with one operator playing the misbehaving counterparty:

| Run | Hostile Scenario Tested | Result |
|---|---|---|
| **Run 15 (L1)** | Alice prepares and never funds | Both sides aborted cleanly on their own; zero funds sent. |
| **Run 16 (L2)** | Alice under-funds (4 NOID instead of agreed 5 NOID) | Both tools refused the under-funded instance; Bob never locked; Alice recovered her 4 NOID after `D`. |
| **Run 17 (L3)** | Bob crafts a short ETH timelock (28 min left instead of 56 min) | Alice's tool rejected the lock and refused to reveal; early refund rejected twice; both recovered cleanly. |
| **Run 18 (L4a)** | Reveal attempted 110 seconds past cutoff | Tool refused the late reveal; safely fell back to mutual refund. |
| **Run 19 (L4b)** | Third party closes the NOID contract before Bob using only public bundle + revealed `s` | Settled in 49 m 41 s; close paid **Bob's** pinned payout address (4.994200 NOID). Proved trustless second-computer rescue live. |
| **Run 20 (L5/L6)** | Second Parano1d node disconnected at lock; epoch anchor rotation right before Bob's claim | Lock refused while second node was down and succeeded once restored; claim waited across rotation and settled. |

### Desktop App Two-Machine Rehearsals (4.10–4.12)

* **Setup:** Packaged Windows installer (Alice) + macOS build (Bob), 5 NOID ↔ 0.001 Sepolia ETH, one approval per machine.
* **Result:** All three settled end-to-end (funding, lock, reveal, claim, and sweeps fully automated after single approval). Rehearsal 4.12 completed in **49 minutes** and verified real-time detection of a short ETH deposit (flagged 13 seconds after the block).

---

## Automated Test Suite Coverage (Offline)

In addition to live runs, the codebase ships with over **3,000 automated offline tests** across all components (including deterministic chaos fuzzing and an explicit-state model checker):

* `ui/app` (console & desktop UI logic): **1,800+ tests**
* `swap-cli` (Rust state machine, watchers, wallets, chaos oracle): **868+ tests**
* `desktop` (Electron hardening, vault, ACLs, self-test, updates): **623+ tests**
* `scripts/live` (shell helpers): **780 cases**
* `eth` (Hardhat contract & live-helper tests): **562 tests**
* `btc` (signet prototype, not packaged in desktop): **91 tests**
* `parano1d/harness` & `equiv` (Pruv harness & reference parity): **77 tests**

Full minute-by-minute logs for Runs 1–23 are published in `docs/live-run-*.md` in [00Para/noid-swap](https://github.com/00Para/noid-swap).
