export type PolkadotAccount = {
    nonce: number;
    consumers: number;
    providers: number;
    sufficients: number;
    data: {
        free: string;
        reserved: number;
        miscFrozen: number;
        feeFrozen: number;
    }
}

export type PolkadotAccountHuman = {
    nonce: string;
    consumers: string;
    providers: string;
    sufficients: string;
    data: {
        free: string;
        reserved: string;
        miscFrozen: string;
        feeFrozen: string;
    }
}
