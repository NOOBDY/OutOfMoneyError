import { createAsync } from "@solidjs/router";
import { GetAccountReturnType, getBalance } from "@wagmi/core";
import {
    ErrorBoundary,
    Match,
    Show,
    Suspense,
    Switch,
    createSignal
} from "solid-js";
import { BalanceText } from "~/components/BalanceText";
import { Button } from "~/components/Button";
import Link from "~/components/Link";
import { useAccount } from "~/hooks/useAccount";
import { useConfig } from "~/hooks/useConfig";

type ConnectedAccount = Extract<GetAccountReturnType, { status: "connected" }>;

type AccountProps = {
    account: ConnectedAccount;
};

function Account(props: AccountProps) {
    return <p class="font-mono">{props.account.address}</p>;
}

type BalanceProps = {
    address: ConnectedAccount["address"];
};

function Balance(props: BalanceProps) {
    const config = useConfig();
    const [balanceData, setBalanceData] = createSignal<
        | {
              balanceAddress: string;
              balanceValue: bigint;
              balanceSymbol: string;
          }
        | undefined
    >(undefined);

    createAsync(async () => {
        props.address;
        setBalanceData(
            props.address === balanceData()?.balanceAddress
                ? balanceData()
                : undefined
        );
    });

    createAsync(async () => {
        props.address;
        const balance = await getBalance(config, { address: props.address });
        setBalanceData({
            balanceAddress: props.address,
            balanceValue: balance.value,
            balanceSymbol: balance.symbol
        });
    });

    return (
        <Suspense>
            <p class="font-mono">
                <Show
                    when={balanceData()}
                    fallback={<span>Loading</span>}
                    keyed
                >
                    {balanceData => (
                        <BalanceText
                            currencyType="TWD"
                            balanceValue={balanceData.balanceValue}
                            balanceSymbol={balanceData.balanceSymbol}
                        />
                    )}
                </Show>
            </p>
        </Suspense>
    );
}

export default function () {
    const [account, { connect, disconnect }] = useAccount();

    return (
        <ErrorBoundary fallback={err => err}>
            <div class="mx-auto flex flex-col space-y-2 px-4 md:w-2/3 xl:w-1/2">
                <div>
                    <Link href="/projects">projects</Link>
                </div>

                <Switch fallback={<p>Connecting</p>}>
                    <Match when={account.status === "disconnected"}>
                        <div class="mx-auto">
                            <Button type="button" onClick={connect}>
                                Connect
                            </Button>
                        </div>
                    </Match>

                    <Match
                        when={account.status === "connected" && account}
                        keyed
                    >
                        {account => (
                            <>
                                <Account account={account} />

                                <Balance address={account.address} />

                                <div class="mx-auto">
                                    <Button type="button" onClick={disconnect}>
                                        Disconnect
                                    </Button>
                                </div>
                            </>
                        )}
                    </Match>
                </Switch>
            </div>
        </ErrorBoundary>
    );
}
