import Header from './Header.js'
import Footer from './Footer.js'
import { Container } from 'react-bootstrap'
import styles from '../styles/Home.module.css'

const Layout = ({ children }) => {
  return (
    <>
    <Header />
    <Container className={styles.container}>
      {children}
      <Footer />
    </Container>
    </>
  )
}

export default Layout
