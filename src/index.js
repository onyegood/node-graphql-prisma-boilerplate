import '@babel/polyfill/noConflict'
import server from './server'

const cors = {
    credentials: true,
    origin: "http://localhost:3000"
}

server.start({ cors, port: process.env.PORT || 4000 }, () => {
    console.log('The server is up!')
})