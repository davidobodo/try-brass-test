import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = (): JSX.Element => {
    //-----------------------------------------------
    //Listing banks
    //-----------------------------------------------
    const [banks, setBanks] = useState<never[]>([]);
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
        console.log(e.target.value);
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
    const validateAccNumber = async (accNum: string, bankCode: string) => {
        const PAYSTACK_KEY = "12344";
        try {
            const res = await axios.get(
                `https://api.paystack.co/bank/resolve?account_number=${accNum}&bank_code=${bankCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_KEY}`
                    }
                }
            );

            return res;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBankCode !== "") {
            validateAccNumber(accountNumber, "10");
        }
    }, [accountNumber, selectedBankCode]);

    return (
        <form>
            <div>
                <label htmlFor="bank">Select bank</label>
                <select name="bank" id="bank" onChange={handleSelectBankCode}>
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => {
                        const { name, code } = bank;
                        return <option value={code}>{name}</option>;
                    })}
                </select>
            </div>

            <div>
                <label htmlFor="">Enter your account number</label>
                <input type="text" value={accountNumber} onChange={handleSetAccountNumber} placeholder="**********" />
            </div>
        </form>
    );
};

export default Home;
