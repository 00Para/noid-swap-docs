# Caps, Fees & Timelines

No1d Swap displays the exact exchange rate, estimated fees, usual duration, and worst-case refund time **before your first click**. This page collects all exact protocol constants and measured numbers from the app (`ui/app/lib/launchfacts.js` and `swap-cli/src/params.rs`).

---

## Swap Caps

| Limit | Ethereum Mainnet (`production`) | Ethereum Sepolia (`sepolia`) |
|---|---|---|
| **Maximum NOID per swap** | **2,500 NOID** | **20 NOID** |
| **Maximum ETH per swap** | **0.5 ETH** | **0.01 ETH** |
| **Minimum NOID per swap** | **5 NOID** | **5 NOID** |
| **Project / protocol fee** | **0%** | **0%** |

{% hint style="info" %}
**Why is the minimum 5 NOID?** The Parano1d HTLC enforces that a close's `max_fee` is at least **50,000 μNOID** (0.05 NOID) and at most **1%** of the locked amount. Below 5 NOID, 1% is less than 50,000 μNOID, so the app refuses smaller swaps.
{% endhint %}

Caps are enforced in **both** the desktop settings layer and the underlying `swap-cli` profile.

---

## Network Fees

You pay only blockchain network fees—No1d Swap takes no cut.

### Ethereum Gas (Measured vs. Safety Ceilings)

| Step | Who pays | Measured gas | App gas ceiling |
|---|---|---|---|
| **ETH Lock** (`newLock`) | Bob | ~583,853 | 700,000 |
| **ETH Reveal / Claim** (`claim`) | Alice | ~689,324 | 1,000,000 |
| **ETH Refund** (`refund`, abort path only) | Bob | ~158,608 | 200,000 |
| **ETH Leftover Sweep** | Alice & Bob | 21,000 | 21,000 |

* **Default fee cap:** **1 gwei** (configurable before approval; the app never broadcasts above your fee cap).
* **Stuck transactions:** If mainnet base fee spikes above your cap while a reveal or refund is waiting, the desktop card lets you **re-send at a higher fee cap** without restarting the swap.
* **Fee loudness warning:** If total estimated fees exceed **5%** of your swap value, the form highlights it loudly so you don't accidentally overpay gas on a tiny swap.

### Parano1d (NOID) Fees

1 NOID = 1,000,000 micro-NOID (μNOID).

| Step | Who pays | Typical / minimum fee | Notes |
|---|---|---|---|
| **NOID Funding** | Alice | ~9,000 μNOID (~0.009 NOID) | Paid from Alice's swap wallet on top of the locked amount |
| **NOID Close (Claim or Refund)** | Paid out of the locked NOID | ≥ 5,800 μNOID (0.0058 NOID), capped at `max_fee` (50,000 μNOID / 0.05 NOID) | Receiver gets `locked amount − close fee` |
| **NOID Leftover Sweep** | Alice | ~5,800 μNOID (0.0058 NOID) | Sweeps any change left in the swap wallet |

---

## Timelines & Safety Windows (Ethereum Mainnet)

All times below assume normal block speeds (**30 s/block** on Parano1d, **~12 s/slot** on Ethereum).

| Event / Window | Mainnet Value | Plain-English Meaning |
|---|---|---|
| **Usual total swap time** | **~50 minutes** | Measured from Alice's funding to both sides final (most of this is chain finality). |
| **Ethereum finality wait** | **~19 minutes** (1,140 s) | Both sides wait for Ethereum finality before moving to the next irreversible step. |
| **Parano1d finality wait** | **19 blocks** (~9.5 min) | Parano1d marks a block final 18 blocks after inclusion; claims must be included by `D - 19`. |
| **Parano1d deadline (`D`)** | **738 blocks** after Prepare (~6 h) | After `D`, Bob can no longer claim and Alice can recover her NOID. |
| **Alice's ETH reveal window (`W_A`)** | **7,200 seconds** (2 hours) after Bob's lock | Window during which `HTLCPoseidonV2.claim()` accepts Alice's secret. |
| **Alice's reveal safety cutoff (`M_A`)** | **30 minutes** before `T_reveal` | Alice's app refuses to reveal inside the last 30 min to avoid leaking `s` into a race with Bob's refund. |
| **Bob's guaranteed online claim window** | **At least ~75 minutes** | Time Bob has to claim NOID and reach finality after Alice reveals. |
| **Worst-case ETH refund (Bob)** | **~2 h 20 min** after Bob's lock | Includes Ethereum finality + 2-hour reveal window. |
| **Worst-case NOID refund (Alice)** | **~6 h 45 min** after Prepare | Time until Alice's NOID is back in her own wallet if Bob never locks or Alice never reveals. |

### Profile Comparison (Mainnet vs. Sepolia)

| Parameter | Mainnet (`production`) | Sepolia (`sepolia`) |
|---|---|---|
| `D` offset (Parano1d blocks) | 738 blocks (~6 h) | 302 blocks (~2.5 h) |
| ETH reveal window (`W_A`) | 7,200 s (2 h) | 4,200 s (70 min) |
| Parano1d finality (`B_final`) | 19 blocks | 19 blocks |
| Ethereum finality | 1,140 s (~19 min) | 1,140 s (~19 min) |
| Usual end-to-end time | ~50 min | ~50 min |

{% hint style="warning" %}
**Times are "at usual block speed," never "at most."** If either chain produces blocks slower than usual, refund and finality times stretch proportionally.
{% endhint %}
