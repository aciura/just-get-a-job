import { getAllJobIds, getJobOffer } from '../../services/jobService'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function JobOffer({ offer }) {
  const { id, title, company_name, company_logo_url } = offer
  const router = useRouter()
  return (
    <div>
      <button onClick={() => router.back()}>{'<'} Back</button>
      <pre>{id}</pre>
      <h3>{title}</h3>
      <p>{company_name}</p>
      <Image src={company_logo_url} width={'100%'} height={'100%'} />
    </div>
  )
}

export async function getStaticPaths() {
  const jobIds = await getAllJobIds()
  const params = jobIds.map((id) => ({ params: { id } }))
  return {
    paths: params,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  console.log('getStaticProps', params)
  const offer = await getJobOffer(id)
  if (offer) {
    return {
      props: { offer },
    }
  }
  return {
    notFound: true,
  }
}
