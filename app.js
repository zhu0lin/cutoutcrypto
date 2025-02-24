import express from "express";
import http from 'http';
import 'dotenv/config'
import { Server } from "socket.io";
import axios from "axios";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const config = {
    headers: {
        'X_CMC_PRO_API_KEY': process.env['X-CMC_PRO_API_KEY']
    }
};

app.use(express.static("public"));

app.get("/", (req, res) => {
    const date = new Date();
    const currYear = date.getFullYear();
    res.render("content.ejs", { year: currYear });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    const fetchPrices = async () => {
        try {
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`, config);
            const result = response.data;
            socket.emit('prices', result);
        }
        catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    };

    const interval = setInterval(fetchPrices, 5000);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        clearInterval(interval);
    });

});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

