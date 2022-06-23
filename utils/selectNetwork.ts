import { ApiPromise, WsProvider } from '@polkadot/api';

export default async function selectNetwork(network: string): Promise<{ provider: WsProvider; api: ApiPromise; }> {
    let wsProvider: WsProvider, providerString: string | undefined;
    providerString = (() => {switch (network) {
        case 'moonbeam':
            return 'wss://wss.api.moonbeam.network';
        case 'moonriver':
            return 'wss://wss.api.moonriver.moonbeam.network';
        case 'moonbase':
            return 'wss://wss.api.moonbase.moonbeam.network';
        case 'polkadot':
            return 'wss://rpc.polkadot.io';
        case 'kusama':
            return 'wss://kusama-rpc.polkadot.io';
        case 'moonbaseRelay':
            return 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';
        default:
            console.error('Network not supported');
            return undefined;
    }})();

    if(providerString === undefined) process.exit();
    wsProvider = new WsProvider(providerString);

    // Construct API provider
    const api = await ApiPromise.create({ provider: wsProvider });

    return { provider: wsProvider, api };
}