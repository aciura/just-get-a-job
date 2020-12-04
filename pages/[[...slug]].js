import React, { useMemo } from 'react'
import OffersList from '../components/OffersList'
import { getAllJobOffers } from '../services/jobService'
import { propsify } from '../services/utils'
import { useRouter } from 'next/router'
import Slider from 'react-rangeslider'
import dynamic from 'next/dynamic'

import 'react-rangeslider/lib/index.css'
import styles from '../styles/App.module.scss'

export default function Home({ jobOffers, offerCategories }) {
  const [minSalary, setMinSalary] = React.useState(0)
  const sliderRef = React.useRef()

  const router = useRouter()

  let tempSliderValue = 0
  const handleChangeComplete = (e) => {
    setMinSalary(tempSliderValue)
  }
  const handleMinSalaryChange = (value) => {
    tempSliderValue = Number(value)
  }

  const displayedJobs = jobOffers.filter((job) => job.salary_to > minSalary)
  displayedJobs.sort((job1, job2) => job2.salary_to - job1.salary_to)

  const Map = useMemo(
    () =>
      dynamic(() => import('../components/Map'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    [],
  )

  return (
    <div className={styles.home}>
      <Map jobOffers={displayedJobs} />
      <div className={styles.slider}>
        <label htmlFor='minSalary'>Min Salary {minSalary}</label>
        <Slider
          ref={sliderRef}
          value={minSalary}
          min={0}
          max={30000}
          step={1000}
          tooltip={true}
          onChange={handleMinSalaryChange}
          onChangeComplete={handleChangeComplete}
        />
      </div>
      <div className={styles.categories}>
        <button onClick={() => router.push('/')}>
          <span>ALL</span>
        </button>
        {offerCategories.map(([category, count]) => (
          <button
            style={{
              fontSize: `${Math.max(12, count / 2)}px`,
              transform: `rotate(${Math.ceil(Math.random() * 10) - 5}deg)`,
            }}
            key={category}
            onClick={() => router.push(`/filter/${category}`)}>
            <span>{category}</span>
            &nbsp;
            <span>{count}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {!displayedJobs?.length && <span>No job offers matching filter</span>}
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
    jobOffers
      .map((job) => job.marker_icon)
      .reduce((map, category) => {
        const catCount = map.get(category)
        if (catCount) map.set(category, catCount + 1)
        else map.set(category, 1)
        return map
      }, new Map()),
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
