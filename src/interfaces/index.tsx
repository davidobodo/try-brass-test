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

export interface ITransaction {
    amount: number;
    createdAt: string;
    currency: string;
    domain: string;
    failures: never;
    id: number;
    integration: number;
    reason: string;
    recipient: ITransactionRecipient;
    reference: string;
    session: { provider: never; id: never };
    source: string;
    source_details: null;
    status: string;
    titan_code: null;
    transfer_code: string;
    transferred_at: null;
    updatedAt: string;
}

export interface ITransactionRecipient {
    active: boolean;
    createdAt: string;
    currency: string;
    description: any;
    details: ITransactionRecipientDetails;
    domain: string;
    email: null;
    id: number;
    integration: number;
    is_deleted: boolean;
    metadata: null;
    name: string;
    recipient_code: string;
    type: string;
    updatedAt: string;
}

export interface ITransactionRecipientDetails {
    account_name: string;
    account_number: string;
    authorization_code: null;
    bank_code: string;
    bank_name: string;
}

export interface ITransferRecipient {
    type: string;
    name: string | undefined;
    account_number: string;
    bank_code: string;
    currency: string;
}
