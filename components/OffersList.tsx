import { JobOffer } from '../services/JobOffer'
import OfferCard from './OfferCard'

export default function OffersList({ cards }: { cards: JobOffer[] }) {
  return (
    <>
      {cards.map((card) => (
        <OfferCard key={card.id} jobOffer={card} />
      ))}
    </>
  )
}
