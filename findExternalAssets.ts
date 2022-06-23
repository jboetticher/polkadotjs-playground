// Import
import yargs from 'yargs';
import selectNetwork from "./utils/selectNetwork";

const args = yargs.options({
    network: { type: 'string', demandOption: true, alias: 'n' }
}).argv;

export const PARA_1000_SOURCE_LOCATION = {
    Xcm: { parents: 1, interior: { X1: { Parachain: 1000 } } },
  };
  export const RELAY_SOURCE_LOCATION = { Xcm: { parents: 1, interior: "Here" } };

const main = async () => {
    // Get provider & api
    const { provider, api } = await selectNetwork(args.network);

    //console.log(api.query.assetManager.assetTypeId);

    // Retrieve the last timestamp
    const assetTypeEntries = await api.query.assetManager.assetTypeId(RELAY_SOURCE_LOCATION);
    console.log(assetTypeEntries.toHuman());

    process.exit();
}

main();