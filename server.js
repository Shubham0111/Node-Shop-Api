const http=require('http');
const app=require('./app');
const server=http.createServer(app,(req,res)=>{
});
server.listen(3000,'localhost',()=>{
})
