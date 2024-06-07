import { Show, createEffect, createSignal } from "solid-js";
import { formatEther } from "viem";

export type CurrencyType = "ARS" | "AUD" | "BRL" | "CAD" | "CHF" | "CLP" | "CNY" | "CZK" | "DKK" | "EUR" | "GBP" | "HKD" | "HRK" | "HUF" | "INR" | "ISK" | "JPY" | "KRW" | "NZD" | "PLN" | "RON" | "RUB" | "SEK" | "SGD" | "THB" | "TRY" | "TWD" | "USD"

export function BalanceText(props: {
    balanceValue: bigint,
    balanceSymbol: string,
    currency: CurrencyType
}) {
    const balanceValue: bigint = props.balanceValue;
    const balanceSymbol: string = props.balanceSymbol;
    const currencyType: CurrencyType = props.currency;
    const [exchangeResult, setExchangeResult] = createSignal<Number | undefined>()

    const getExchangeData = async () => {
        const response = await fetch("https://blockchain.info/ticker")
        return response.json()
     }

    createEffect(async () => {
        const exchangeData = await getExchangeData()
        const formatEtherBalanceValue = Number.parseFloat(formatEther(balanceValue))
        setExchangeResult(formatEtherBalanceValue * exchangeData[currencyType]["sell"])
    })

    return (
        <>
            <Show when={balanceValue}>
                { balanceValue => 
                    <span>{`${formatEther(balanceValue())} ${balanceSymbol}`}</span>
                }
            </Show>
            <span> </span>
            <Show when={exchangeResult()}>
                <span>
                    ({exchangeResult()?.toString()} {currencyType})
                </span>
            </Show>
        </>
    )
}