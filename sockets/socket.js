const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Breaking Benjamin' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Héroes del Silencio' ) );
bands.addBand( new Band( 'Metallica' ) );

console.log(bands);
// Mensajes de socket
io.on('connection', client => {
    
    console.log("Cliente conectado");

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log("Cliente desconectado");
     });

     client.on('mensaje', ( payload ) => {
         console.log('Mensaje', payload);
     });

     client.emit( 'mensaje', {admin: 'Nuevo mensaje'} );

     client.on('emitir-mensaje', ( payload ) => {
         console.log(payload);
        //io.emit('nuevo-mensaje', 'El pepe'); //Esto emite a todos hasta a mí
        client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos al que lo emitió
     });

     client.on('vote-band', (payload) =>{
         bands.voteBand( payload.id );
         io.emit('active-bands', bands.getBands());
     });

     //Escuchar : add-band
     client.on('add-band', ( payload) => {
         //el client es para el que este conectado
         bands.addBand(new Band (payload.name));
         //El io hace que todos lo tengan
         io.emit('active-bands', bands.getBands());
     });

     //delete-band

     client.on('delete-band', (payload) => {
         
        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands());
        
     });
});