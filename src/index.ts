import {Composition} from './composition';
import {Layer} from './layer';

(async () => {
/*
    console.log('Init...');
    let comp = await Composition.create('my1');
    console.log('Connecting...');
    await comp.connect();
    console.log('Connected!');
    let layer = new Layer(comp);
    layer.title = 'Layer1';
    layer.width = 100;
    layer.height = 100;
    comp.layers.push(layer);
    layer.title = 'Layer2';
    layer.width = 200;
    layer.height = 200;
    comp.layers.push(layer);
    console.log('Saving...');
    await comp.save();
    console.log('Saved!');
    console.log('Disconnecting...');
    await comp.disconnect();
    console.log('Disconnected!');
*/

    console.log('Opening...');
    let comp2 = await Composition.open('my1');
    console.log(comp2);
    debugger;
    process.exit();
})();
