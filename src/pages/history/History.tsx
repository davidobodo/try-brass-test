import React, { useEffect, useState } from "react";
import axios from "axios";
import { ITransaction } from "../../interfaces";

import "./History.scss";

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
        <div className="history-page">
            <div className="history-page__table">
                <div className="history-page__table__header">
                    <div>S/N</div>
                    <div>Amount</div>
                    <div>Bank</div>
                    <div>Recipient</div>
                    <div>Date</div>
                </div>
                <div className="history-page__table__body">
                    {transferHistory.map((item: ITransaction, index) => {
                        const { amount, id, recipient, createdAt } = item;
                        return (
                            <div key={id} className="history-page__table__body__row">
                                <div>{index + 1}</div>
                                <div>{amount}</div>
                                <div>{recipient.details.bank_name}</div>
                                <div>{recipient.name}</div>
                                <div>{createdAt}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default History;
