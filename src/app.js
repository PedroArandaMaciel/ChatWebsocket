import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server, Socket } from 'socket.io'
import viewsRouter from './routes/views.router.js';

const app = express();
app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)

const PORT = process.env.PORT||8080
const server = app.listen(PORT, () => console.log('Listening'))
const io = new Server(server)

const messages = []
io.on('connection', socket => {
    socket.emit('logs', messages)

    socket.on('message', data => {
        messages.push(data)
        io.emit('logs', messages)
    })
    socket.on('authenticated', data => {
        socket.broadcast.emit('newUserConnected', data)
    })

})
//io envia el mensaje a todos, SOCKET solo al usuario conectado, BROADCAST a todos menos al que desencadeno el evento