# Emergency Recovery & Second-Computer Close

Even if the desktop app crashes, refuses to open, or gets uninstalled mid-swap, **your coins are never trapped inside the UI.** Everything lives in standard swap files inside your data folder and can be finished with `swap-cli` alone.

---

## Part 1: Open a Swap by Hand (With Your Recovery Code)

Use this procedure if the No1d Swap desktop app will not start and you need to finish a refund, claim, or sweep directly with `swap-cli`.

### What You Need
1. Your **paper recovery code** (shown on first launch).
2. The swap's complete **run folder** (`runs/<swap-id>/`):
   * **macOS:** `~/Library/Application Support/No1d Swap/runs/<swap-id>`
   * **Windows:** `%LOCALAPPDATA%\No1d Swap\runs\<swap-id>`
   *(Uninstalling No1d Swap never deletes this folder.)*
3. **`swap-cli`:** either the copy shipped inside the app (`No1d Swap.app/Contents/Resources/bin/swap-cli` on macOS, `resources\bin\swap-cli.exe` on Windows) or built from source.
4. A copy of the public repository (`00Para/noid-swap`) and **Node.js 22+**.

### Derive the Swap Passphrase Safely

Run in **Terminal** (macOS) or **Git Bash** (Windows):

```sh
REPO=/path/to/noid-swap
RUN="/path/to/runs/<swap-id>"

export SWAP_PASSPHRASE="$(node "$REPO/desktop/tools/recovery.js" passphrase "$RUN")"
# Type your paper recovery code, then press Enter and Ctrl+D
# (In a native Windows console window: Ctrl+Z, then Enter)
```

{% hint style="info" %}
**Why stdin?** `recovery.js` only reads your recovery code from standard input—never from a command-line argument—so it stays out of your shell history and process list. It also checks `vault-check.json` to make sure the code matches that run folder.
{% endhint %}

Once `SWAP_PASSPHRASE` is exported in that shell, every `swap-cli` command for that swap unlocks its files automatically (see `swap-cli/README.md` for wallet and key commands). **Close the terminal window when finished** so `SWAP_PASSPHRASE` is cleared from memory.

---

## Part 2: Cancel a Never-Sent Intent

If the app warns that a swap prepared a funding or lock that was never sent and cannot end on its own:

1. **First verify on-chain** (in your Parano1d wallet app, or on Etherscan/Sepolia) that **no funding or lock transaction** for this swap was actually broadcast.
2. Open the swap in a terminal using **Part 1** above so `SWAP_PASSPHRASE` is set.
3. Run the explicit cancellation command with the same node flags your swap uses:

```sh
# For Alice:
swap-cli intent "$RUN/alice.swap.json" --cancel --i-checked-the-wallet <NODE_OPTIONS>

# For Bob:
swap-cli intent "$RUN/bob/bob.swap.json" --cancel --i-checked-the-wallet <NODE_OPTIONS>
```

4. Reopen No1d Swap. The app reads both chains again, marks the swap ended, and sweeps any funds left in the swap wallet back to your own payout address.

---

## Part 3: Close Bob's NOID Swap From a Second Computer

{% hint style="success" %}
**Trustless rescue for Bob:** Once Alice takes your ETH on Ethereum, the secret `s` is public on-chain. From that moment on, **anyone** with the public swap files can broadcast the NOID close—and the Parano1d contract forces 100% of the payout strictly to **Bob's pinned Parano1d address**. No ETH, no NOID, and no wallet key is required on the second computer (the ~0.0058 NOID close fee comes out of the locked NOID).
{% endhint %}

Use this if you are **Bob**, Alice has already revealed `s`, and your main computer is off, loses internet, or cannot sync Parano1d in time before `D - 19`.

{% hint style="warning" %}
**Shown live with the terminal tools, not yet with the desktop app.** A third-party close paid Bob's address in run 19 (`docs/live-run-19.md`), using the terminal helpers of `scripts/live/`. Nobody has yet done it from a copy of a desktop app's run folder. Read `docs/runbook-two-party.md` before you need it, not during the swap.
{% endhint %}

### What the Second Computer Needs
1. The project's terminal tools set up once with `scripts/live/setup.sh`.
2. A synced Parano1d node.
3. A copy of this swap's folder (`bob.swap.json` and Alice's public bundle `alice.bundle.json`).
   * *Privacy note:* Your Ethereum swap key inside `bob.swap.json` stays sealed without your passphrase, but keep the copied folder private and delete it from the second computer once finished.

### Steps on the Second Computer
1. Run **one tick** to read Alice's revealed secret `s` from Ethereum.
2. Run a dry-run of `claim.sh` and **verify that the recipient address printed on screen is your own Parano1d address**.
3. Broadcast the claim:

```sh
claim.sh --submit
```

### Back on Your Main Computer
1. Reopen No1d Swap and open the swap.
2. Until you record it, the swap will show **"Something needs a look"** (your NOID is already safely in your own wallet either way).
3. Click **Record a close made elsewhere**. The app verifies the close on-chain before marking the swap settled.
