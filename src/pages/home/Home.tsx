import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
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

    return (
        <form>
            <div>
                <label htmlFor="bank">Select bank</label>
                <select name="bank" id="bank">
                    {banks.map((bank) => {
                        const { name } = bank;
                        return <option value="">{name}</option>;
                    })}
                </select>
            </div>
        </form>
    );
};

export default Home;
