import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Building2, CheckCircle, MessageSquare, Star } from 'lucide-react'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/shared/ui/Button'
import { MetricCard } from './components/MetricCard'

interface Metrics {
  total: number
  active: number
  inquiries: number
  featured: number
}

export function Component() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    async function loadMetrics() {
      const [total, active, inquiries, featured] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('featured', true),
      ])

      setMetrics({
        total: total.count ?? 0,
        active: active.count ?? 0,
        inquiries: inquiries.count ?? 0,
        featured: featured.count ?? 0,
      })
    }

    loadMetrics()
  }, [])

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl text-text-primary">Panel de administración</h1>
          <p className="text-text-secondary text-sm font-sans capitalize">{today}</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/admin/propiedades/nueva')}
        >
          Nueva propiedad
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <MetricCard
          icon={Building2}
          label="Total propiedades"
          value={metrics?.total ?? null}
        />
        <MetricCard
          icon={CheckCircle}
          label="Propiedades activas"
          value={metrics?.active ?? null}
        />
        <MetricCard
          icon={MessageSquare}
          label="Consultas recibidas"
          value={metrics?.inquiries ?? null}
        />
        <MetricCard
          icon={Star}
          label="Propiedades destacadas"
          value={metrics?.featured ?? null}
        />
      </div>
    </div>
  )
}
