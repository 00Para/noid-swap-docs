# Back Up & Restore a Swap

{% hint style="info" %}
**New in 0.2.0.** Version 0.1.8 and earlier have no backup file: for those, keep your paper recovery code and a copy of the swap's run folder, as described in [Emergency Recovery](recovery-and-second-computer.md). A restore was rehearsed on the Sepolia test network on two computers; the fixes made after that rehearsal are tested offline only.
{% endhint %}

If your computer dies in the middle of a swap, the swap does not have to die with it. No1d Swap can save **one sealed backup file per swap**, and bring the swap back on another computer with that file and your **recovery code**.

**Bottom line:**
* The backup is a file that ends in **`.no1dbackup`**. It opens only with your paper recovery code, so it can sit on a USB stick or in a cloud folder.
* The program requires a backup **before you approve** a swap, and keeps the file up to date by itself while the swap moves on.
* A restored swap **never inherits an approval**. You approve it again, and you confirm that you will run it on **one computer only**.
* A backup brings the swap back; it does not run the swap while your computer is off.

---

## 1. What the Backup Is (and Is Not)

A **sealed** file is one that is scrambled with a key so that nobody can read it without that key. Here the key comes from your **recovery code** (the one you wrote on paper at first launch, see [First Launch](../getting-started/first-launch-and-recovery.md)). Without the code, the file cannot be opened.

The file holds the files of that one swap: the swap file (which already carries the swap's secret, sealed a second time), the swap's settings, its wallet and key files (sealed), the records of what was sent, the check line records, and the swap's audit log. It never holds your approval, caches or lock files.

{% hint style="danger" %}
**Keep the recovery code on paper, never next to the backup file.** Anyone who has both can take that swap's coins.
{% endhint %}

Not backed up: **practice swaps** (they have nothing to lose) and swaps made with the offer board (a private test board, not part of mainnet use). The program refuses both.

---

## 2. Save a Backup

Once a swap is prepared (Alice) or joined (Bob), its page shows a **"Save a backup of this swap"** box:

1. Leave **"Keep this file up to date"** ticked (it is ticked by default). The box says: "The program updates the file by itself whenever the swap moves on." Untick it only if you want to save by hand: the program then never rewrites the file by itself, and once the swap moves on the status line turns to "Backup is older than the swap." (see below) until you click **Update backup**. You make this choice once, when you first save: the box is not shown again afterwards.
2. Click **Save a backup**. A save dialog titled **"Save a backup of this swap"** opens. The suggested name is `no1d-swap-backup-` plus the first 8 characters of the swap's id, ending in `.no1dbackup`.
3. Choose a folder **outside** No1d Swap's own data folder (a USB stick or a synced cloud folder is the point). Inside the data folder the program refuses: "Choose a folder outside No1d Swap's data folder."

### Required before you approve

On every network (Ethereum mainnet and Sepolia), the program **refuses your approval** until a backup exists: "Save a backup of this swap first. It takes a few seconds." This applies only while your coins-in step is still ahead (Alice's funding, Bob's ETH lock). After the coins are in, a missing backup never blocks anything.

A swap you approved **before** 0.2.0 keeps its approval. It shows a note instead: "This swap was approved before backups were required. Save a backup so you can recover it if this computer stops."

### The status line

| You see | It means | Buttons |
|---|---|---|
| **Backup up to date, saved 14:03.** | The file matches the swap (the time is your computer's clock). | **Save elsewhere…** |
| **Backup is older than the swap.** | The file is behind and nothing is writing it now (for example because you unticked "Keep this file up to date"). | **Update backup**, **Save elsewhere…** |
| **Could not update your backup: the folder is not there (a USB stick taken out?).** | The last automatic write failed. The swap itself is not stopped or delayed. | **Try again**, **Save elsewhere…** |
| **This swap is over. You can delete its backup file.** | The swap ended and its leftover sweeps are recorded (Alice: NOID and ETH; Bob: ETH). | none |

With "Keep this file up to date" on, the program rewrites the file in the background, at most about once a minute. A new record of something the swap just sent skips that wait. With it off, nothing is rewritten by itself: the file stays as saved, so click **Update backup** after the swap moves on, especially before the steps where coins go in or out. **Update backup** rewrites the same file with no dialog; **Save elsewhere…** opens the dialog again and keeps your choice of the tick box.

---

## 3. Restore a Swap on Another Computer

You need: the `.no1dbackup` file, your **recovery code**, and No1d Swap installed on the new computer. Have your Parano1d node running there too, and be online: the restore reads the Ethereum side as well.

1. Open **Restore a swap…** from the app menu. (It is also in the page's own menu, and the first-start guide has a button **"I have a backup from another computer"**.)
2. On the **Restore a swap** screen click **Choose backup file…** and pick the file in the dialog **"Choose a swap backup"**.
3. **Only if the backup came from another installation** (the usual case after a crash), a private window **"Open a swap backup"** asks for the recovery code of the computer the backup came from: 14 groups of 4 characters. Click **Continue**. A wrong code gives: "This code does not open this backup. Check each group and try again." If this installation already opened the file's own key (a lost run folder on the same computer), no code is asked.
4. A fresh install made its own new code at first start. The window **"Use this recovery code?"** then says: "This computer will use the code you just typed from now on. The code it showed you earlier is no longer needed." Click **Use this code**. One code then covers everything again, older backups included.
5. The screen says **"Reading backup and checking both chains…"**. The program opens the file, checks the swap file and its sealed keys offline, and then does one read-only check of both chains (the Parano1d node and the Ethereum endpoint; it gives up after 60 seconds). It sends and records nothing in this check. **Nothing is written to your swaps until all of that passes.**
6. **Restored** appears. Click **Open this swap**.

On a fresh install, this computer takes over the backup's recovery code in step 4, before the checks of step 5. If a check then fails, no swap is written, the code stays, and a retry opens the same file without asking for the code again.

If your node is on another port or address on this computer, open **"Parano1d node addresses on this computer (optional)"** and enter it before choosing the file. Leave it blank to use the address stored in the backup. On Ethereum mainnet, Bob's node must be a local address (for example `http://127.0.0.1:9601`; `[::1]` also works).

### What the program refuses

| Message | Why |
|---|---|
| This is not a No1d Swap backup. | Not a backup file. |
| This file is damaged. Try another copy. | The file is cut, changed or too large. |
| This backup was made by a newer version of No1d Swap. Update the program first. | The new computer runs an older program. |
| This swap is already on this computer. | A folder for this swap exists here (also an ended one). |
| This computer already has swaps of its own, under another recovery code. Finish them first, or restore in a fresh user account on this computer. | Switching to the backup's code would lock you out of those swaps. |
| Board swaps cannot be restored in this version. | The offer board is test-only. |
| No1d Swap cannot reach the Parano1d node this swap uses (…). Start it, then press **Try again**. | The Parano1d node could not be read. Nothing was written; start the node and retry. The (…) is the node's address and port. |
| No1d Swap cannot reach the Ethereum node this swap uses (…). Start it, then press **Try again**. | The Ethereum endpoint could not be read. Nothing was written; check your connection and retry. |
| No1d Swap could not read the chains this swap uses (…). Check the node settings and your connection, then press **Try again**. | The read failed for another reason (for example it took longer than 60 seconds). The (…) is a short reason. Nothing was written. Here the button keeps its name **Choose backup file…**: click it to try again (open the node addresses box first if a node address must change). |

---

## 4. What a Restored Swap Does

**It starts with no approval.** Until you approve, it only **reads** the chains. Look at the swap's deadlines and approve promptly. Nothing is sent before that.

The new approval has the usual statements and the typed amount, plus one more:

> "My old computer is off, or I turned this swap's autopilot off there. I will not run this swap on two computers."

The new computer has not saved a backup yet, so the "save a backup first" rule above applies again if your coins-in step is still ahead. The restore screen reminds you: "Save a new backup now: the old file stays valid, but this computer has not saved one yet."

Then the swap goes on from what the chains show, not from what the backup remembers. An older backup means, at most, more waiting and sometimes a repeated fee. Specifics:

* **Backup from before your coins went in, coins already on chain:** if your old computer sent your funding (Alice) or your ETH lock (Bob) after the backup was saved, the restored copy reads it from the chains. After you approve it again, it carries on by itself and never asks for the deposit again: the card and the deposit box say "Do not deposit again".
* **Alice, before her funding:** the program waits about 5 minutes (10 Parano1d blocks): "Waiting about 5 minutes before your funding, to make sure your old computer did not already send it." If the swap wallet holds enough for **two** fundings, the restored copy refuses to fund: "Your swap wallet holds enough for two fundings, so this restored copy will not fund: the swap lapses, the NOID come back by the sweep."
* **Bob, before his lock:** the program first runs a quick check that this computer can prove a NOID claim: "This restored swap needs a quick check that this computer can prove a NOID claim before locking ETH." If the check fails, the page says so and tells you to move the swap to another computer before the deadline. After his lock the check only warns; it never holds back his claim.
* **Backup from before Alice's reveal, reveal time already past:** the page says the program can only see a reveal your old computer sent just before it stopped once that reveal shows on a chain, and that it is watching. A restored copy never reveals late.
* **A reveal sent but not yet in a block:** if the swap's Ethereum key has a send waiting at its very first transaction (nonce 0), the page warns "Stuck reveal". The autopilot never re-sends by itself; you re-send from the box on the card at a higher fee cap.

The new checks pause only the two steps where coins go **in** (Alice's funding, Bob's ETH lock). A claim, a refund, a recovery or a sweep is never held back by a restore, a missing backup or the producer screen.

After you approve, a line under the card's status sentence shows the deadline that matters now and "keep the program open"; it never says the program may be closed (see [Overview](../swap-guide/overview-and-checklist.md)).

---

## 5. If Two Computers Run the Same Swap

The program **cannot tell** the old computer anything: only the chains connect the two. If your old computer starts again with its approval still on, both copies hold the same keys. Open No1d Swap on the old computer and **turn the swap's autopilot off**; better, keep it off until the swap is over.

What the chains and the program do to limit the damage (built and tested offline against simulated chains and a local test chain):

| Step | If both copies send it |
|---|---|
| Alice's funding | Parano1d accepts the first payment that spends a coin and refuses a second one on the same coin. With enough for two, two contracts could be funded; the restore rules above are there to prevent that, and a swap with more than one funded contract stops. |
| Bob's lock | Both copies use one Ethereum key, so only one lock can carry its first transaction number. A second lock is refused when the key has already sent something, or has a send pending, or the lock is already on chain. |
| Alice's reveal, Bob's claim, both refunds, the sweeps | Each pays a fixed payee. At most one lands; the other costs a fee. |

---

## 6. If the Program Will Not Start

A `.no1dbackup` file can also be opened by hand, with the recovery code, into a **new** folder (the tool refuses an existing folder and reads the code from standard input only):

```sh
node "$REPO/desktop/tools/recovery.js" backup-open /path/to/swap.no1dbackup /path/to/opened-run
```

Then continue with the steps in [Emergency Recovery](recovery-and-second-computer.md), Part 1.

`$REPO` is a local copy of the noid-swap repository; the tool needs Node.js 21 or later. Run the command, paste the 14-group recovery code, press Enter, then end the input (Ctrl-D on macOS and Linux; Ctrl-Z, then Enter, on Windows). Never pass the code as an argument.

---

## Next Step

Not sure how a swap flows? Run a [Practice Swap](../getting-started/practice-swap.md) first. Practice swaps draw no backup controls.
