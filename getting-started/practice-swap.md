# Try a 5-Minute Practice Swap

Before running a swap with real coins, walk through the built-in **Practice Swap**. You'll see the exact cards, check lines, approvals, deposits, and waiting states of a real swap—without touching any network, node, key store, or wallet.

---

## How to Open It

1. Launch **No1d Swap**.
2. Open **Practice swap** from the app menu, or press the **Practice swap** button on your list of swaps (the first-start guide offers it too).
3. Pick a role—**Alice (selling NOID)** or **Bob (selling ETH)**—and choose one of the guided scenarios.

{% hint style="success" %}
**Completely offline and isolated:** Practice Swap runs against a local script that plays both the other person and both blockchains. It needs **no Parano1d node**, **no Ethereum RPC**, **no internet**, and **no coins**, and it writes nothing to disk.
{% endhint %}

---

## What You Will Experience

Every practice screen displays a clear **Practice banner** at the top ("Practice. Nothing here is real. No coins move.") and the window title reads "Practice · No1d Swap", so you can never confuse it with a real swap. The made-up swap is 10 NOID for 0.001 ETH, so you type `10 NOID` or `0.001 ETH` at the approval. Every address and amount is intentionally synthetic—nothing looks like a real Parano1d or Ethereum address, and you'll click a **"Pretend"** deposit button instead of sending real funds.

There are three scenarios, each playable as Alice or as Bob:
1. **A swap that goes through** — from the invitation and the check lines through funding, lock, reveal, claim and the leftover sweep.
2. **The other side never locks** — Alice's NOID comes back after the deadline; Bob's swap simply never starts.
3. **Alice never reveals** — both locks, then the reveal is refused as too late, Bob's ETH is refunded and Alice takes her NOID back after the deadline.

Each wait ends after about 8 seconds (or press **Skip the wait**), and the real time of each step is shown beside it.

Try running Practice Swap **once as Alice and once as Bob**—it takes about five minutes total and makes your first real swap feel completely familiar.

---

## Safety Rule While Real Swaps Are Active

Practice Swap can never hide a real swap that needs your attention:

* If a real swap currently **Needs you**, the app **refuses to start** a new practice session until you handle it.
* If a real swap needs you *while* you're already inside a practice session, a real alarm (**"A real swap needs you"**) immediately appears above the practice banner with a one-click **"Leave the practice and open it"** button.

---

## Next Step

Ready for a real swap (or a small Sepolia rehearsal)? Head to [Swap Overview & Two-Person Checklist](../swap-guide/overview-and-checklist.md).
