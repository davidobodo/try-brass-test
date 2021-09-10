import React, { useEffect, useState } from "react";
import axios from "axios";
import { ITransaction } from "../../interfaces";

const History = () => {
    const [transferHistory, setTransferHistory] = useState([]);
    useEffect(() => {
        const fetchAllTransfers = async () => {
            try {
                const res = await axios.get("https://api.paystack.co/transfer", {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_TEST_SECRET_KEY}`
                    }
                });

                setTransferHistory(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllTransfers();
    }, []);
    return (
        <div>
            History page
            <div>
                <div>Amount</div>
                <div>Bank</div>
                <div>Recipient</div>
                <div>Date</div>
            </div>
            {transferHistory.map((item: ITransaction) => {
                const { amount, id, recipient, createdAt } = item;
                return (
                    <div key={id}>
                        <div>{amount}</div>
                        <div>{recipient.details.bank_name}</div>
                        <div>{recipient.name}</div>
                        <div>{createdAt}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default History;

/*
modal data
*/
