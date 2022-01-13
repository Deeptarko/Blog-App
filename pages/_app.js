import '../styles/globals.css'

import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil";
import Navbar from '../components/Navbar';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
       
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}

