import bcrypt from "bcryptjs";
import {AccountType, type IDiscoveredAccount} from "./accounts";

export const knownAccounts: IDiscoveredAccount[] = [
    {
        username: "root",
        password: bcrypt.hashSync("toor", 10),
        accountType: AccountType.SuperUser
    },
    {
        username: "no reveal ):<",
        password: bcrypt.hashSync("", 10),
        accountType: AccountType.SuperUser
    },
    {
        username: "Tanaka",
        password: bcrypt.hashSync("Akanat", 10),
        accountType: AccountType.Regular
    }
]