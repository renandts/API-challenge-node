
const express = require('express')
const uuid = require('uuid')
const port = 3001
const app = express()
app.use(express.json())


const orders = []

const checkOrderId = ((request,response,next) =>{
    const {id} = request.params
    const index = orders.findIndex(client => client.id === id)
    if(index < 0){
        return response.status(404).json({message: "order not found"})
    }
    request.userIndex = index
    request.userId = id

    next()
})

const checkRouteUrl = ((request, response, next)=>{
    console.log(request.method)
    console.log(request.url)

    next()
})

app.get('/orders', checkRouteUrl, (request, response) => {
  
    return response.send(orders)

})

app.post('/orders', checkRouteUrl, (request,response)=>{
        const { order, clientName, price,} = request.body
        const client = {id: uuid.v4(),order, clientName, price, status:"Seu pedido esta quase pronto!"}

        orders.push(client)
        return response.status(201).json(client)
})

app.put('/orders/:id',checkOrderId, checkRouteUrl, (request, response)=>{
    
    const {order, clientName, price} = request.body
    const index = request.userIndex
    const id = request.userId
    const updateOrder = {id, order, clientName, price, status:"Seu pedido esta em PREPARAÇÂO"}

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id',checkOrderId, checkRouteUrl, (request, response)=>{
    const index = request.userIndex

    orders.splice(index,1)

    return response.status(204).json()
})

app.get('/orders/:id',checkOrderId, checkRouteUrl, (request, response) => {
    const index = request.userIndex

    const status = orders[index]
    
    return response.send(status)

})

app.patch('/orders/:id', checkRouteUrl, checkOrderId, (request, response)=>{
    const index = request.userIndex

    const newStatus = orders[index]
    newStatus.status = "Seu pedido está PRONTO!!!"
    
    return response.json(newStatus)

})
app.listen(port, ()=>{
    console.log(`🚀 server started on port ${port}`)
})