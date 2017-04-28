import {suite, test}        from "mocha-typescript";
import {expect}             from 'chai';

import {EndpointManager}    from "./endpoint-manager";
import {EndpointDefinition} from "./endpoint-definition";
import {Parameter}          from "./parameters/parameter";

@suite("Endpoint manager")
class EndPointManagerTest {

    private endpointManager: EndpointManager;
    private def1: EndpointDefinition;
    private def2: EndpointDefinition;
    private def3: EndpointDefinition;
    private def4: EndpointDefinition;
    private def5: EndpointDefinition;
    private def6: EndpointDefinition;
    private def7: EndpointDefinition;
    private def8: EndpointDefinition;

    constructor() {
        this.endpointManager = EndpointManager.getInstance();
    }

    before() {
        this.def1 = new EndpointDefinition('/', null, []);
        this.endpointManager.registerEndpoint(this.def1);

        this.def2 = new EndpointDefinition('/test', null, []);
        this.endpointManager.registerEndpoint(this.def2);

        this.def3 = new EndpointDefinition('/content', null, [new Parameter<string>('param1', 'Test parameter 1')]);
        this.endpointManager.registerEndpoint(this.def3);

        this.def4 = new EndpointDefinition('/content2', null, [
            new Parameter<string>('param1', 'Test parameter 1'),
            new Parameter<number>('param2', 'Test parameter 2')
        ]);
        this.endpointManager.registerEndpoint(this.def4);

        this.def5 = new EndpointDefinition('/content/{param1}', null, [new Parameter<string>('param1', 'Test parameter 1')]);
        this.endpointManager.registerEndpoint(this.def5);

        this.def6 = new EndpointDefinition('/content/{param1}/subcontent', null, [new Parameter<string>('param1', 'Test parameter 1')]);
        this.endpointManager.registerEndpoint(this.def6);

        this.def7 = new EndpointDefinition('/content/{param1}/subcontent/{param2}', null, [
            new Parameter<string>('param1', 'Test parameter 1'),
            new Parameter<number>('param2', 'Test parameter 2')
        ]);
        this.endpointManager.registerEndpoint(this.def7);

        this.def8 = new EndpointDefinition('/content/registerEndpoint', null, null);
    }

    @test()
    testRegisterEndpoint() {
        debugger;
        expect(this.endpointManager.registerEndpoint(this.def8));
    }

    @test()
    testGetEndpoints() {
        expect(this.endpointManager.getEndpoints().length).to.eql(8);
    }

    @test()
    testGetEndpoint() {
        expect(this.endpointManager.getEndpoint('/').path).to.eql(this.def1.path);
        expect(this.endpointManager.getEndpoint('/test').path).to.eql(this.def2.path);
        expect(this.endpointManager.getEndpoint('/content').path).to.eql(this.def3.path);
        expect(this.endpointManager.getEndpoint('/content2').path).to.eql(this.def4.path);
        expect(this.endpointManager.getEndpoint('/content/value1').path).to.eql(this.def5.path);
        expect(this.endpointManager.getEndpoint('/content/value1/subcontent').path).to.eql(this.def6.path);
        expect(this.endpointManager.getEndpoint('/content/value1/subcontent/value2').path).to.eql(this.def7.path);
        //expect(this.endpointManager.getEndpoint('/content/registerEndpoint').path).to.eql(this.def8.path);
    }

    @test()
    testUnregisterEndpoint() {
        this.endpointManager.unRegisterEndpoint(this.def8.path);
    }
}