# Glossary

Plain-English definitions of every term you'll see in No1d Swap and these docs.

---

### Alice
The person **selling NOID** and **receiving ETH**. Alice is always the NOID side and makes the secret. Alice generates the swap secret, locks NOID first with the longer deadline (~6 h 45 min if stopped), and reveals the secret on Ethereum to claim Bob's ETH.

### Bob
The person **selling ETH** and **receiving NOID**. Bob is the side with the other coin (ETH today; more coins may come later). Bob creates the invitation first, locks ETH second with the shorter deadline (~2 h 20 min if stopped), reads Alice's revealed secret from Ethereum, and claims NOID before the Parano1d deadline.

### Check Line
A 16-digit verification code formatted as four groups of four digits (`xxxx xxxx xxxx xxxx`). Both computers derive it independently from the exact swap terms. Alice and Bob compare it over a second channel before approving so neither side can be tricked by a typo or tampered file.

### Close (Parano1d)
The transaction that terminates a Parano1d `HashTimeLock` contract and sends its locked NOID to either Bob (before deadline `D`, with a proof of knowing `s`) or Alice (at or after deadline `D`). The close fee (at least 5,800 μNOID, capped at `max_fee`) is paid from the locked NOID.

### Deadline (`D` and `T_reveal`)
The exact block height (`D` on Parano1d, ~738 blocks after Prepare) or timestamp (`T_reveal` on Ethereum, 7,200 seconds after Bob locks) after which a lock switches from claimable by the counterparty to refundable by the original sender.

### EOA (Externally Owned Account)
A normal Ethereum wallet controlled by a private key (e.g., hardware wallet or standard MetaMask account)—as opposed to a smart-contract wallet. No1d Swap requires EOAs for Ethereum payout addresses.

### Finality
The point at which a blockchain considers a block irreversible under normal operation. No1d Swap waits for finality before taking the next step: **~19 minutes** (1,140 seconds) on Ethereum and **19 blocks** (~9.5 minutes; `is_final` at 18 blocks after inclusion) on Parano1d.

### Hash-Time Lock (HTLC)
A smart contract lock with two paths: before a deadline, whoever proves knowledge of a secret `s` matching the hashlock gets the coins; after the deadline, the original sender gets them back.

### Invitation (`no1d-invitation.json` / `no1dinv1:…`)
The public swap parameters Bob sends to Alice to start a swap (network, contract, NOID amount, ETH amount, and Bob's two public addresses). Holds zero secrets. A JSON file, and since v0.1.8 also a one-line `no1dinv1:…` code with a checksum that catches a damaged paste (not a forged one: Alice still checks every filled value and the check line).

### Micro-NOID (μNOID)
The smallest unit of NOID: **1 NOID = 1,000,000 μNOID**. Parano1d close fees start at 5,800 μNOID (0.0058 NOID).

### Poseidon2b (`Addr(s)`)
Parano1d's native hash function over GF(2¹²⁸) that derives a 32-byte Parano1d address from a 32-byte secret `s`. Because `HTLCPoseidonV2` implements Poseidon2b directly on Ethereum, both chains lock on the exact same 32-byte value `A = Addr(s)` without needing an off-chain ZK equivalence proof.

### Producer Share (Miner Concentration)
The percentage of recent Parano1d blocks mined by a single address over the last **24 hours (2,880 blocks)** and **6 hours (720 blocks)**. Checked automatically before Bob locks ETH: a warning above 35%, a loud warning above 50%, "unknown" if unreadable. It never blocks.

### Recovery Code
The paper backup code displayed on first launch. Combined with a swap's run folder (`runs/<swap-id>/`), it lets you derive the swap passphrase offline and finish or recover a swap directly with `swap-cli` if the desktop app won't start.

### Reveal
The Ethereum transaction in which Alice calls `HTLCPoseidonV2.claim(lockId, s)`, collecting Bob's ETH and publishing the secret `s` on-chain in the `Claimed` event so Bob's app can read it and claim the NOID.

### Reveal Cutoff (`M_A`)
The **30-minute safety buffer** before `T_reveal` during which Alice's app refuses to broadcast a reveal. Prevents Alice from publishing `s` so late that Bob refunds his ETH while still learning `s`.

### Run Folder
The private directory storing a swap's state and sealed files (`~/Library/Application Support/No1d Swap/runs/<swap-id>` on macOS, `%LOCALAPPDATA%\No1d Swap\runs\<swap-id>` on Windows). Never deleted when you uninstall the app.

### Sweep
The automatic final transaction that moves any leftover change or unused gas out of a swap's temporary wallets back into your own payout addresses once the swap ends.

### Swap Copy / Public Bundle (`alice.bundle.json`)
The public file Alice saves after pressing **Prepare** and sends to Bob. Contains the hashlock, contract parameters, and public terms (zero secrets) so Bob's app can independently verify everything and compute the matching 16-digit check line.
