import Link from 'next/link'
import styles from './OfferCard.module.scss'

export default function OfferCard({
  id,
  title,
  company_name,
  salary_from,
  salary_to,
  salary_currency,
}) {
  return (
    <Link href={`/offer/${encodeURIComponent(id)}`}>
      <a className={styles.card}>
        <h3>{title}</h3>
        <p>{company_name}</p>
        <p>
          {salary_from}-{salary_to}
          {salary_currency}
        </p>
      </a>
    </Link>
  )
}
