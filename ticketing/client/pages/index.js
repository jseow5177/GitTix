import buildClient from '../services/build-client'

function Home({ currentUser }) {

  return (
    <h1>
      {currentUser ? 'You are signed in' : 'You are not signed in'}
    </h1>
  )
}

Home.getInitialProps = async (context) => {
  return {}
}

export default Home