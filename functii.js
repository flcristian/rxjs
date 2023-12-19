import {Observable, interval, of, map, tap, timer, combineLatest, from, throwError, catchError } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { XMLHttpRequest } from 'xmlhttprequest';
export function exampleObservables() {

    const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        setTimeout(() => {
            subscriber.next(4);
            subscriber.complete();
        }, 1000);
    });

    observable.subscribe(
        {
            next(x) {
                console.log('got value ' + x);
            },
            error(err) {
                console.error('something wrong occurred: ' + err);
            },
            complete() {
                console.log('done');
            },
        });


}

export function exampleSubscriptions() {
    const observable1 = interval(400);
    const observable2 = interval(300);

    const subscription = observable1.subscribe(x => console.log('first: ' + x));
    const childSubscription = observable2.subscribe(x => console.log('second: ' + x));

    setTimeout(() => {

        subscription.unsubscribe();
        childSubscription.unsubscribe();
    }, 1000);
}

export function exampleOperators() {
    let observable = of(1, 2, 3)
        .pipe(
            tap(x => console.log("tap" + x)),
            map((x) => x * x)
        )

    observable.subscribe(
        {
            next(x) {
                console.log('got value ' + x);
            },
            error(err) {
                console.error('something wrong occurred: ' + err);
            },
            complete() {
                console.log('done');
            },
        });
}

export function exampleCombineLatest() {
    // timerOne emits first value at 1s, then once every 4s
    const timerOne$ = timer(2000, 4000);
    // timerTwo emits first value at 2s, then once every 4s
    const timerTwo$ = timer(1000, 4000);
    // timerThree emits first value at 3s, then once every 4s
    const timerThree$ = timer(3000, 4000);

    // when one timer emits, emit the latest values from each timer as an array
    let observable = combineLatest(timerOne$, timerTwo$, timerThree$);

    let subscriber = observable.subscribe(
        {
            next(x) {
                console.log(`${x[0]} - ${x[1]} - ${x[2]}`);
            },
            error(err) {
                console.error('something wrong occurred: ' + err);
            },
            complete() {
                console.log('done');
            }
        });
}

export async function exampleFromSource(){
    let options = {
        method:"GET",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }

    const apiSource = await from(
        fetch("http://localhost:5026/api/v1/Product/all", options)
            .then(response => response.json())
    );
    const subscriber = await apiSource.subscribe(value => console.log(value));
}

export async function exampleThrowError(){
    let errorCount = 0;

    const errorWithTimestamp = throwError(() => {
        const error= new Error(`This is error number ${ ++errorCount }`);
        error.timestamp = Date.now();
        return error;
    });

    errorWithTimestamp.subscribe({
        error: err => console.log(err.timestamp, err.message)
    });

    errorWithTimestamp.subscribe({
        error: err => console.log(err.timestamp, err.message)
    });
}   

// export async function exampleAjax(){
//     const obs$ = ajax('http://localhost:5026/api/v1/Product/all').pipe(
//         map(response => console.log('products: ', response)),
//         catchError(error => {
//             console.log('error: ', error);
//             return of(error);
//         })
//     );

//     obs$.subscribe({
//         next: value => console.log(value),
//         error: err => console.log(err)
//     });
// }