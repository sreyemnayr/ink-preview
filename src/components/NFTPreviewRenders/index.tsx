import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import handler from '@/pages/api/hello';

const TIER_SIZES = {
  'Gold': 1,
  'Silver': 8,
  'Black': 15
}

const updateToken = ({tid, data}: {tid: string, data: any}) => {
  return fetch(`/api/editions/${tid}`, {method: 'POST', body: JSON.stringify(data)}).then((res) => res.json());
}

export interface INFTPreviewProps {
  tokenId: string;
  artist: string;
  title: string;
  tier: 'Gold' | 'Silver' | 'Black';
  notes?: string;
  metadata?: any;
  handler: any;
}

const NFTPreviewRenders = ({
  tokenId,
  artist,
  title,
  tier,
  notes = "",
  metadata,
  handler
}: INFTPreviewProps) => {
  const [editionSelected, setEditionSelected] = useState(1);
  const [notesSelected, setNotesSelected] = useState(notes);

  const [artIdSelected, setArtIdSelected] = useState(Number(tokenId)*1000);
  
  const [titleSelected, setTitle] = useState(title);
  const [tierSelected, setTier] = useState(tier); 
  
  
  useEffect(() => {
    if(title != titleSelected || tier != tierSelected || notes != notesSelected){
      handler(tokenId, notes, titleSelected, tierSelected);
    }
  }, [tier, tierSelected, title, titleSelected, tokenId, handler, notes, notesSelected])

  useEffect(() => {
    setArtIdSelected((Number(tokenId)*1000) + editionSelected);
  }, [editionSelected])

  return (
    <>
    <h2 key={`h2_${tokenId}`}>{artist} # {tokenId}
    <button key={`${tokenId}_save`} onClick={()=>{
      updateToken({tid: tokenId, data: {_artId: editionSelected, _notes: notesSelected, _title: titleSelected, _tier: tierSelected}})
    }}>Save</button>
    </h2>
    <div key={`div1_${tokenId}`} className="image_block">
      {metadata.attributes.map((a: any) => (<button key={`${tokenId}_${a.trait_type}`} style={{lineHeight: 'initial'}}><small key={`small_${tokenId}_${a.trait_type}`}>{a.trait_type}</small><br key={`br_${tokenId}_${a.trait_type}`} />{a.value}</button>))}
    </div>
    <div key={`div2_${tokenId}`} className="image_block">
    {Array.from({length:TIER_SIZES[tier] || 0}, (x,i)=>i+1).map((edition: number) => {
        const artId = (Number(tokenId) * 1000) + edition;

        return (
          <div style={{position: 'relative', height:'50px', width:'50px', display: 'flex', justifyContent: 'flex-end', alignItems:'center', flexDirection:'column', textShadow: '0 0 3px black', color: '#f0f0f0'}} key={`${tokenId}_artId_${artId}`} onClick={()=>{setEditionSelected(edition);}} className={(edition == editionSelected) ? 'selected' : ''}>
          <div  key={`${tokenId}_imgdiv_artId_${edition}`}  style={{width: '50px', height: '50px', zIndex: -1, position: 'absolute', top:0, left:0}}  >
          <Image 
            src={`https://d331ancnbhe3hg.cloudfront.net/previews/${artId}.webp`} 
            key={`${tokenId}_img_artId_${artId}`} 
            alt={`${tokenId}_${artId}`} 
            fill
            style={{objectFit:"cover"}}
            unoptimized
            />
          </div>
          <span key={`${tokenId}_artId_span_${artId}`} >
          {edition}/{TIER_SIZES[tier]}</span>
          </div>
        )
       
    })}
    <button key={`${tokenId}_artId_clear`} style={{height: '50px', width:'50px', padding:'0px 0px'}} onClick={()=>{setEditionSelected(1);}}><small>Clear</small></button>
    </div>
    {(editionSelected != 0) && 
    <>
    <h2>Video (<a key={`video_dl_${artIdSelected}`} href={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.webm`}>webm</a>)</h2>
    <video autoPlay playsInline muted loop id="poppetBg" key={`video_${artIdSelected}`} style={{height:'1500px', width:'1500px'}}>
        <source src={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.webm`}  type="video/webm" />
    </video>

    <h2>Composite (<a key={`webp_dl_${artIdSelected}`} href={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.webp`}>webp</a>)</h2>
    <Image 
    src={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.webp`} 
    alt={`${tokenId}_${editionSelected}`} 
    width={1500}
    height={1500}
    priority
    unoptimized
    key={`img_${artIdSelected}`}
    />
    
    <h2>Transparent (<a key={`transparent_dl_${artIdSelected}`} href={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.png`}>png</a>)</h2>
    <Image 
    src={`https://d331ancnbhe3hg.cloudfront.net/previews/${artIdSelected}.png`} 
    alt={`${tokenId}_${editionSelected}`} 
    width={1500}
    height={1500}
    priority
    unoptimized
    key={`img_trans_${artIdSelected}`}
    />
    </>
  }
  
    <div key={`div3_${tokenId}`} className="image_block">
    <label key={`label1_${tokenId}`} htmlFor="title">Title</label><input key={`input1_${tokenId}`} name="title" onChange={(e)=> {
      setTitle(e.target.value);
    }} value={title} />
    <label key={`label2_${tokenId}`} htmlFor="tier">Tier</label>
    <select  key={`select2_${tokenId}`} defaultValue={tierSelected} name="tier" onChange={(e) => {
      setTier(e.target.value as ('Gold' | 'Silver' | 'Black'));
    }}>
      {/* <option key={`option2_1_${tokenId}`} value="Gold" selected={tierSelected == "Gold"}>Gold</option>
      <option key={`option2_2_${tokenId}`} value="Silver" selected={tierSelected == "Silver"}>Silver</option>
      <option key={`option2_3_${tokenId}`} value="Black" selected={tierSelected == "Black"}>Black</option>
      <option key={`option2_4_${tokenId}`} value="" selected={tierSelected == ""}></option> */}
      <option key={`option2_1_${tokenId}`} value="Gold" >Gold</option>
      <option key={`option2_2_${tokenId}`} value="Silver" >Silver</option>
      <option key={`option2_3_${tokenId}`} value="Black" >Black</option>
      <option key={`option2_4_${tokenId}`} value="" ></option>
    </select>
    
    <label key={`label4_${tokenId}`} htmlFor="background">Edition</label>
    <select key={`select4_${tokenId}`} defaultValue={editionSelected} name="background" onChange={(e) => {
      setEditionSelected(Number(e.target.value));
    }}>
      {/* <option key={`option4_1_${tokenId}`} value="100" selected={editionSelected == "100"}>100%</option>
      <option key={`option4_2_${tokenId}`} value="95" selected={editionSelected == "95"}>95%</option>
      <option key={`option4_3_${tokenId}`} value="90" selected={editionSelected == "90"}>90%</option>
      <option key={`option4_4_${tokenId}`} value="85" selected={editionSelected == "85"}>85%</option>
      <option key={`option4_5_${tokenId}`} value="80" selected={editionSelected == "80"}>80%</option>
      <option key={`option4_6_${tokenId}`} value="75" selected={editionSelected == "75"}>75%</option>
      <option key={`option4_7_${tokenId}`} value="70" selected={editionSelected == "70"}>70%</option>
      <option key={`option4_8_${tokenId}`} value="" selected={editionSelected == ""}>?</option> */}
      {Array.from({length:TIER_SIZES[tier] || 0}, (x,i)=>i+1).map((edition: number) => (
          <option key={`option4_1_${tokenId}_${edition}`} value={edition} >{edition}</option>
      ))}
    </select>
    </div>
    <div key={`div4_${tokenId}`} className="image_block">
    <label key={`label5_${tokenId}`} htmlFor="notes">Notes</label><input key={`input5_${tokenId}`} name="notes" onChange={(e)=> {
      setNotesSelected(e.target.value);
    }} value={notesSelected} style={{width: '70vw'}} />
    </div>
    
    <hr key={`${tokenId}_hr`} />
    </>
  )
};

export default NFTPreviewRenders;
