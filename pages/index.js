import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import frontPagePic from '../public/front-page.png'
import aboutPic from '../public/about.png'
import { Container, Col, Row, InputGroup, FormControl, Button } from 'react-bootstrap'

export default function Home() {
  return (
      <>
      <Head>
        <title>DevTree</title>
        <meta name="description" content="DevTree is a tree view just for developers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Row className={styles.main}>
        <Col sm={12} lg={true}><Image src={frontPagePic} /></Col>
        <Col>
          <div className={styles.title}>Dev-Tree</div>
          <div className={styles.description}>A simplified and trusting <b>analyser for a dev</b>. It is not so easy to judge a developer just by a resume or one or few links.</div>
          <div className={styles.description}>A developer is
        judged based on <b>Github, Resume and Linkedin</b> and to see them in an easy and readable form, our tool comes into play! 🚀</div>
        <InputGroup className={styles.input_grp}>
          <FormControl aria-label="With textarea" placeholder="name@example.com" />
          <InputGroup.Text>Enter your Email</InputGroup.Text>
        </InputGroup>
        <Button variant="primary" className={styles.subscribe_btn}>Subscribe for Newsletter</Button>
        </Col>
      </Row>

      <Row className={`${styles.main} ${styles.about}`} id="about">
        <Col sm={12} lg={true}><Image src={aboutPic} /></Col>
        <Col>
          <div className={styles.title}>What Are We?</div>
          <div className={styles.description}>We are 3 developers creating a product for developers to be used by the developers. This is a unique tool that will provide all the essential links for a developers.</div>
          <div className={styles.description}>A tree view is provided after the details of a developer are registered with the tool and when a user wants to save the developer's tree, it's 
          just one click to bookmark it.</div>
          <div className={styles.description}><b>The higher the bookmark count, the developer is more appreciated.</b></div>
        </Col>
      </Row>

    </>
  )
}
