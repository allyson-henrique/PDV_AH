import React from 'react'
import { Server, Database, Smartphone, Globe, Shield, Zap, Cloud, Users, Package, BarChart3 } from 'lucide-react'

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Arquitetura do Sistema PDV</h1>
        
        {/* Main Architecture */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Arquitetura de Microserviços</h2>
          
          {/* Layer 1 - Client Layer */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-blue-600">Camada de Apresentação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* PWA Frontend */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Smartphone className="mr-2" size={24} />
                  <h4 className="font-semibold">Frontend PWA</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS + Framer Motion</li>
                  <li>• Service Workers</li>
                  <li>• IndexedDB</li>
                  <li>• Offline-First</li>
                </ul>
              </div>

              {/* Mobile Apps */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Smartphone className="mr-2" size={24} />
                  <h4 className="font-semibold">Apps Mobile</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• React Native (Futuro)</li>
                  <li>• iOS & Android</li>
                  <li>• Push Notifications</li>
                  <li>• Biometria</li>
                  <li>• Câmera QR Code</li>
                </ul>
              </div>

              {/* Admin Dashboard */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <BarChart3 className="mr-2" size={24} />
                  <h4 className="font-semibold">Dashboard Admin</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Analytics Avançado</li>
                  <li>• Relatórios BI</li>
                  <li>• Multi-tenant</li>
                  <li>• Configurações</li>
                  <li>• Auditoria</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="text-gray-500 text-sm">HTTPS / WebSocket</div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Layer 2 - API Gateway & Load Balancer */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-orange-600">Camada de Gateway</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Shield className="mr-2" size={24} />
                  <h4 className="font-semibold">API Gateway</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Rate Limiting</li>
                  <li>• Authentication</li>
                  <li>• Request Routing</li>
                  <li>• SSL Termination</li>
                  <li>• Monitoring</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Zap className="mr-2" size={24} />
                  <h4 className="font-semibold">Load Balancer</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• High Availability</li>
                  <li>• Auto Scaling</li>
                  <li>• Health Checks</li>
                  <li>• Failover</li>
                  <li>• CDN Integration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Layer 3 - Microservices */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-indigo-600">Camada de Microserviços</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* MCP Server */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Server className="mr-2" size={24} />
                  <h4 className="font-semibold">MCP Server</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Node.js + Express</li>
                  <li>• Socket.IO</li>
                  <li>• Cost Calculator</li>
                  <li>• Real-time Events</li>
                  <li>• Background Jobs</li>
                </ul>
              </div>

              {/* Order Service */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Package className="mr-2" size={24} />
                  <h4 className="font-semibold">Order Service</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Order Management</li>
                  <li>• Kitchen Display</li>
                  <li>• Status Tracking</li>
                  <li>• Customizations</li>
                  <li>• Queue Management</li>
                </ul>
              </div>

              {/* Payment Service */}
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Globe className="mr-2" size={24} />
                  <h4 className="font-semibold">Payment Service</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• PIX Integration</li>
                  <li>• Card Processing</li>
                  <li>• Split Payments</li>
                  <li>• Refunds</li>
                  <li>• Fraud Detection</li>
                </ul>
              </div>

              {/* Analytics Service */}
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <BarChart3 className="mr-2" size={24} />
                  <h4 className="font-semibold">Analytics Service</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Real-time Metrics</li>
                  <li>• ML Predictions</li>
                  <li>• Business Intelligence</li>
                  <li>• Custom Reports</li>
                  <li>• Data Warehouse</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Layer 4 - Data Layer */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-600">Camada de Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Database */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Database className="mr-2" size={24} />
                  <h4 className="font-semibold">Supabase DB</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• PostgreSQL</li>
                  <li>• Real-time Subscriptions</li>
                  <li>• Row Level Security</li>
                  <li>• Auto Backups</li>
                  <li>• Edge Functions</li>
                </ul>
              </div>

              {/* Cache Layer */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Zap className="mr-2" size={24} />
                  <h4 className="font-semibold">Redis Cache</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Session Storage</li>
                  <li>• Rate Limiting</li>
                  <li>• Pub/Sub Messaging</li>
                  <li>• Temporary Data</li>
                  <li>• Queue Management</li>
                </ul>
              </div>

              {/* File Storage */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-3">
                  <Cloud className="mr-2" size={24} />
                  <h4 className="font-semibold">File Storage</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Product Images</li>
                  <li>• Receipt PDFs</li>
                  <li>• Backup Files</li>
                  <li>• Static Assets</li>
                  <li>• CDN Distribution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* External Integrations */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Integrações Externas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Delivery</h4>
              <p className="text-sm">iFood, Uber Eats, Rappi</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Pagamentos</h4>
              <p className="text-sm">Mercado Pago, PagSeguro</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Fiscal</h4>
              <p className="text-sm">NFe.io, Focus NFe</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">Hardware</h4>
              <p className="text-sm">Impressoras, Balanças</p>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Fluxo de Dados</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Requisição do Cliente</span>
            </div>
            <div className="hidden md:block">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm">API Gateway</span>
            </div>
            <div className="hidden md:block">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
              <span className="text-sm">Microserviço</span>
            </div>
            <div className="hidden md:block">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Banco de Dados</span>
            </div>
            <div className="hidden md:block">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">Resposta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}