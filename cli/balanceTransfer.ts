// Import
import yargs from 'yargs';
import selectNetwork from "../utils/selectNetwork";
import { Keyring } from '@polkadot/api';
import {privateKey} from '../secret.json';

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const args = yargs.options({
    network: { type: 'string', demandOption: true, alias: 'n' },
    amount: { type: 'string', demandOption: true, alias: 'a' },
    receiver: { type: 'string', demandOption: true, alias: 'r' }
}).argv;


const main = async () => {
    // Get provider & api
    const { provider, api } = await selectNetwork(args.network);

    // Check for xTokens pallet
    if (api.tx.balance === undefined) {
        console.error('balance pallet not included');
        process.exit();
    }

    console.log("BEGINNING BALANCE TRANSFER");

    // Sets up keyring
    const keyring = new Keyring({ type: 'ethereum' });
    const alice = keyring.addFromUri(privateKey);

    const tx = await api.tx.balances.transfer(args['receiver'], args['amount']);

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