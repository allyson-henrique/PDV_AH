const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
})

app.use(helmet())
app.use(cors())
app.use(express.json())

// Cost calculation service
const costCalculator = {
  // Infrastructure costs (monthly)
  infrastructure: {
    basic: { cost: 29.99, users: 5, orders: 1000 },
    professional: { cost: 79.99, users: 15, orders: 5000 },
    enterprise: { cost: 199.99, users: 50, orders: 20000 }
  },
  
  // Per-transaction costs
  transactions: {
    pix: 0.01,
    credit: 0.039,
    debit: 0.019,
    cash: 0
  },
  
  // Integration costs
  integrations: {
    ifood: { setup: 99, monthly: 19.99, commission: 0.12 },
    ubereats: { setup: 99, monthly: 19.99, commission: 0.15 },
    nfe: { setup: 49, monthly: 9.99, perNfe: 0.05 },
    printer: { setup: 199, monthly: 0 }
  },

  calculate(params) {
    const { plan, monthlyOrders, paymentMethods, integrations } = params
    
    let totalCost = this.infrastructure[plan].cost
    
    // Transaction costs
    Object.entries(paymentMethods).forEach(([method, percentage]) => {
      const orders = monthlyOrders * (percentage / 100)
      totalCost += orders * this.transactions[method]
    })
    
    // Integration costs
    integrations.forEach(integration => {
      if (this.integrations[integration]) {
        totalCost += this.integrations[integration].monthly
      }
    })
    
    return {
      monthly: totalCost,
      annual: totalCost * 12 * 0.9, // 10% discount
      breakdown: {
        infrastructure: this.infrastructure[plan].cost,
        transactions: totalCost - this.infrastructure[plan].cost,
        integrations: integrations.reduce((sum, int) => 
          sum + (this.integrations[int]?.monthly || 0), 0)
      }
    }
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/calculate-cost', (req, res) => {
  try {
    const result = costCalculator.calculate(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/pricing-plans', (req, res) => {
  res.json(costCalculator.infrastructure)
})

// Real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('join-restaurant', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`)
  })
  
  socket.on('new-order', (data) => {
    socket.to(`restaurant-${data.restaurantId}`).emit('order-update', data)
  })
  
  socket.on('order-status-change', (data) => {
    socket.to(`restaurant-${data.restaurantId}`).emit('order-status-update', data)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.MCP_PORT || 3001

server.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`)
})