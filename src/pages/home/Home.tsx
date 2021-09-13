import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.scss";

import Backdrop from "../../components/backdrop/Backdrop";
import Loader from "../../components/loader/Loader";

import { validateAccNumber, createTransferRecipient, initiateTrasfer } from "../../apis/index";

import { IUserAccountDetails, IBank } from "../../interfaces";

const Home = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        acc_num: ""
    });
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
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBankCode !== "") {
            const getAccNum = async () => {
                setLoading(true);
                try {
                    const data = await validateAccNumber(accountNumber, selectedBankCode);
                    setValidatedAccDetails(data);
                    setLoading(false);
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            acc_num: ""
                        };
                    });
                } catch (error) {
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            acc_num: "Please check account number and try again"
                        };
                    });
                    setValidatedAccDetails({
                        account_name: "",
                        account_number: "",
                        bank_id: 0
                    });
                    setLoading(false);
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

        if (+joinedNumbers <= max_amount) {
            setAmountToSend(numberWithCommas(joinedNumbers));
        }
    };

    //-----------------------------------------------
    //Submit Button
    //-----------------------------------------------
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
    useEffect(() => {
        if (
            validateAmountToSend(numberWithoutCommas(amountToSend), min_amount, max_amount) &&
            selectedBankCode !== "" &&
            validatedAccDetails?.account_name !== ""
        ) {
            setButtonIsDisabled(false);
        } else {
            setButtonIsDisabled(true);
        }
    }, [amountToSend, selectedBankCode, validatedAccDetails?.account_name]);

    //-----------------------------------------------
    //Submit Form
    //-----------------------------------------------
    const [transferNotification, setTransferNotification] = useState({
        status: "",
        message: ""
    });
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        const getBank: IBank = banks.find((bank) => bank.code === selectedBankCode) as IBank;
        const { type, currency } = getBank;
        const body = {
            type,
            name: validatedAccDetails?.account_name,
            account_number: accountNumber,
            bank_code: selectedBankCode,
            currency
        };

        const transferReceipt = await createTransferRecipient(body).catch((error) => console.log(error));

        const transferBody = {
            source: "balance",
            amount: `${numberWithoutCommas(amountToSend)}00`,
            recipient: transferReceipt.recipient_code,
            reason: "Try brass Test"
        };

        const transferResponse = await initiateTrasfer(transferBody).catch((error) => {
            setLoading(false);
            setTransferNotification({
                status: "failed",
                message: "Funds transfer unsuccessful, please try again 😔"
            });
            resetAllFields();
        });

        if (transferResponse.status === "success") {
            setLoading(false);
            setTransferNotification({
                status: "success",
                message: "Funds transfer successful 🎉"
            });
            resetAllFields();
        }

        setTimeout(() => {
            setTransferNotification({
                status: "",
                message: ""
            });
        }, 5000);
    };

    const resetAllFields = () => {
        setSelectedBankCode("");
        setAccountNumber("");
        setValidatedAccDetails({
            account_name: "",
            account_number: "",
            bank_id: 0
        });
        setAmountToSend("");
        setButtonIsDisabled(true);
    };

    return (
        <>
            {loading && (
                <div className="loading-modal">
                    <Loader />
                    <Backdrop />
                </div>
            )}
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
                            className={errors.acc_num !== "" ? "error" : ""}
                        />

                        {errors.acc_num !== "" && <h6 className="error-message">{errors.acc_num}</h6>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="acc_name">Account Name</label>
                        <input
                            type="text"
                            name="acc_name"
                            id="acc_name"
                            value={validatedAccDetails?.account_name}
                            readOnly
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="amount">Enter amount</label>
                        <h6 className="sub-label">Amount must be within the range of 100 - 10,000,000</h6>
                        <input
                            type="text"
                            name="amount"
                            id="amount"
                            value={amountToSend}
                            onChange={handleSetAmountToSend}
                        />
                    </div>

                    <button type="submit" disabled={buttonIsDisabled}>
                        Send
                    </button>

                    {transferNotification.status !== "" && (
                        <div className="transfer-notification">
                            <h4 className={transferNotification.status ? "success" : "error"}>
                                {transferNotification.message}
                            </h4>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default Home;

//------------------------------------------------
//UTILITIES
//------------------------------------------------
function numberWithCommas(x: number | string): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberWithoutCommas(x: string): string {
    return x.split(",").join("");
}

function validateAmountToSend(amount: string, min: number, max: number): boolean {
    if (+amount >= min && +amount <= max) {
        return true;
    } else {
        return false;
    }
}
