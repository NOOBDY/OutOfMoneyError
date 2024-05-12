import { Show, Suspense } from "solid-js";
import Link from "~/components/Link";
import { useAccount } from "~/hooks/useAccount";

export default function () {
    const [account, { connect }] = useAccount();
    return (
        <div>
            <Link href="/projects">projects</Link>
            <Suspense fallback={<p>connecting...</p>}>
                <Show
                    when={account.isConnected}
                    fallback={
                        <button type="button" onClick={connect}>
                            Connect
                        </button>
                    }
                    keyed
                >
                    <p>{account.address}</p>
                </Show>
            </Suspense>
        </div>
    );
}
