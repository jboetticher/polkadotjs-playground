// Import
import yargs from 'yargs';
import selectNetwork from "../utils/selectNetwork";
import { PolkadotPalletAssetsAssetDetailsHuman } from "../utils/polkatypes";

const args = yargs.options({
    network: { type: 'string', demandOption: true, alias: 'n' },
    includeName: { type: 'boolean', demandOption: false, alias: 'N' }
}).argv;

const main = async () => {
    // Get provider & api
    const { provider, api } = await selectNetwork(args.network);

    // Query for data
    if(api.query.assets === undefined) {
        console.error('Assets pallet not included');
        process.exit();
    }
    const assetMetadataEntries = await api.query.assets.metadata.entries();

    // Format Data
    const betterFormat = [];
    assetMetadataEntries.forEach((entry, index) => {
        const externalAssetData: PolkadotPalletAssetsAssetDetailsHuman = 
            entry[1].toHuman() as PolkadotPalletAssetsAssetDetailsHuman;
        const entryId: string = entry[0].toHuman()[0];

        betterFormat[externalAssetData.symbol] = { 
            name: externalAssetData.name, 
            assetId: entryId.replace(/,/g, '')
        };
    })

    // Include name column if needed
    const columns = ['assetId'];
    if(args.includeName) { 
        columns.push('name');
        columns.reverse()
    }

    // Now you don't have to deal with those pesky commas
    console.table(betterFormat, columns);

    process.exit();
}

main();