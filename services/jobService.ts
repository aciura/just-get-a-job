import { JobCategoryWithCount, JobOffer } from './JobOffer'
import fs from 'fs'
import path from 'path'

export async function getAllJobOffers(): Promise<JobOffer[]> {
  return getAllJobOffersFromFile()
  // const url = `https://test.justjoin.it/offers`
  // console.log('GET', url)
  // try {
  //   const response = await fetch(url)
  //   const data = await response.json()
  //   return data as JobOffer[]
  // } catch (error) {
  //   console.error(error)
  //   return []
  // }
}

async function getAllJobOffersFromFile() {
  const mockApiDir = path.join(process.cwd(), 'services')
  const fullPath = path.join(mockApiDir, 'mock-api.json')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  console.log(new Date(), 'READ all job offers', fullPath)
  return JSON.parse(fileContents)
}

// TODO: Add new REST API returning only offer IDs
export async function getAllJobIds(): Promise<string[]> {
  const offers = await getAllJobOffers()
  return offers?.map((offer) => offer.id)
}

export async function getJobOffer(id: string): Promise<JobOffer> {
  const encodedId = encodeURIComponent(id)
  const offers = await getAllJobOffers()
  return offers?.find((offer) => offer.id === encodedId || offer.id === id)
}

export function getJobCategoriesWithCount(
  jobOffers: JobOffer[],
): JobCategoryWithCount[] {
  const offerCategories: JobCategoryWithCount[] = []

  jobOffers
    .map((job) => job.marker_icon)
    .reduce((map, category) => {
      const catCount = map.get(category)
      if (catCount) map.set(category, catCount + 1)
      else map.set(category, 1)
      return map
    }, new Map())
    .forEach((count, category) => offerCategories.push({ category, count }))

  return offerCategories.sort(compareCategories)
}

function compareCategories(
  cat1: JobCategoryWithCount,
  cat2: JobCategoryWithCount,
) {
  if (cat1.category < cat2.category) return -1
  if (cat1.category > cat2.category) return 1
  return 0
}
