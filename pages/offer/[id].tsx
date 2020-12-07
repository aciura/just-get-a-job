import { getAllJobIds, getJobOffer } from '../../services/jobService'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import { JobOffer } from '../../services/JobOffer'
import styles from '../../styles/JobOffer.module.scss'

export default function JobOfferPage({ offer }: { offer: JobOffer }) {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{offer.title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.jobOffer}>
        <button onClick={() => router.back()}>{'<'} Back</button>
        <pre>{offer.id}</pre>
        <h3>{offer.title}</h3>
        <p>{offer.company_name}</p>
        <Image src={offer.company_logo_url} width={'100%'} height={'100%'} />
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
