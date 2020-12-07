import { getAllJobIds, getJobOffer } from '../../services/jobService'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import { JobOffer, ProgrammingSkill } from '../../services/JobOffer'
import styles from '../../styles/JobOffer.module.scss'
import React, { Fragment, useMemo } from 'react'
import dynamic from 'next/dynamic'

function Skill({ skill }: { skill: ProgrammingSkill }) {
  return (
    <li>
      {skill.name}{' '}
      {[...Array(skill.level)].map((_, i) => (
        <Fragment key={i}>⭐</Fragment>
      ))}
    </li>
  )
}

export default function JobOfferPage({ offer }: { offer: JobOffer }) {
  const router = useRouter()

  const Map = useMemo(
    () =>
      dynamic(() => import('../../components/Map'), {
        loading: () => (
          <div className={styles.mapPlaceholder}>Loading map...</div>
        ),
        ssr: false,
      }),
    [],
  )

  return (
    <>
      <Head>
        <title>{offer.title}</title>
      </Head>

      <div className={styles.jobOffer}>
        <div className={styles.details}>
          <button onClick={() => router.back()}>{'<'}Back</button>

          <h2>{offer.title}</h2>
          <a href={offer.company_url}>
            <Image
              src={offer.company_logo_url}
              width={'100%'}
              height={'100%'}
            />
            <h3>{offer.company_name}</h3>
          </a>
          <p>
            Address: {offer.street}, {offer.city}, {offer.country_code}
          </p>
          <p>Employment type: {offer.employment_type}</p>
          <p>
            Salary: {offer.salary_from} - {offer.salary_to}{' '}
            {offer.salary_currency}
          </p>

          <p>
            Requirements: {offer.experience_level}
            <ul className={styles.skills}>
              {offer.skills.map((skill) => (
                <Skill skill={skill} />
              ))}
            </ul>
          </p>
        </div>

        <Map
          className={styles.map}
          jobOffers={[offer]}
          center={{ ...offer }}
          zoomLevel={10}
        />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const jobIds = await getAllJobIds()
  const params = jobIds.map((id) => ({ params: { id } }))
  return {
    paths: params,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  console.log('getStaticProps', params)

  const jobOfferId = Array.isArray(id) ? id[0] : id
  const offer = await getJobOffer(jobOfferId)

  if (offer) {
    return {
      props: { offer },
    }
  }
  return {
    notFound: true,
  }
}
