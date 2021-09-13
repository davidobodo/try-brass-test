import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ITransaction } from "../../interfaces";
import Backdrop from "../../components/backdrop/Backdrop";

import { toCurrency, removePaystackLaggingZeroes } from "../../utils/index";

import "./History.scss";

const History = () => {
    //-----------------------------------------------------------
    //All Transactions
    //-----------------------------------------------------------
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

    //-----------------------------------------------------------
    //Selected transaction
    //-----------------------------------------------------------
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>();
    const handleCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setSelectedTransaction(null);
    };
    const handleSelectTransaction = (item: ITransaction) => {
        setSelectedTransaction(item);
    };

    return (
        <>
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
                                <div
                                    key={id}
                                    className="history-page__table__body__row"
                                    onClick={() => handleSelectTransaction(item)}
                                >
                                    <div>{index + 1}</div>
                                    <div>{toCurrency(removePaystackLaggingZeroes(amount))}</div>
                                    <div>{recipient.details.bank_name}</div>
                                    <div>{recipient.name}</div>
                                    <div>{format(new Date(`${createdAt}`), "dd MMMM yyyy HH:mm:ss")}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedTransaction && (
                <div className="transaction-details">
                    <Backdrop onClick={handleCloseModal} />
                    <div className="transaction-details__content">
                        <h3>Transaction details</h3>
                        <div className="row">
                            <h4>Name</h4>
                            <h4>{selectedTransaction?.recipient.name}</h4>
                        </div>
                        <div className="row">
                            <h4>Amount</h4>
                            <h4>{toCurrency(removePaystackLaggingZeroes(selectedTransaction?.amount))}</h4>
                        </div>
                        <div className="row">
                            <h4>Bank</h4>
                            <h4>{selectedTransaction.recipient.details.bank_name}</h4>
                        </div>
                        <div className="row">
                            <h4>Status</h4>
                            <h4>{selectedTransaction?.status}</h4>
                        </div>
                        <div className="row">
                            <h4>Created</h4>
                            <h4>{format(new Date(`${selectedTransaction?.createdAt}`), "dd MMMM yyyy HH:mm:ss")}</h4>
                        </div>
                        <div className="row">
                            <h4>Transfercode</h4>
                            <h4>{selectedTransaction?.transfer_code}</h4>
                        </div>
                        <div className="row">
                            <h4>Notes</h4>
                            <h4>Status</h4>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default History;
