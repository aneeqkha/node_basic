const fs = require("fs")
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')
const slugify = require('slugify')
//blocking and handle with synchronoce function 

// const test = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(test)
// const testout = `This is all about the avocade: ${test} \n this is created on date${Date.now()} `
// fs.writeFileSync('./txt/output.txt',testout)
// console.log(testout)

//non-blocking and asynchronoce function

// const testasy = fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log("Error..")
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2}\n ${data3}`, 'utf-8', err => {
//                 console.log("The data is written in the file.")
//             })
//         })
//     })
// })
// console.log("read the file.")

//////////////////////////////////////////////\\\\\\\\\\\\\\\\///////////////////////

//Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8')
const productData = JSON.parse(data); 
const slug = productData.map(data => slugify(data.productName,{lower : true}) )

const server = http.createServer((req, res) => {

    const { pathname, query } = url.parse(req.url, true)
    const pathName = req.url

    //Overview page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const cardHtml = productData.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml)
        res.end(output);
    }

    //Product page
    else if (pathname === '/product') {
        const product = productData[query.id]
        console.log(product)
        const output = replaceTemplate(tempProduct, product)
        console.log(output)
        res.end(output)
    }

    //API 
    else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    }

    // Not Found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello World!'
        });
        res.end(`<h1>page not found</h1>`)
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log("server is listening on port 8000")
})