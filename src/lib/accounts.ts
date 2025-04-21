export enum AccountType {
    DryRun,
    Regular,
    Administrator,
    SuperUser
}

export interface IDiscoveredAccount {
    username: string;
    password: string;
    accountType: AccountType;
}

export function isDiscoveredAccount(obj: any): obj is IDiscoveredAccount {
    return (obj.username !== undefined && typeof obj.username === "string") && (obj.password !== undefined && typeof obj.password === "string") && (obj.accountType !== undefined && (obj.AccountType === AccountType.DryRun || obj.AccountType === AccountType.Regular || obj.AccountType === AccountType.SuperUser));
}