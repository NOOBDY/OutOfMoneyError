import { createAsync } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { formatEther } from "viem";

export type CurrencyType =
    | "ARS"
    | "AUD"
    | "BRL"
    | "CAD"
    | "CHF"
    | "CLP"
    | "CNY"
    | "CZK"
    | "DKK"
    | "EUR"
    | "GBP"
    | "HKD"
    | "HRK"
    | "HUF"
    | "INR"
    | "ISK"
    | "JPY"
    | "KRW"
    | "NZD"
    | "PLN"
    | "RON"
    | "RUB"
    | "SEK"
    | "SGD"
    | "THB"
    | "TRY"
    | "TWD"
    | "USD";

export function BalanceText(props: {
    balanceValue: bigint;
    balanceSymbol: string;
    currencyType: CurrencyType;
}) {
    const [exchangeResult, setExchangeResult] = createSignal<
        Number | undefined
    >();

    const getExchangeData = async () => {
        const response = await fetch("https://blockchain.info/ticker");
        return response.json();
    };

    createAsync(async () => {
        props.balanceValue;
        const exchangeData = await getExchangeData();
        const formatEtherBalanceValue = Number.parseFloat(
            formatEther(props.balanceValue)
        );
        setExchangeResult(
            formatEtherBalanceValue * exchangeData[props.currencyType]["sell"]
        );
    });

    return (
        <>
            <Show when={props.balanceValue !== undefined}>
                <span>{`${formatEther(props.balanceValue)} ${props.balanceSymbol}`}</span>
            </Show>
            <span> </span>
            <Show when={exchangeResult() !== undefined}>
                <span>
                    ({exchangeResult()?.toString()} {props.currencyType})
                </span>
            </Show>
        </>
    );
}
