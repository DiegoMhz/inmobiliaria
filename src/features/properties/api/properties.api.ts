import { propertiesService } from './properties.service'

export function listFeaturedProperties() {
  return propertiesService.getFeatured(6)
}
