import React from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { AuthModel } from "../../redux/features/auth/authInterface";

export default function TickerBar() {
    const loginSelector = useAppSelector<AuthModel>((state: any) => state.auth.loginData);
    const tickerLists = loginSelector?.TickerDataForDealer?.TickerListsForDealer ?? [];

    // const tickerLists = loginSelector?.TickerData?.TickerLists?.length
    //     ? loginSelector.TickerData.TickerLists
    //     : [
    //         { TickerID: 1, TICKER_DESCRIPTION: "Test Ticker", TEXT_COLOR: "#22334F" }
    //     ];
     console.log("TickerData", loginSelector.TickerDataForDealer);
    if (!tickerLists.length) return null;

   const now = new Date();
    console.log("All tickers:", tickerLists);
    const validTickers = tickerLists.filter(ticker => {
        if (!ticker.TICKER_VALIDFROM || !ticker.TICKER_VALIDTO) return false;
        const from = new Date(ticker.TICKER_VALIDFROM);
        const to = new Date(ticker.TICKER_VALIDTO);
        if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;
        return from <= now && now <= to;
    });
    console.log("Valid tickers:", validTickers);


    if (!validTickers.length) return null;

    const tickerText = validTickers.map(t => t.TICKER_DESCRIPTION).join("  \u00A0\u00A0    ");

    

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            minWidth: "250px",
            maxWidth: "400px",
            overflow: "hidden",
            background: "transparent",
            padding: "0 8px"
        }}>
            <div style={{
                flex: 1,
                overflow: "hidden",
                position: "relative",
                minWidth: "0"
            }}>
                <div
                    style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        animation: "ticker-slide 5s linear infinite",
                        fontSize: "15px",
                        color: "#22334F",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                    }}
                >
                    {tickerText}
                </div>
            </div>
            <style>
                {`
                @keyframes ticker-slide {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                `}
            </style>
        </div>
    );
}