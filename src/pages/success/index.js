import React, { useEffect, useState } from 'react'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'

const baseURL = 'https://snugg-api.herokuapp.com/api/v01'

const Success = () => {
  const [error, setError] = useState()
  const [header, setHeader] = useState('Updating subscription...')
  const router = useRouter()
  const { query } = router
  const { ref, id, auth, type } = query

  const updateUser = async () => {
    setError()
    try {
      const body = {
        subscription_id: type,
        expiration_date: new Date(moment(Date.now()).add(1, 'M'))
      }
      const res = await axios.put(`${baseURL}/user/update/${id}`, body, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      })
      if (res?.status === 200) {
        setHeader('Thank you for subscribing!')
      } else {
        setError('Something went wrong. Please contact Snugg Neighborhood.')
      }
      router.replace({ query: {
        ...query,
        auth: null,
        id: null
      } })
    } catch (err) {
      console.log(err)
      setError('Something went wrong. Please contact Snugg Neighborhood.')
    }
  }

  useEffect(() => {
    if (id && auth && type && ref) {
      updateUser()
    }
  }, [query])

  return (
    <div className={styles.page}>
      <Head>
        <title>Snugg Neighborhood Payment</title>
      </Head>
      <div className={styles.content}>
        {ref ? (
          <>
            <p className={styles.header}>{header}</p>
            <p>Please save your reference number:</p>
            <p className={styles.referenceNum}>{ref}</p>
            <p className={styles.redirecting}><strong>Please don&#39;t close this tab and the app to complete the transaction.</strong></p>
            {/* <p className={styles.redirecting}>Redirecting you back to the app</p>
            <p className={styles.clickHere}>Click here if you aren&#39;t redirected</p> */}
          </>
        ) : (
          <>
            <p className={styles.header}>Reference number is not valid</p>
            <p className={styles.redirecting}>Please try go back to the app and try again</p>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

export default Success