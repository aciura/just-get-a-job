import React from 'react'
import OffersList from '../components/OffersList'
import { getAllJobOffers } from '../services/jobService'
import { propsify } from '../services/utils'
import { useRouter } from 'next/router'

import styles from '../styles/Home.module.css'

export default function Home({ jobOffers, offerCategories }) {
  const [minSalary, setMinSalary] = React.useState(0)
  const [category, setCategory] = React.useState()

  const router = useRouter()
  console.log('router.query', router.query)

  const handleMinSalaryChange = (e) => {
    const minSalary = Number(e.target.value)
    setMinSalary(minSalary)
  }

  const filterJobs = () =>
    jobOffers.filter(
      (job) =>
        job.salary_to > minSalary &&
        (!category || job?.marker_icon === category),
    )

  return (
    <>
      <div>
        <button onClick={() => setCategory(null)}>All</button>
        {offerCategories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setCategory(category)
              router.push(`/filter/${category}`, undefined, { shallow: true })
            }}>
            {category}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor='minSalary'>Min Salary</label>
        <input
          id='minSalary'
          value={minSalary}
          onChange={handleMinSalaryChange}
        />
      </div>

      <div className={styles.grid}>
        <OffersList cards={filterJobs(jobOffers)} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const jobOffers = await getAllJobOffers()
  const offerCategories = Array.from(
    new Set(jobOffers.map((job) => job.marker_icon)).keys(),
  )
  return propsify({ jobOffers, offerCategories })
}
