import React from 'react'
import Head from 'next/head'
import OffersList from '../components/OffersList'
import { getAllJobOffers } from '../services/jobService'
import { propsify } from '../services/utils'
import styles from '../styles/Home.module.css'

export default function Home({ jobOffers }) {
  const [minSalary, setMinSalary] = React.useState(0)
  const [category, setCategory] = React.useState()
  const [buttons, setButtons] = React.useState([])
  React.useEffect(() => {
    const offerCategories = Array.from(
      new Set(jobOffers.map((job) => job.marker_icon)).keys(),
    )
    console.log('setButtons', offerCategories)
    setButtons(offerCategories)
  }, [jobOffers])

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
    <div className={styles.container}>
      <Head>
        <title>Just Join Corpo</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Just Join Corpo!</h1>
        <p className={styles.description}>Find your dream job</p>

        <div>
          <button onClick={() => setCategory(null)}>All</button>
          {buttons.map((category) => (
            <button key={category} onClick={() => setCategory(category)}>
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
      </main>

      <footer className={styles.footer}>
        <a
          href='https://cloudtech.pl'
          target='_blank'
          rel='noopener noreferrer'>
          Powered by Cloudtech.pl
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const jobOffers = await getAllJobOffers()
  return propsify({ jobOffers })
}
