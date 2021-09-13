import axios from "axios";

import { ITransferRecipient, IInitiateTransfer } from "../interfaces";

export const validateAccNumber = async (accNum: string, bankCode: string) => {
    try {
        const res = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accNum}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
                }
            }
        );

        return res.data.data;
    } catch (error) {
        console.log(error);
    }
};

export const createTransferRecipient = async (body: ITransferRecipient) => {
    try {
        const res = await axios.post("https://api.paystack.co/transferrecipient", body, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
            }
        });

        return res.data.data;
    } catch (error) {
        console.log(error);
    }
};

export const initiateTrasfer = async (body: IInitiateTransfer) => {
    try {
        const res = await axios.post("https://api.paystack.co/transfer", body, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
            }
        });

        return res.data.data;
    } catch (error) {
        console.log(error);
    }
};
