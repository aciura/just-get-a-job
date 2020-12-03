import React, { useCallback, useMemo } from 'react'
import OffersList from '../components/OffersList'
import { getAllJobOffers } from '../services/jobService'
import { propsify } from '../services/utils'
import { useRouter } from 'next/router'
import Slider from 'react-rangeslider'
import dynamic from 'next/dynamic'

import 'react-rangeslider/lib/index.css'
import styles from '../styles/Home.module.scss'

export default function Home({ jobOffers, offerCategories }) {
  const [minSalary, setMinSalary] = React.useState(0)

  const router = useRouter()

  const handleMinSalaryChange = (value) => {
    const minSalary = Number(value)
    setMinSalary(minSalary)
  }

  const displayedJobs = jobOffers.filter((job) => job.salary_to > minSalary)

  const Map = useMemo(
    () =>
      dynamic(() => import('../components/Map'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    [],
  )

  return (
    <div>
      <Map jobOffers={displayedJobs} />

      <div>
        <button onClick={() => router.push('/')}>
          <span>ALL</span>
        </button>
        {offerCategories.map((category) => (
          <button
            key={category}
            onClick={() => router.push(`/filter/${category}`)}>
            {category}
          </button>
        ))}
      </div>

      <div style={{ width: '50%' }}>
        <label htmlFor='minSalary'>Min Salary {minSalary}</label>
        <Slider
          value={minSalary}
          min={0}
          max={30000}
          step={1000}
          tooltip={false}
          onChange={handleMinSalaryChange}
        />
      </div>

      <div className={styles.grid}>
        <OffersList cards={displayedJobs} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const jobOffers = await getAllJobOffers()
  const offerCategories = Array.from(
    new Set(jobOffers.map((job) => job.marker_icon)).keys(),
  )
  const params = offerCategories.map((category) => ({
    params: {
      slug: ['filter', category],
    },
  }))
  return {
    paths: [...params, { params: { slug: [] } }],
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const jobOffers = await getAllJobOffers()
  const offerCategories = Array.from(
    new Set(jobOffers.map((job) => job.marker_icon)).keys(),
  )
  const { slug } = context.params
  console.log('getStaticProps', { slug })
  const filterByCategory = (job) =>
    !slug || slug.length < 2 || job.marker_icon === slug[1]
  return {
    revalidate: 60 /*sec*/,
    ...propsify({
      jobOffers: jobOffers.filter((job) => filterByCategory(job)),
      offerCategories,
    }),
  }
}
