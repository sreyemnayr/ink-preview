import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

import clientPromise from '../lib/mongodb'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

import { useState, useEffect } from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit';

import dataDefault from '@/data/editions.json'

import NFTPreview from '@/components/NFTPreview'
import { useSession, useSignOut } from "@randombits/use-siwe";

import useSWR from 'swr'

const fetcher = (...args: Parameters<typeof fetch>) => 
    fetch(...args).then((res) => res.json());
  
const inter = Inter({ subsets: ['latin'] })

const exportData = (exportData: any) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(exportData)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "editions.json";

  link.click();
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  // const address = token?.sub ?? null;

  

  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

const foregroundEmoji = (fg: string) => {
  switch (fg){
    case 'white': return '⬜';
    case 'black': return '⬛';
    default: return '❗'
  }
}

const backgroundEmoji = (bg: string) => {
  switch (bg){
    case 'fire': return '🔥';
    case 'water': return '🌊';
    case 'earth': return '⛰️';
    case 'clouds': return '☁️';
    default: return '❗'
  }
}

const tierEmoji = (tier: string) => {
  switch(tier){
    case 'Gold': return '🥇';
    case 'Silver': return '🥈';
    case 'Black': return '🥉';
    default: return '❗';
  }
}

const authorized = (address: string | undefined) => {
  if(!address){
    return false;
  }
  switch(address.toLowerCase()){
    case '0x0228269E34fe6C6d7B1A679Dc11E4f069f984dfb'.toLowerCase(): return true;
    case '0x5f39F16077297Ed16Fd06B1A5Fc6Cee870C30468'.toLowerCase(): return true;
    case '0x3D2198fC3907e9D095c2D973D7EC3f42B7C62Dfc'.toLowerCase(): return true;
    default: return false;
  }
}


export default function Home({
  isConnected
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { data, error } = useSWR('/api/editions', fetcher)

  const [nftData, setNftData] = useState([] as typeof dataDefault)

  const [initialized, setInitialized] = useState(false);
  const [inView, setInView] = useState(-1)

  const [viewIndex, setViewIndex] = useState(['1'])

  const [stats, setStats] = useState({tiers: {Gold: 0, Silver: 0, Black: 0}, backgrounds: {fire: 0, earth: 0, water: 0, clouds: 0}, foregrounds: {white: 0, black: 0}})

  const { isLoading, authenticated, address } = useSession();

  const { signOut, isLoading: isSignoutLoading } = useSignOut();


  useEffect(() => {
    console.log(nftData);
    console.log(data);
    if(nftData){
      setStats(nftData.reduce((accum: any, x) => {
        accum.tiers[x._tier] = accum.tiers[x._tier] ? accum.tiers[x._tier] + 1 : 1;
        accum.backgrounds[x._background] = accum.backgrounds[x._background] ? accum.backgrounds[x._background] + 1 : 1;
        accum.foregrounds[x._foreground] = accum.foregrounds[x._foreground] ? accum.foregrounds[x._foreground] + 1 : 1;
        return accum;
      }, {tiers: {Gold: 0, Silver: 0, Black: 0}, backgrounds: {fire: 0, earth: 0, water: 0, clouds: 0}, foregrounds: {white: 0, black: 0}}))
    }
  }, [nftData, data]);

  useEffect(() => {
    console.log(data);
    if(data){
      setNftData(data);
    }
  }, [data])

  useEffect(() => {
      setViewIndex(nftData.map((d:any) => (d._id)))
  }, [nftData])

  useEffect(() => {
    if(viewIndex.length > 0 && nftData.length > 0 && !initialized){
    setInView(viewIndex.indexOf(nftData.find((d:any)=>(d._background == '' && d._foreground == ''))?._id || '') || 0)
    setInitialized(true)
    }
  }, [viewIndex, nftData, initialized])

  const navigateTokens = (move = 1) => {
    if (move < 0){
      if(inView == 0){
        setInView(nftData.length - 1)
      } else {
        setInView(inView + move)
      }
    } else {
      if (inView == nftData.length - 1) {
        setInView(0)
      } else {
        setInView(inView + move)
      }
    }
    
  }

  const updateData = ({tid="", bg="", fg="", t="", tr=""}) => {
    setNftData(
      existingValues => (existingValues.map((ev) => {
          if (ev._id != tid){
            return ev;
          } else {
            return {
              ...ev,
              _foreground: fg,
              _background: bg,
              _title: t,
              _tier: tr
            }
          }
        }))
        )
  }

  return (
    <>
      <Head>
        <title>Order of Ink Art Preview</title>
        <meta name="description" content="Generated by Ryan Meyers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className={styles.main}>
        {isConnected && address && authorized(address) && (
          <>
          <div style={{textAlign: 'center'}}>
          <div style={{display: 'flex'}}>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>TIERS<br /> {Object.entries(stats.tiers).map(([t,n]) => (<span key={`temoji_${t}`}>{tierEmoji(t)} {n} </span>))} <br /></div>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>BACKGROUNDS<br /> {Object.entries(stats.backgrounds).map(([t,n]) => (<span key={`bemoji_${t}`}>{backgroundEmoji(t)} {n} </span>))}<br /></div>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>FOREGROUNDS<br /> {Object.entries(stats.foregrounds).map(([t,n]) => (<span key={`femoji_${t}`}>{foregroundEmoji(t)} {n} </span>))}
            </div>
          </div>
        </div>
        <div className="image_block">
        <h3 onClick={()=> {navigateTokens(-1)}}>&lt;</h3><select value={viewIndex[inView]} onChange={(e) => {
          setInView(viewIndex.indexOf(e.target.value));
        }}>
          {nftData.map((info) => {
            return (
              <option key={`opt_${info._id}`} value={info._id}>{info.artist} # {info._id} - {info._title} {tierEmoji(info._tier)}{backgroundEmoji(info._background)}{foregroundEmoji(info._foreground)}</option>
            )
          }) }
        </select>
        <h3 onClick={()=> {navigateTokens(1)}}>&gt;</h3>
        </div>
        </>
        )}
        
        { // isConnected && address && authorized(address) && Object.entries(nftData).sort((a,b) => (a[1].artist < b[1].artist ? -1 : (a[1].artist > b[1].artist ? 1 : 0))).filter(([tokenId, info]) => tokenId == inView).map(([tokenId, info]) => {
          isConnected && address && authorized(address) && nftData.filter((info) => info._id == viewIndex[inView]).map((info) => {
          return(
            <>
            <NFTPreview 
              title={info._title}
              tokenId={info._id}
              tier={info._tier}
              artist={info.artist}
              background_selected={info._background}
              foreground_selected={info._foreground}
              metadata={info._metadata}
              key={`preview_${info._id}`}
              handler={(tid: string, bg: string, fg: string, t: string, tr:string) => {
              updateData({tid, bg, fg, t, tr})
            }}></NFTPreview>
            </>
          )
        })}
        {isConnected && address && authorized(address) &&
        <>
        
        <button onClick={() => {exportData(nftData);}}>Export Data</button>
        <button onClick={() => {setNftData(JSON.parse(localStorage.getItem("editions") || JSON.stringify(nftData)))}}>Recover Session</button>
        <button onClick={() => {signOut();}} disabled={isSignoutLoading}>Sign Out</button>
        </>
        }
        {!isConnected && 
          <code>Database Not Connected</code>
        }
        {!address &&
            <ConnectButton />
        }
        {
          address && !authorized(address) &&
          <><h3>Not authorized</h3>
          <button onClick={() => {signOut();}} disabled={isSignoutLoading}>Sign Out</button>
          </>
        }
        
      </main>
    </>
  )
}
