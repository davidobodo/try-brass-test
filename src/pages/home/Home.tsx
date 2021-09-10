import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.scss";

import { IUserAccountDetails, IBank, IInitiateTransfer } from "../../interfaces";

const Home = (): JSX.Element => {
    //-----------------------------------------------
    //Listing banks
    //-----------------------------------------------
    const [banks, setBanks] = useState<IBank[]>([]);
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await axios.get("https://api.paystack.co/bank");
                setBanks(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBanks();
    }, []);

    //-----------------------------------------------
    //Selected Bank
    //-----------------------------------------------
    const [selectedBankCode, setSelectedBankCode] = useState("");
    const handleSelectBankCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBankCode(e.target.value);
    };

    //-----------------------------------------------
    //Entered account number
    //-----------------------------------------------
    const [accountNumber, setAccountNumber] = useState("");
    const handleSetAccountNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;

        if (value.length <= 10) {
            setAccountNumber(e.target.value);
        }
    };

    //-----------------------------------------------
    //Validate account number
    //-----------------------------------------------
    const [validatedAccDetails, setValidatedAccDetails] = useState<IUserAccountDetails>();
    const validateAccNumber = async (accNum: string, bankCode: string) => {
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
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBankCode !== "") {
            const getAccNum = async () => {
                try {
                    const data = await validateAccNumber(accountNumber, selectedBankCode);
                    setValidatedAccDetails(data);
                } catch (error) {
                    console.log(error);
                }
            };
            getAccNum();
        }
    }, [accountNumber, selectedBankCode]);

    //-----------------------------------------------
    //Amount to be sent
    //-----------------------------------------------
    const max_amount = 10000000;
    const min_amount = 100;
    const [amountToSend, setAmountToSend] = useState("");
    const handleSetAmountToSend = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        const _value = value.match(/\d/g) || [];
        const joinedNumbers = _value.join("");

        //Make sure amount doesnt exceed the maximum allowed
        if (+joinedNumbers <= max_amount) {
            setAmountToSend(joinedNumbers);
        }
    };

    const validateAmountToSend = (amount: string, min: number, max: number): boolean => {
        if (+amount >= min && +amount <= max) {
            return true;
        } else {
            return false;
        }
    };

    //-----------------------------------------------
    //Submit Form
    //-----------------------------------------------

    const createTransferRecipient = async () => {
        const getBank: IBank = banks.find((bank) => bank.code === selectedBankCode) as IBank;
        const { type, currency } = getBank;
        const body = {
            type,
            name: validatedAccDetails?.account_name,
            account_number: accountNumber,
            bank_code: selectedBankCode,
            currency
        };

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

    const initiateTrasfer = async (body: IInitiateTransfer) => {
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

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isAmountWithinRange = validateAmountToSend(amountToSend, min_amount, max_amount);

        if (!isAmountWithinRange) {
            alert("Amount must be withing 100 to 10000000");
            return;
        }

        const transferReceipt = await createTransferRecipient().catch((error) => console.log(error));

        const transferBody = {
            source: "balance",
            amount: amountToSend,
            recipient: transferReceipt.recipient_code,
            reason: "Try brass Test"
        };

        const transferResponse = await initiateTrasfer(transferBody).catch((error) => console.log(error));

        console.log(transferResponse, "THE FINAL TRANSFER");
    };

    return (
        <div className="home-page">
            <form noValidate onSubmit={handleSubmitForm} className="home-page__form">
                <h3 className="home-page__form__title">Transfer</h3>
                <div className="form-field">
                    <label htmlFor="banks">Select bank</label>
                    <select name="banks" id="banks" onChange={handleSelectBankCode}>
                        <option value="">Choose a bank</option>
                        {banks.map((bank) => {
                            const { name, code } = bank;
                            return (
                                <option value={code} key={code}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="acc_number">Enter your account number</label>
                    <input
                        type="text"
                        name="acc_number"
                        id="acc_number"
                        value={accountNumber}
                        onChange={handleSetAccountNumber}
                        placeholder="**********"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="acc_name">Account Name</label>
                    <input type="text" name="acc_name" id="acc_name" value={validatedAccDetails?.account_name} />
                </div>

                <div className="form-field">
                    <label htmlFor="amount">Enter amount</label>
                    <input
                        type="text"
                        name="amount"
                        id="amount"
                        value={amountToSend}
                        onChange={handleSetAmountToSend}
                    />
                </div>

                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Home;
