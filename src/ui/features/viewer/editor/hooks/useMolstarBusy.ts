import { useEffect, useState } from "react";
import { Subject, of, timer } from "rxjs";
import { distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { getBusySubscription } from "../../../../lib/molstar";

/**
 * True while Molstar is busy. Turns on immediately, turns off only after Molstar
 * stayed idle for `settleMs`.
 * @param ready pass `!molstarInitializing`, so we can subscribe once Molstar exists
 * @param settleMs how long Molstar must be idle before we report "not busy"
 */
export function useMolstarBusy(ready: boolean, settleMs = 150) {
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!ready) return;

        const subject = new Subject<boolean>();

        const smoothed = subject
            .pipe(
                switchMap((b) => (b ? of(true) : timer(settleMs).pipe(map(() => false)))),
                distinctUntilChanged(),
            )
            .subscribe(setBusy);

        const busySub = getBusySubscription((isBusy) => subject.next(isBusy));

        return () => {
            busySub.unsubscribe();
            smoothed.unsubscribe();
            subject.complete();
        };
    }, [ready, settleMs]);

    return busy;
}
