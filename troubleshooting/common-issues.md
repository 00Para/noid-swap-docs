# "Something Needs a Look" Playbook

No1d Swap is built to **fail closed**: whenever a node disagrees, a balance looks short, or a safety rule triggers, the app pauses and shows **"Something needs a look"** instead of guessing. That is normal and protects your coins.

Find the message you see below and follow the exact steps.

---

## 1. Miner Concentration Above 65% (Bob Cannot Approve)

**What happened:** Parano1d's block headers show a single mining address produced more than **65%** of blocks over the last 24 hours (2,880 blocks) or 6 hours (720 blocks).

**What to do:**
* Nothing is broken and no coins were locked.
* This hard block **cannot be overridden**.
* Wait until block production spreads out and both windows drop back to **65% or lower**—the approval screen reopens automatically.

---

## 2. Short Deposit Flagged

**What happened:** You sent slightly less NOID or ETH to the swap's deposit address than required (usually because wallet fees or the gas buffer weren't included).

**What to do:**
* Look at the exact shortfall amount shown on the swap card.
* Send **only the missing difference** to the same swap deposit address shown on screen.
* Within ~15–60 seconds of the top-up block, the app automatically picks up the full balance and continues.

---

## 3. Stuck Reveal or Stuck ETH Refund (Gas Spike)

**What happened:** Ethereum base fees rose above the fee cap you set (default **1 gwei**), so your reveal or ETH refund transaction is sitting unconfirmed in the mempool.

**What to do:**
* Do **not** restart or delete the swap.
* Use the card's **re-send at a higher fee cap** action to replace the stuck transaction with a higher max fee.
* **For Alice:** Check the clock carefully—your app automatically refuses to reveal in the last **30 minutes** before Bob's refund opens. If you bump the fee before the cutoff, the replacement goes out immediately.

---

## 4. "Ended Before It Started" (or Held Coins in an Unstarted Swap)

**What happened:** The funding or lock deadline passed before either side locked on-chain.

* **If the swap wallets hold zero balance:** The app automatically moves the swap under **Ended** as *"Ended before it started."* Nothing was sent and nothing is needed from you.
* **If you already sent coins to the swap wallet before it expired:** The app **never** quietly hides a swap that holds funds. It stays active with **Needs you**, displays **"Held by this swap"** under **Details**, and shows **"Do not send anything here"** + **"Read the wallet again."** Let the app record the abort and sweep your coins back to your payout address.

---

## 5. Stale Node Reading or Two Nodes Disagree

**What happened:** Your local Parano1d node (`127.0.0.1:9601`) fell behind, disconnected, or your two configured nodes reported different block tips, timestamps, or lock states.

**What to do:**
1. Open the **Parano1d wallet app** and confirm it is running and synced to the latest block.
2. Check your internet connection and Ethereum RPC endpoints in **Settings**.
3. Wait for two clean, fresh readings—the app resumes automatically once both nodes agree.
4. **Never ignore a node-disagreement alarm on a live swap**—if your primary and secondary nodes genuinely disagree on a block hash or producer, stop and check chain explorers/peers before locking.

---

## 6. Bob's Late-Claim Alarm

**What happened:** Alice has already revealed `s` on Ethereum, and the remaining time before Parano1d deadline `D - 19` is getting short.

**What to do immediately:**
1. Make sure your **Parano1d wallet app** is open, synced, and responding on `127.0.0.1:9601`.
2. Keep your computer plugged in and online—your app will broadcast the NOID close automatically as soon as it can reach a synced node.
3. If this computer **cannot** sync or reach Parano1d in time, **immediately use a second computer** to broadcast Bob's close. See [Emergency Recovery & Second-Computer Close](recovery-and-second-computer.md).

---

## 7. Leftover Sweep Waiting / Delayed

**What happened:** The main swap settled, or aborted cleanly, and one side's leftover sweep (e.g., NOID dust or remaining ETH gas) hasn't gone out yet.

**What to do:**
* If the swap wallet had no coin larger than the sweep fee (~0.0058 NOID or 21,000 gas), there may simply be nothing worth sweeping left—the app retries on a 5-minute timer while letting the other chain's sweep finish immediately.
* Check the balances under **Details**. Once the main payout arrived in your own address, your swap coins are safe.

---

## 8. "This Swap Cannot End by Itself" (Prepared Intent Never Sent)

**What happened:** Rarely, a swap records an intent to fund or lock right before a crash or interruption, and the app cannot prove on its own whether that transaction was ever sent.

**What to do:**
* Your coins are safe inside the swap's own wallet.
* Follow the **Cancel a Never-Sent Intent** procedure in [Emergency Recovery & Second-Computer Close](recovery-and-second-computer.md).

---

## 9. "This Installation Is Damaged: Reinstall It."

**What happened:** At startup, the packaged app's runtime manifest check failed (corrupted disk, antivirus quarantine of a runtime binary, or tampered install).

**What to do:**
1. **Do not delete your data folder** (`runs/` is separate from the app install folder and is never deleted by uninstalling).
2. Re-download and **verify** the installer using [Download & Verify the Installer](../getting-started/install-and-verify.md), then reinstall.
3. If you have an urgent active swap and cannot reinstall immediately, use your paper recovery code + `swap-cli` via [Emergency Recovery & Second-Computer Close](recovery-and-second-computer.md).

---

## 10. "Not an Invitation of This Program, or It Is Damaged"

**What happened:** You are Alice and pasted Bob's invitation code (or opened his file), and the app refused it. The words are: *"That file is not an invitation of this program, or it is damaged. Nothing was filled."* The code's checksum caught a cut-off, changed or mistyped paste, or the text is not an invitation at all.

**What to do:**
* Nothing was filled in and nothing is at risk.
* Ask Bob to press **Copy invitation code** again and paste the whole line (it starts with `no1dinv1:`). Spaces or line breaks around it are fine.
* If it keeps failing, ask Bob to send the invitation as a file instead (**Save an invitation for Alice…**) and use **Open Bob's invitation…**.
* Related refusals: *"too large to be an invitation"*, an invitation for a network the program does not use (Sepolia or Ethereum mainnet only), or amounts above the program's limit for that network. Ask Bob to create the swap again within the limits.
* The checksum only catches damage, not a forged invitation. Always read every filled value and compare the check line with Bob on a second channel.
