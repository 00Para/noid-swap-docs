# Verify the Smart Contracts

No1d Swap never asks you to take our word on which contract holds your funds. Both the Ethereum contract and the per-swap Parano1d contract are immutable, ownerless, and independently verifiable.

---

## Live Contract Addresses

| Network | Contract | Address | Explorer / Verification |
|---|---|---|---|
| **Ethereum Mainnet** | `HTLCPoseidonV2` | `0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70` | [Etherscan](https://etherscan.io/address/0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70) · [Sourcify (exact match)](https://repo.sourcify.dev/1/0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70) |
| **Ethereum Sepolia** | `HTLCPoseidonV2` | `0x48Ce4D6cf3c175737532017e82B9261b51F8E5eF` | [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x48Ce4D6cf3c175737532017e82B9261b51F8E5eF) |
| **Parano1d Mainnet** | Per-swap `HashTimeLock` | Created fresh per swap from `parano1d/contracts/htlc.pruv` | Rebuilt byte-for-byte locally by `swap-cli` before any lock |

### Pinned Ethereum Runtime Code Hash

On **both** Ethereum Mainnet and Sepolia, the keccak-256 hash of the deployed bytecode (`eth_getCode`) is:

```text
0xf510d2a368c730339fa7cf5e023bcf2429d5732793f043e03025780bb7043ff3
```

No1d Swap compiles this hash directly into the swap tool and **refuses to lock, claim, or refund** against any contract whose on-chain bytecode produces a different hash.

---

## Properties of `HTLCPoseidonV2`

* **No owner, no admin key, no multisig.** Nobody can upgrade, pause, or touch locked ETH.
* **No protocol fee.** 100% of locked ETH goes either to Alice on `claim()` or back to Bob on `refund()`.
* **No `addrOf` view function.** Unlike the earlier `HTLCPoseidon.sol` prototype, `HTLCPoseidonV2` deliberately omits any read-only `addrOf(secret)` view so no one is tempted to send a live secret to a remote RPC node via `eth_call`.
* **Strict 68-byte calldata on `claim()`.** Trailing garbage bytes revert with `BadCalldataLength`.
* **Timelock checked before hashing.** Expired claims revert cheaply before running the Poseidon2b permutation.
* **Minimum gas guard (`MIN_CLAIM_GAS`).** Prevents half-executed reverts from burning gas unnecessarily.

---

## How to Verify the Ethereum Contract Yourself

### 1. Check Verified Source on Sourcify
Visit [repo.sourcify.dev/1/0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70](https://repo.sourcify.dev/1/0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70) and compare the verified source files byte-for-byte with:
* `eth/contracts/HTLCPoseidonV2.sol`
* `eth/contracts/Poseidon2b.sol`

in [github.com/00Para/noid-swap](https://github.com/00Para/noid-swap).

### 2. Independently Verify the Runtime Code Hash

Using Foundry's `cast` (or any Ethereum RPC + `keccak256`):

```sh
cast code 0x4e364cC86EdBF307CC6F336F3a72e1a24d284D70 --rpc-url <YOUR_MAINNET_RPC> \
  | cast keccak
```

The output **must** equal:

```text
0xf510d2a368c730339fa7cf5e023bcf2429d5732793f043e03025780bb7043ff3
```

---

## How the Parano1d Contract Works (`htlc.pruv`)

There is no shared contract address on Parano1d. Instead, every swap generates its own dedicated `HashTimeLock` contract instance from `parano1d/contracts/htlc.pruv` (which compiles to 1 of 16 instructions) parameterized with:

* `claim_authority` = `A = Addr(s)` (the 32-byte hashlock shared with Ethereum)
* `claim_recipient` = Bob's pinned Parano1d payout address
* `refund_recipient` = Alice's address in the swap terms (in the desktop app, the swap's own NOID wallet, which then sweeps to her payout address)
* `deadline` = `D` (block height)
* `max_fee` = at least `50,000 μNOID` (0.05 NOID) and at most 1% of swap amount

Before Bob locks a single wei of ETH, his app **rebuilds the exact Parano1d contract definition locally**, checks its root hash against Alice's on-chain lock, confirms `claim_recipient` is Bob's own address, and verifies the lock is final on Parano1d.

{% hint style="warning" %}
**Never fund `parano1d/contracts/htlc.params.example.json`:** That repository fixture uses the public test secret `00 01 … 1f` and exists strictly for automated testing.
{% endhint %}
