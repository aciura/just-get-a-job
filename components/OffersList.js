import OfferCard from './OfferCard'

export default function OffersList({ cards }) {
  return cards.map((card) => <OfferCard key={card.id} {...card} />)
}
