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

import NFTPreviewRenders from '@/components/NFTPreviewRenders'
import { useSession, useSignOut } from "@randombits/use-siwe";

import useSWR from 'swr'

const fetcher = ({url, queryParams}: {url: string, queryParams: string}) => {
  console.log(url);
  console.log(queryParams);
  return fetch(`${url}?${queryParams}`).then((res) => res.json());
}
  
  
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

const exportCSV = (exportData: { [key: string]: string | object | number | undefined }[]) => {

  const headers: string[] = Array.from(new Set( exportData.map((o: object) => Array.from(Object.keys(o))).flat() ))

  const csvString = `data:text/csv;chatset=utf-8,${encodeURIComponent(
    [headers, ...exportData.map((item: { [key: string]: string | object | number | undefined }) => {
      let i : Array<string> = []
      for(let h of headers){
        i.push(typeof(item?.[h]) == 'object' || typeof(item?.[h]) == 'number' ? encodeURIComponent(JSON.stringify(item?.[h])) : `${item?.[h] || ''}`)
      }
      return i.map(str => `"${str?.replace(/"/g, '\\"') || str}"`)
    })].map(e => e.join(",")).join("\r\n")

  )}`;
  const link = document.createElement("a");
  link.href = csvString;
  link.download = "editions.csv";

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

const zoomEmoji = (zoom: string) => {
  switch (zoom){
    case 'no': return '✅';
    case 'yes': return '🔎';
    default: return '❓'
  }
}

const notesEmoji = (zoom: string) => {
  switch (zoom){
    case 'true': return '📝';
    case 'false': return '📄';
    default: return '❓'
  }
}

const titleEmoji = (zoom: string) => {
  switch (zoom){
    case 'true': return '✅';
    case 'false': return '📛';
    default: return '❓'
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

const tierMax = (tier: string) => {
  switch(tier){
    case 'Gold': return 70;
    case 'Silver': return 153;
    case 'Black': return 210;
    default: return 0;
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

const zoomOrNot = (zoom: string) => {
  switch(zoom){
    case '100': return 'no';
    case '': return '';
    default: return 'yes';
  }
}


export default function Home({
  isConnected
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [queryObj, setQueryObj] = useState({filter: {}, sort: 'artist'})
  const [queryParams, setQueryParams] = useState('?sort=artist')
  const { data, error } = useSWR({url: '/api/editions', queryParams}, fetcher)

  const [nftData, setNftData] = useState([] as typeof dataDefault)

  const [filter, setFilter] = useState('')
  const [filterBy, setFilterBy] = useState('')

  const [initialized, setInitialized] = useState(false);
  const [inView, setInView] = useState(-1)

  const [viewIndex, setViewIndex] = useState(['1'])

  const [stats, setStats] = useState({
    zooms: {'no': 0, 'yes': 0, '': 0},
    tiers: {Gold: 0, Silver: 0, Black: 0},
    backgrounds: {fire: 0, earth: 0, water: 0, clouds: 0},
    foregrounds: {white: 0, black: 0},
    notes: {"true": 0, "false": 0},
    titles: {"true": 0, "false": 0}
  })

  const { isLoading, authenticated, address } = useSession();

  const { signOut, isLoading: isSignoutLoading } = useSignOut();


  useEffect(() => {
    console.log(nftData);
    console.log(data);
    if(nftData){
      setStats(nftData.reduce((accum: any, x) => {
        accum.notes[(!!x._notes).toString()] = accum.notes[(!!x._notes).toString()] ? accum.notes[(!!x._notes).toString()] + 1 : 1;
        accum.titles[(!!x._title).toString()] = accum.titles[(!!x._title).toString()] ? accum.titles[(!!x._title).toString()] + 1 : 1;
        accum.zooms[zoomOrNot(x?._zoom || '')] = accum.zooms[zoomOrNot(x?._zoom || '')] ? accum.zooms[zoomOrNot(x?._zoom || '')] + 1 : 1;
        accum.tiers[x._tier] = accum.tiers[x._tier] ? accum.tiers[x._tier] + 1 : 1;
        accum.backgrounds[x._background] = accum.backgrounds[x._background] ? accum.backgrounds[x._background] + 1 : 1;
        accum.foregrounds[x._foreground] = accum.foregrounds[x._foreground] ? accum.foregrounds[x._foreground] + 1 : 1;
        return accum;
      }, {notes: {"true": 0, "false": 0}, titles: {"true": 0, "false": 0}, zooms: {'no': 0, 'yes': 0, '': 0}, tiers: {Gold: 0, Silver: 0, Black: 0}, backgrounds: {fire: 0, earth: 0, water: 0, clouds: 0}, foregrounds: {white: 0, black: 0}}))
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
    setInView(viewIndex.indexOf(nftData.find((d:any)=>(d?._zoom == ''))?._id || '29') || 0)
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

  useEffect(()=> {
    console.log("filter", filter);
    console.log("filterBy", filterBy);
  }, [filter, filterBy])

  useEffect(() => {
    console.log("queryObj", queryObj);
    setQueryParams(new URLSearchParams({filter: JSON.stringify(queryObj.filter), sort: queryObj.sort}).toString())
    setInView(0)
  }, [queryObj])

  const updateQueryParams = (new_parameter: {filter?: {}, sort?: string}) => {
    if(!!new_parameter?.filter){
      setFilterBy(Object.keys(new_parameter?.filter)[0]);
    }
    if(!!new_parameter?.filter && !!new_parameter?.sort){
      setQueryObj((ev)=>({...ev, ...new_parameter}))
    }
    else if(!!new_parameter?.filter){
      setQueryObj(
        existingValues => ({
          ...existingValues,
          filter: new_parameter.filter || {}
        })
      )
    }
    else if(!!new_parameter?.sort){
      setQueryObj(
        existingValues => ({
          ...existingValues,
          sort: new_parameter.sort || ''
        })
      )
    }
  }

  const updateData = ({tid="", zoom="", t="", n="", tr=""}) => {
    setNftData(
      existingValues => (existingValues.map((ev) => {
          if (ev._id != tid){
            return ev;
          } else {
            return {
              ...ev,
              _zoom: zoom,
              _title: t,
              _tier: tr,
              _notes: n,
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
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>ZOOMS<br /> {Object.entries(stats.zooms).map(([t,n]) => (
            <span 
            style={{
              fontWeight: filterBy === '_zoom' && filter === t ? 'bold' : '',
              border: filterBy === '_zoom' && filter === t ? '1px dashed black' : ''
            }}
            onClick={
              ()=>{
                console.log(filter, filterBy)
                if(filterBy !== '_zoom' || filter !== t){
                  setFilter(t);
                  updateQueryParams({filter: {_zoom: t === "no" ? "100" : t === "yes" ? {$exists: true, $ne: "100"} :  {$not: {$regex: "\d*"}}}})
                } else {
                  setFilter('');
                  updateQueryParams({filter: {_id: {$exists: true}}})
                }
                
                }
              }
            key={`zoom_emoji_${t}`}>{zoomEmoji(t)} {n} </span>))} <br /></div>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>TIERS<br /> {Object.entries(stats.tiers).map(([t,n]) => (
            <span
            style={{
              fontWeight: filterBy === '_tier' && filter === t ? 'bold' : '',
              border: filterBy === '_tier' && filter === t ? '1px dashed black' : ''
            }}
            onClick={
              ()=>{
                console.log(filter, filterBy)
                if(filterBy !== '_tier' || filter !== t){
                  setFilter(t);
                  updateQueryParams({filter: {_tier: t}})
                } else {
                  setFilter('');
                  updateQueryParams({filter: {_id: {$exists: true}}})
                }
                
                }
              }
             key={`tier_emoji_${t}`}>{tierEmoji(t)} {n}/{tierMax(t)} </span>))} <br /></div>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>TITLES<br /> {Object.entries(stats.titles).map(([t,n]) => (<span key={`title_emoji_${t}`}>{titleEmoji(t)} {n} </span>))} <br /></div>
            <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>
              NOTES <br />
              {Object.entries(stats.notes).map(([t,n]) => (
                <span 
                  key={`notes_emoji_${t}`}
                  style={{
                    fontWeight: filterBy === '_notes' && filter === t ? 'bold' : '',
                    border: filterBy === '_notes' && filter === t ? '1px dashed black' : ''
                  }}
                  onClick={
                    ()=>{
                      console.log(filter, filterBy)
                      if(filterBy !== '_notes' || filter !== t){
                        setFilter(t);
                        updateQueryParams({filter: {_notes: t === "true" ? {$exists: true, $ne: ''} : {$not: {$exists: true, $ne: ''}}}})
                      } else {
                        setFilter('');
                        updateQueryParams({filter: {_id: {$exists: true}}})
                      }
                      
                      }
                    }
                  >{notesEmoji(t)} {n} </span>))}
              <br />
            </div>
            {/* <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>BACKGROUNDS<br /> {Object.entries(stats.backgrounds).map(([t,n]) => (<span key={`bemoji_${t}`}>{backgroundEmoji(t)} {n} </span>))}<br /></div> */}
            {/* <div style={{border: '1px solid black', padding: '2px', margin: '2px'}}>FOREGROUNDS<br /> {Object.entries(stats.foregrounds).map(([t,n]) => (<span key={`femoji_${t}`}>{foregroundEmoji(t)} {n} </span>))}</div> */}
          </div>
        </div>
        <div className="image_block">
        <h3 onClick={()=> {navigateTokens(-1)}}>&lt;</h3><select value={viewIndex[inView]} onChange={(e) => {
          setInView(viewIndex.indexOf(e.target.value));
        }}>
          {nftData.map((info) => {
            return (
              <option key={`opt_id_${info._id}`} value={info._id}>{info.artist} # {info._id} - {info._title} {tierEmoji(info._tier)}{backgroundEmoji(info._background)}{foregroundEmoji(info._foreground)}{zoomEmoji(zoomOrNot(info?._zoom || ''))}</option>
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
            <NFTPreviewRenders 
              title={info._title}
              tokenId={info._id}
              tier={info._tier as 'Gold' | 'Silver' | 'Black'}
              artist={info.artist}
              
              notes={info?._notes || ''}
              metadata={info._metadata}
              key={`preview_${info._id}`}
              handler={(tid: string, n:string, t: string, tr:string) => {
              updateData({tid, t, n, tr})
            }}></NFTPreviewRenders>
            </>
          )
        })}
        {isConnected && address && authorized(address) &&
        <>
        
        <button onClick={() => {exportData(nftData);}}>Export Data as JSON</button>
        <button onClick={() => {exportCSV(nftData);}}>Export Data as CSV</button>
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
