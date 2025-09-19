import React, { useState, useEffect } from 'react'
import { Server, Database, Globe, Shield, Zap, Cloud, Monitor, DollarSign } from 'lucide-react'

interface ArchitectureComponent {
  id: string
  type: string
  name: string
  technology: string
  position: { x: number; y: number }
  properties: Record<string, any>
}

interface Connection {
  from: string
  to: string
  type: string
}

interface ArchitectureData {
  components: ArchitectureComponent[]
  connections: Connection[]
  metadata: {
    title: string
    version: string
    created: string
    estimatedCost: {
      monthly: number
      annual: number
    }
  }
}

export const AWSArchitectureViewer: React.FC = () => {
  const [architecture, setArchitecture] = useState<ArchitectureData | null>(null)
  const [costs, setCosts] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'architecture' | 'costs' | 'deployment' | 'security'>('architecture')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchitectureData()
  }, [])

  const fetchArchitectureData = async () => {
    try {
      setLoading(true)
      const [archResponse, costsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/architecture/pdv'),
        fetch('http://localhost:3001/api/architecture/costs')
      ])
      
      const archData = await archResponse.json()
      const costsData = await costsResponse.json()
      
      setArchitecture(archData)
      setCosts(costsData)
    } catch (error) {
      console.error('Erro ao carregar dados da arquitetura:', error)
    } finally {
      setLoading(false)
    }
  }

  const getComponentIcon = (type: string) => {
    const iconProps = { size: 24, className: "text-white" }
    
    switch (type) {
      case 'frontend':
        return <Globe {...iconProps} />
      case 'api-gateway':
        return <Shield {...iconProps} />
      case 'microservice':
        return <Server {...iconProps} />
      case 'database':
        return <Database {...iconProps} />
      case 'cache':
        return <Zap {...iconProps} />
      case 'storage':
        return <Cloud {...iconProps} />
      default:
        return <Monitor {...iconProps} />
    }
  }

  const getComponentColor = (type: string) => {
    const colors = {
      frontend: 'bg-blue-500',
      'api-gateway': 'bg-orange-500',
      microservice: 'bg-indigo-500',
      database: 'bg-gray-600',
      cache: 'bg-red-500',
      storage: 'bg-blue-600'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AWS Architecture Viewer</h1>
        <p className="text-gray-600">Visualização da arquitetura do sistema PDV na AWS</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'architecture', label: 'Arquitetura' },
              { id: 'costs', label: 'Custos' },
              { id: 'deployment', label: 'Deploy' },
              { id: 'security', label: 'Segurança' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Architecture Tab */}
      {activeTab === 'architecture' && architecture && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{architecture.metadata.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Versão: {architecture.metadata.version}</span>
              <span>Criado: {new Date(architecture.metadata.created).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                Custo estimado: R$ {architecture.metadata.estimatedCost.monthly}/mês
              </span>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="relative bg-gray-50 rounded-lg p-8 min-h-96">
            <svg width="100%" height="400" className="absolute inset-0">
              {/* Connections */}
              {architecture.connections.map((conn, index) => {
                const fromComp = architecture.components.find(c => c.id === conn.from)
                const toComp = architecture.components.find(c => c.id === conn.to)
                
                if (!fromComp || !toComp) return null
                
                return (
                  <line
                    key={index}
                    x1={fromComp.position.x + 60}
                    y1={fromComp.position.y + 30}
                    x2={toComp.position.x + 60}
                    y2={toComp.position.y + 30}
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeDasharray={conn.type === 'https' ? '5,5' : '0'}
                    markerEnd="url(#arrowhead)"
                  />
                )
              })}
              
              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6B7280"
                  />
                </marker>
              </defs>
            </svg>

            {/* Components */}
            {architecture.components.map(component => (
              <div
                key={component.id}
                className="absolute"
                style={{
                  left: component.position.x,
                  top: component.position.y
                }}
              >
                <div className={`${getComponentColor(component.type)} rounded-lg p-4 shadow-lg min-w-32`}>
                  <div className="flex items-center mb-2">
                    {getComponentIcon(component.type)}
                    <span className="ml-2 text-white font-medium text-sm">
                      {component.name}
                    </span>
                  </div>
                  <div className="text-xs text-white opacity-90">
                    {component.technology}
                  </div>
                </div>
                
                {/* Properties tooltip */}
                <div className="mt-2 bg-white rounded shadow-md p-2 text-xs max-w-48">
                  {Object.entries(component.properties).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {activeTab === 'costs' && costs && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Breakdown de Custos AWS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(costs.breakdown).map(([category, items]) => (
              <div key={category} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                <div className="space-y-2">
                  {Object.entries(items as Record<string, number>).map(([service, cost]) => (
                    <div key={service} className="flex justify-between text-sm">
                      <span>{service}</span>
                      <span className="font-medium">${cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Mensal</span>
              <span className="text-2xl font-bold text-blue-600">
                ${costs.total.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Estimativa baseada na região us-east-1
            </p>
          </div>
        </div>
      )}

      {/* Deployment Tab */}
      {activeTab === 'deployment' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Pipeline de Deploy</h2>
          <div className="space-y-6">
            {['Development', 'Staging', 'Production'].map(env => (
              <div key={env} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">{env}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-medium">Frontend</div>
                    <div className="text-sm text-gray-600">
                      {env === 'Development' ? 'localhost:5173' : 
                       env === 'Staging' ? 'staging.pdv.netlify.app' : 
                       'pdv-allyson.netlify.app'}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-medium">MCP Server</div>
                    <div className="text-sm text-gray-600">
                      {env === 'Development' ? 'localhost:3001' : 
                       env === 'Staging' ? 'staging-mcp.railway.app' : 
                       'mcp.pdv-allyson.com'}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium">Database</div>
                    <div className="text-sm text-gray-600">
                      {env === 'Development' ? 'dev.supabase.co' : 
                       env === 'Staging' ? 'staging.supabase.co' : 
                       'prod.supabase.co'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Camadas de Segurança</h2>
          <div className="space-y-4">
            {[
              { name: 'Edge Security', components: ['CDN', 'DDoS Protection', 'WAF'], color: 'bg-red-500' },
              { name: 'Application Security', components: ['JWT Authentication', 'Rate Limiting', 'Input Validation'], color: 'bg-orange-500' },
              { name: 'Data Security', components: ['Encryption at Rest', 'Encryption in Transit', 'Row Level Security'], color: 'bg-blue-500' },
              { name: 'Infrastructure Security', components: ['VPC', 'Security Groups', 'IAM Roles'], color: 'bg-gray-600' }
            ].map(layer => (
              <div key={layer.name} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-4 h-4 rounded ${layer.color} mr-3`}></div>
                  <h3 className="font-semibold">{layer.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map(component => (
                    <span
                      key={component}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}