import Link from 'next/link'
import { JobOffer } from '../services/JobOffer'
import styles from './OfferCard.module.scss'

export default function OfferCard({ jobOffer }: { jobOffer: JobOffer }) {
  return (
    <Link href={`/offer/${encodeURIComponent(jobOffer.id)}`}>
      <a className={styles.card}>
        <h3>{jobOffer.title}</h3>
        <p>{jobOffer.company_name}</p>
        <p>
          {jobOffer.salary_from}-{jobOffer.salary_to}
          {jobOffer.salary_currency}
        </p>
        <p>{jobOffer.city}</p>
      </a>
    </Link>
  )
}
