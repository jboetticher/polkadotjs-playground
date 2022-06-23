// Import
import yargs from 'yargs';
import selectNetwork from "./utils/selectNetwork";
import { PolkadotAccount } from './utils/polkatypes';

const args = yargs.options({
    network: { type: 'string', demandOption: true, alias: 'n' },
    address: { type: 'string', demandOption: true, alias: 'a' }
}).argv;


const main = async () => {
    // Get provider & api
    const { provider, api } = await selectNetwork(args.network);

    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();

    // Retrieve the account balance & current nonce via the system module
    const res = await api.query.system.account(args.address);
    const resJSON: PolkadotAccount = res.toJSON() as PolkadotAccount;
    const free = parseInt(resJSON.data.free, 16);

    // Retrieve the given account's next index/nonce, taking txs in the pool into account
    const nextNonce = await api.rpc.system.accountNextIndex(args.address);

    console.log(
        `${now}: balance of ${free} and a current nonce of ${resJSON.nonce} and next nonce of ${nextNonce}.`);

    process.exit();
}

main();