export interface IUserAccountDetails {
    account_name: string;
    account_number: string;
    bank_id: number;
}

export interface IBank {
    active: boolean;
    code: string;
    country: string;
    createdAt: string;
    currency: string;
    gateway: never;
    id: number;
    is_deleted: boolean;
    longcode: string;
    name: string;
    pay_with_bank: boolean;
    slug: string;
    type: string;
    updatedAt: string;
}

export interface IInitiateTransfer {
    source: string;
    amount: string;
    recipient: string;
    reason: string;
}
