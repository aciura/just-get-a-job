import React from 'react'
import '../styles/globals.scss'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/App.module.scss'

function App({ Component, pageProps }) {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      setLoading(true)
    }
    const handleRouteChangeComplete = () => {
      setLoading(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeComplete)
    }
  }, [])

  return (
    <div key={router.route} className={styles.container}>
      <Head>
        <title>Just Get a Job</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Just Get a Job</h1>
        <p className={styles.description}>Find your dream job</p>
        {loading && <div className={styles.spinner} />}

        <Component {...pageProps} />
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

export default App
