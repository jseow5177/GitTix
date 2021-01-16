import 'bootstrap/dist/css/bootstrap.css'

import Header from '../components/header'
import buildClient from '../services/build-client'

function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  // The object passed into getInitialProps in the top-level custom component is different from pages
  // The actual context object is nested inside a ctx property
  const client = buildClient(ctx)
  const { data } = await client.get('/api/users/currentuser') // Data used by AppComponent

  let pageProps = {}
  if (Component.getInitialProps) {
    // Manually invoke getInitialProps of children pages
    pageProps = await Component.getInitialProps(ctx) // Data passed into child components
  }

  return {
    pageProps,
    ...data
  }
}

export default AppComponent