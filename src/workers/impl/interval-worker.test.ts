import {suite, test}    from "mocha-typescript";
import {expect}         from 'chai';

import {IntervalWorker} from "./interval-worker";
import {MessageHandler} from "../../ipc/message-handler";

@suite("Interval worker")
class IntervalWorkerTest {

    private static id: string = "12";
    private worker: IntervalWorker;

    before() {
        const handler: MessageHandler = MessageHandler.getInstance();
        handler.initForSlave();
        this.worker = new IntervalWorker(IntervalWorkerTest.id);
    }

    @test()
    testSetId() {
        expect(this.worker.workerId).to.eql(IntervalWorkerTest.id);
    }
}