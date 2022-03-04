import { encodeAddress, decodeAddress } from "@polkadot/keyring";
import { u8aSorted } from "@polkadot/util";
import { blake2AsU8a } from "@polkadot/util-crypto";

type Options = {
  address: string; // CSV of the addresses.
  ss58Prefix: string; // Prefix for the network encoding to use.
  index: string; // Number of addresses that are needed to approve an action.
};

const derivePubkey = (address: string, index = 0): Uint8Array => {
  const prefix = "modlpy/utilisuba";
  const payload = new Uint8Array(prefix.length + 32 + 2);
  payload.set(
    Array.from(prefix).map((c) => c.charCodeAt(0)),
    0
  );
  const pubkey = decodeAddress(address);
  payload.set(pubkey, prefix.length);
  // have to set the bytes manually, little endian encoding
  const indexBytes = numberToByteArray(index);
  payload[prefix.length + 32] = indexBytes[0];
  payload[prefix.length + 33] = indexBytes[1];
  return blake2AsU8a(payload);
};

export const deriveAddress = (opts: Options): void => {
  const { address, ss58Prefix, index } = opts;

  if (!address) {
    throw new Error("Please provide the addresses option.");
  }
  if (Number(index) > 65535) {
    throw new Error("Index cannot be greater than 2**16");
  }

  const pubkey = derivePubkey(address, Number(index));
  const msig = encodeAddress(pubkey, Number(ss58Prefix));

  console.log("-".repeat(32));
  console.log(`Address: ${address}`);
  console.log(`index: ${index}`);
  console.log(`Multisig Address (SS58: ${ss58Prefix}): ${msig}`);
  console.log("-".repeat(32));
};

// https://stackoverflow.com/a/12965194
function numberToByteArray(number: number): Uint8Array {
  // we want to represent the input as a 8-bytes array
  const byteArray = new Uint8Array(2);

  for (let index = 0; index < byteArray.length; index++) {
    const byte = number & 0xff;
    byteArray[index] = byte;
    number = (number - byte) / 256;
  }

  return byteArray;
};