export async function getAllJobOffers() {
  const url = `https://test.justjoin.it/offers`
  console.log('GET', url)
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// TODO: Add new REST API returning offer IDs
export async function getAllJobIds() {
  const offers = await getAllJobOffers()
  return offers?.map((offer) => offer.id)
}

export async function getJobOffer(id) {
  const encodedId = encodeURIComponent(id)
  const offers = await getAllJobOffers()
  return offers?.find((offer) => offer.id === encodedId || offer.id === id)
}
