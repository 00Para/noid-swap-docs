# For Auditors & Cryptographers

No1d Swap has undergone extensive internal adversarial reviews—seven code reviews of `swap-cli`, two reviews of the Solidity `Poseidon2b` port, a protocol design review, an explicit-state model check, and a seeded chaos test—**but zero independent external audits yet.**

If you are a security researcher, smart-contract auditor, or cryptographer looking to break No1d Swap, this page points you straight to the highest-impact attack surface.

---

## The Four Questions That Matter Most

In order of what rests on them (from `docs/review-packet.md`):

### 1. Preimage Resistance of `Addr(s)` as a Cross-Chain Hashlock
* **The assumption:** Both `htlc.pruv` (Parano1d) and `HTLCPoseidonV2.sol` (Ethereum) lock funds on `A = Addr(s)`, which is a single **Poseidon2b** permutation over GF(2¹²⁸) using the designers' reference constants.
* **What breaks if it fails:** Anyone who can find any `s'` with `Addr(s') = A` can steal locked funds on both chains.
* **Where to look:**
  * `docs/parano1d-capabilities.md` §10 (exact `Addr` definition & test vectors)
  * `vendor/parano1d/noid_poseidon2b/src/native/permutation.rs`
  * `eth/contracts/Poseidon2b.sol` & `eth/contracts/HTLCPoseidonV2.sol`

### 2. Mempool Pinning & Claim Stalling on Parano1d
* **The concern:** Parano1d's mempool is first-seen per input with no replace-by-fee. Anyone who knows `s` (Alice from the start, everyone after reveal) can broadcast a minimum-fee close first.
* **What to check:** Is the 144-block epoch budget enough under network congestion, and does the fixed-fee contract variant (`parano1d/contracts/htlc_v2.pruv`, requiring `fee == max_fee`) cleanly eliminate the attack?
* **Where to look:**
  * `docs/review-1.md` (R1)
  * `docs/htlc-v2-fixed-fee.md`
  * `parano1d/contracts/htlc.pruv` and `parano1d/contracts/htlc_v2.pruv`

### 3. Timeout Inequalities Under Reorgs & Fast Blocks
* **The concern:** Are the timeout margins (`I1`, `I2`, `B_final = 19`, `D_offset = 738`, `W_A = 7,200 s`, `M_A = 1,800 s`, `bobOnlineMin = 75 min`) sound under adverse block timing, reorgs, and producer concentration below 50%?
* **Where to look:**
  * `docs/protocol-design.md` §1, §2.2, §4.2, §8, §9.1
  * `swap-cli/src/params.rs` (`Gates::validate` and profile constants)
  * `docs/formal/README.md`, `docs/formal/model.py`, `docs/formal/t21_race.py`
  * `docs/miner-concentration.md` and `docs/bob-concentration-gate.md`

### 4. Live Mainnet Surface vs. Experimental Code
Focus your review on the **live mainnet swap surface** first (everything else is quarantined / test-only):

| Live Mainnet Surface | Role |
|---|---|
| `eth/contracts/HTLCPoseidonV2.sol`, `eth/contracts/Poseidon2b.sol` | Mainnet ETH HTLC (stack-only Yul Poseidon2b, pinned runtime code hash) |
| `parano1d/contracts/htlc.pruv`, `parano1d/harness/` | Parano1d HTLC definition, opening builder, prover/verifier |
| `swap-cli/` | State machine, watchers, wallet/key sealing, producer gate, claims |
| `eth/scripts/live.js`, `eth/scripts/bounded-send.js` | Ethereum transaction builder and bounded-send guard |
| `ui/app/`, `desktop/` | Hardened Electron shell, vault, update verifier, local UI |

*Not shipped on mainnet:* `btc/` (signet prototype), `equiv/` (RISC Zero equivalence prover for legacy SHA-256 locks), `eth/contracts/HTLCPoseidon.sol` (early prototype with `addrOf`), `eth/contracts/HTLC.sol`, `eth/contracts/HTLCERC20.sol`, and the Nostr offer board.

---

## Fast-Start Reading Order for Reviewers

1. `docs/review-packet.md` — single-document summary written specifically for external reviewers.
2. `docs/protocol-design.md` (§1–§4, §8) — full protocol, timeout derivations, and threat model.
3. `swap-cli/REVIEW-7.md` & `docs/poseidon-v2-review.md` — the latest internal adversarial findings and open items.
4. `docs/miner-concentration.md` — empirical block-header measurements and race model.

---

## Running the Test Suites Locally

```sh
# Node suites (Node 21+, offline)
(cd eth && npm install && npx hardhat test)
node --test "ui/app/test/*.test.js"
node --test "desktop/test/*.test.js"

# Rust suites (Linux / macOS / WSL2), from the repository root
(cd swap-cli && cargo test --offline)
(cd parano1d/harness && cargo test)
```

## Responsible Disclosure

If you find a vulnerability affecting funds, do **not** publish it in a public issue. Open a minimal issue on [00Para/noid-swap](https://github.com/00Para/noid-swap/issues) saying only `"security, please open a private channel"` (or use GitHub private vulnerability reporting if enabled). Credit is given in the fix commit unless you prefer to stay anonymous.
