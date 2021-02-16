import 'bootstrap/dist/css/bootstrap.css'

import Header from '../components/header'
import buildClient from '../services/build-client'

function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
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
    // Data passed into child components
    pageProps = await Component.getInitialProps(
      ctx,
      client, // Client object. Don't have to manually import and invoke this object again in child component
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data
  }
}

export default AppComponent