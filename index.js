const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const port = 3001
const app = express()
app.use(express.json())
app.use(cors())
const orders = []

const checkOrderId = (request, reponse, next) => {
   const { id } = request.params 
   const index = orders.findIndex(order => order.id === id)
   if (index < 0) {
      return reponse.status(404).json({ message: "Order not found"})
   }

   request.orderIndex = index
   request.orderId = id

   next()
}

app.get('/orders', (request, response) => {

   return response.json(orders)
})

app.post('/orders', (request, response) => {
   const { order, clientName } = request.body
   const newOrders = { id: uuid.v4(), order, clientName, price: "R$59,80", status: "Em preparação" }

   orders.push(newOrders)

   return response.status(201).json(newOrders)
})


app.put('/orders/:id', checkOrderId, (request, response) => {
   const index = request.orderIndex
   const id = request.orderId
   const { order, clientName} = request.body
   const updateOrder = { id, order, clientName, "updated price": "R$70,00", "status": "Pedido alterado com sucesso!" }  

   orders[index] = updateOrder

   return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, (request, response) => {
   const index = request.orderIndex
   const id = request.orderId

   orders.splice(index, 1)

   return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, (request, response) => {
   const index = request.orderIndex

   return response.json(orders[index])
})

app.patch('/orders/:id', checkOrderId, (request, response) => {
   const index = request.orderIndex
   const order = orders[index]

   order.status = "Pronto"
   
   return response.json(order)
})


app.listen(port, () => {
   console.log('🥱 Server started on port ${port}')
})
