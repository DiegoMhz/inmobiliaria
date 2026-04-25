import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MapPin } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

const PROPERTY_TYPES = [
  { value: '', label: 'Todas' },
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'penthouse', label: 'Penthouse' },
]

const BEDROOMS = [
  { value: '', label: 'Cualquiera' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

export function SearchBar() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (type) params.set('type', type)
    if (bedrooms) params.set('bedrooms', bedrooms)

    const query = params.toString()
    navigate(query ? `/propiedades?${query}` : '/propiedades')
  }

  const selectClass = cn(
    'bg-transparent border-0 outline-none text-body text-text-primary',
    'flex-1 cursor-pointer appearance-none',
  )

  return (
    <div className="w-full bg-surface/80 backdrop-blur-[10px] border border-border">
      <div className="flex flex-col md:flex-row">
        {/* Location */}
        <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-border flex-1">
          <MapPin size={16} className="text-accent shrink-0" />
          <input
            type="text"
            placeholder="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-transparent outline-none text-body text-text-primary placeholder:text-text-tertiary flex-1 font-sans"
          />
        </div>

        {/* Type */}
        <div className="flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-border min-w-[160px]">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
            aria-label="Tipo de propiedad"
          >
            {PROPERTY_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className="flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-border min-w-[160px]">
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={selectClass}
            aria-label="Habitaciones"
          >
            {BEDROOMS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="px-4 py-3 flex items-center">
          <Button variant="primary" size="md" onClick={handleSearch} className="w-full md:w-auto">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}
