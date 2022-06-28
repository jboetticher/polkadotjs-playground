// Import
import yargs from 'yargs';
import selectNetwork from "../utils/selectNetwork";
import { Keyring } from '@polkadot/api';
import {privateKey} from '../secret.json';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const args = yargs.options({
    network: { type: 'string', demandOption: true, alias: 'n' }
}).argv;


const main = async () => {
    // Get provider & api
    const { provider, api } = await selectNetwork(args.network);

    // Check for xTokens pallet
    if (api.tx.xTokens === undefined) {
        console.error('xTokens pallet not included');
        process.exit();
    }

    console.log("BEGINNING TRANSFER");

    // Sets up keyring
    const keyring = new Keyring({ type: 'ethereum' });
    const alice = keyring.addFromUri(privateKey);

    // Sets up transaction
    const asset = api.createType("XcmVersionedMultiAsset", {
        v1: api.createType("XcmV1MultiAsset", {
            id: api.createType("XcmV1MultiassetAssetId", {
                concrete: api.createType("XcmV1MultiLocation", {
                    parents: 1,
                    interior: api.createType("XcmV1MultilocationJunctions", {
                        x2: [
                            api.createType("XcmV1Junction", { 
                                parachain: 2000 
                            }), api.createType("XcmV1Junction", { 
                                generalKey: [0, 128] // this is the same as 0x0080, since 00 = 0, and 80 = 128
                            })]
                    })
                })
            }),
            fun: api.createType("XcmV1MultiassetFungibility", {
                fungible: 1000000000000
            })
        })}
    );

    const dest = api.createType("XcmVersionedMultiLocation", {
        v1: api.createType("XcmV1MultiLocation", {
            parents: 1,
            interior: api.createType("XcmV1MultilocationJunctions", {
                x2: [
                    api.createType("XcmV1Junction", { 
                        parachain: 2000 
                    }), api.createType("XcmV1Junction", { 
                        accountId32: {
                            network: api.createType("XcmV0JunctionNetworkId", { any: true }),
                            id: "0x2ac51837783bd5e5efb1af97c1f43bd30095647ab4f8fe66f0c518ea79195d28"
                        }
                    })]
            })
        })
    });

    const tx = await api.tx.xTokens.transferMultiasset(asset, dest, 1000000000000);

    // Retrieve the encoded calldata of the transaction
    const encodedCalldata = tx.method.toHex()
    console.log("ENCODED CALL DATA:", encodedCalldata)

    // Sign and send the transaction
    const txHash = await tx.signAndSend(alice);

    // Show the transaction hash
    console.log(`Submitted with hash ${txHash}`);

    process.exit();
}

main();
