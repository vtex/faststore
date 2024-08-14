export type CustomField = {
    key: string;
    value: string;
};

export type BuyerOrg = {
    id: string;
    email: string;
    name: string;
    tradeName: string;
    document: string;
    approved: string;
    stateRegistration: string;
    unitIds: string[];
    priceTables: string[];
    sellers: string[];
    categories: string[];
    tradePolicies: string[];
    paymentTerms: string[];
    customFields: CustomField[];
};
