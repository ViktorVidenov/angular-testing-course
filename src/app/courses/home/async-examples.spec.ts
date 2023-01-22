import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing examples", () => {
    it("Asynchronous test with Jasmine done()", (done: DoneFn) => {
        let test = false;

        setTimeout(() => {

            console.log('runing assertions');

            test = true;

            expect(test).toBeTruthy()

            done();
        }, 1000)

    });

    it("Asynchronous test example - setTimeout()", fakeAsync(() => {

        let test = false;

        setTimeout(() => {

            console.log('runing assertions setTimeout()');

            test = true;

            expect(test).toBeTruthy()

        }, 1000)

        tick(1000);

        // flush()

    }))

    /* 
     a promise is considered a micro task
     setTimeout wich is considered either a macro task or smiple a task.
     Macro task - setTimeolut, set Interval, Ajax calls, mouse clicks, and several other browser operations,
     all those asynchronous operations will get added to the event loop, and between each of these macro tasks, 
     the browser rendering engine is going to get a chance to update the screen. 
     And this is like the case of micro tasks, such as, for example promises.
     So promises are added to their own separate queue, wich is different than the queue where tasks such as for example setTimeout or setInterval are added.
     so these are two separate queue in the JavaScript runtime for asynchronous tasks, the micro task, and the task queue.
    */

    it("Asynchronous test example - plain Promise", fakeAsync(() => {
        let test = false;

        console.log('Creating promise');

        Promise.resolve().then(() => {
            console.log('First Promise evaluated succesfully');

            test = true;

            return Promise.resolve()
        })
            .then(() => {
                console.log('Second Promise succesfully done');
            })
            ;
        // with flush micoTask flush micro task queue
        flushMicrotasks();
        console.log('Runing test assertions');

        expect(test).toBeTruthy();
    }));

    it("Asynchronous test example - Promises + setTimeout()", fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter += 1;
            }, 1000)
        });

        expect(counter).toBe(0);

        flushMicrotasks();

        expect(counter).toBe(10);

        //different option to trigger the asynchronous task from task queue
        tick(1000)

        expect(counter).toBe(11);
    }));

    it("Asynchronous test example - Observables", fakeAsync(() => {
        let test = false;

        console.log("Creating Observable");

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });

        tick(1000);

        console.log('Runing test assertions');
        
        expect(test).toBe(true);
    }));

})