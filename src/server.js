const express= require('express');
const app= express();
const env= require('dotenv');
const homeRoutes= require('./routes/home');
const chatBotRoutes= require('./routes/chatbot');
const bodyParser= require('body-parser');
env.config();

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
app.use(bodyParser.urlencoded({"extended": false}));
app.use(bodyParser.json());
app.use(express.static('./src/public'))
app.set("view engine", "ejs")
app.set("views", "./src/views")
app.use('/', homeRoutes)
app.use('/', chatBotRoutes);