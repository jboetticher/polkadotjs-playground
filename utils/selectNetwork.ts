import { ApiPromise, WsProvider } from '@polkadot/api';

export default async function selectNetwork(network: string): Promise<{ provider: WsProvider; api: ApiPromise; }> {
    let wsProvider: WsProvider;
    switch (network) {
        case 'moonbeam':
            wsProvider = new WsProvider('wss://wss.api.moonbeam.network');
            break;
        case 'moonriver':
            wsProvider = new WsProvider('wss://wss.api.moonbeam.network');
            break;
        case 'moonbase':
            wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');
            break;
        default:
            console.error('Network not supported');
            process.exit();
    }

    // Construct API provider
    const api = await ApiPromise.create({ provider: wsProvider });

    return { provider: wsProvider, api };
}