const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const { response } = require('express')

const app = express()
app.use(cors())
app.use(bodyParser())

app.post("/create", (req, res)=>{
    console.log("here from create", new Date())
})

app.post("/:id/capture", async (req, res)=>{
    const token = 'A21AAKV4OszkkhV0r45jTdFY1e3QWqeuZE7rmlljcNwN-Q9AgBSDYSkW8b4pO641-_o6I0VKZffeK6dWAkG4j1SvFM9hZOW4A'
    // console.log({body:req.body})
    try {
        const result = await axios(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.params.id}/capture`, {
            method:"post",
            headers: { 
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                // "PayPal-Request-Id": "7b92603e-77ed-4896-8e78-5dea2050476a"
            },
    
        })
        console.log({a:JSON.stringify(result.data)})
    } catch(error) {
        console.log({error})
    }
   
    res.send(201)
})

app.listen(5005, () => {
    console.log(`Paypal server starting on port: ${5005}`)
  })