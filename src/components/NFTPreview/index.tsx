import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import handler from '@/pages/api/hello';

const BACKGROUNDS = [
  'fire',
  'water',
  'earth',
  'clouds'
]

const FOREGROUNDS = [
  'white',
  'black'
]

const TIERS = [
  'Gold',
  'Silver',
  'Black'
]

const updateToken = ({tid, data}: {tid: string, data: any}) => {
  return fetch(`/api/editions/${tid}`, {method: 'POST', body: JSON.stringify(data)}).then((res) => res.json());
}

export interface INFTPreviewProps {
  tokenId: string;
  artist: string;
  title: string;
  tier: string;
  background_selected?: string;
  foreground_selected?: string;
  metadata?: any;
  handler: any;
}

const NFTPreview = ({
  tokenId,
  artist,
  title,
  tier,
  background_selected,
  foreground_selected,
  metadata,
  handler
}: INFTPreviewProps) => {
  const [bgSelected, setBgSelected] = useState(background_selected);
  const [fgSelected, setFgSelected] = useState(foreground_selected);
  const [titleSelected, setTitle] = useState(title);
  const [tierSelected, setTier] = useState(tier); 
  
  useEffect(() => {
    if(background_selected != bgSelected || foreground_selected != fgSelected){
      if((bgSelected != "" && fgSelected != "") || (title != titleSelected) || (tier != tierSelected)){
        handler(tokenId, bgSelected, fgSelected, titleSelected, tierSelected);
      }
    }


  }, [background_selected, tier, tierSelected, title, titleSelected, foreground_selected, tokenId, handler, bgSelected, fgSelected])

  return (
    <>
    <h2 key={`h2_${tokenId}`}>{artist} # {tokenId}
    <button onClick={()=>{
      updateToken({tid: tokenId, data: {_background: bgSelected, _foreground: fgSelected, _title: titleSelected, _tier: tierSelected}})
    }}>Save</button>
    </h2>
    <div key={`div1_${tokenId}`} className="image_block">
      {metadata.attributes.map((a: any) => (<button key={`${a.trait_type}`} style={{lineHeight: 'initial'}}><small>{a.trait_type}</small><br />{a.value}</button>))}
    </div>
    <div key={`div2_${tokenId}`} className="image_block">
    {BACKGROUNDS.map((bg) => {
      return (
        FOREGROUNDS.map((fg) => {
          return (
          <Image 
            src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${tokenId}_${artist}_${bg}_${fg}.jpg`} 
            key={`${tokenId}_${bg}_${fg}`}
            alt={`${tokenId}_${bg}_${fg}`} 
            width={50}
            height={50}
            onClick={()=>{setBgSelected(bg); setFgSelected(fg)}}
            className={(bg == bgSelected && fg == fgSelected) ? 'selected' : ''}
            />
          )
        })
      ) 
    })}
    <button style={{height: '50px', width:'50px', padding:'0px 0px'}} onClick={()=>{setBgSelected(''); setFgSelected('')}}><small>Clear</small></button>
    </div>
    {(bgSelected != "" && fgSelected != "") && 
    <Image 
    src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${tokenId}_${artist}_${bgSelected}_${fgSelected}.jpg`} 
    alt={`${tokenId}_${bgSelected}_${fgSelected}`} 
    width={500}
    height={500}
    key={`img_${tokenId}`}
    />
  }
  {(bgSelected == "" && fgSelected == "") && false && 
    <Image 
    src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${tokenId}_${artist}_clouds_black.jpg`} 
    alt={`${tokenId}_${bgSelected}_${fgSelected}`} 
    width={500}
    height={500}
    key={`img_no_${tokenId}`}
    />
  }
    <div key={`div3_${tokenId}`} className="image_block">
    <label key={`label1_${tokenId}`} htmlFor="title">Title</label><input key={`input1_${tokenId}`} name="title" onChange={(e)=> {
      setTitle(e.target.value);
    }} value={title} />
    <label key={`label2_${tokenId}`} htmlFor="tier">Tier</label>
    <select  key={`select2_${tokenId}`} name="tier" onChange={(e) => {
      setTier(e.target.value);
    }}>
      <option key={`option2_1_${tokenId}`} value="Gold" selected={tierSelected == "Gold"}>Gold</option>
      <option key={`option2_2_${tokenId}`} value="Silver" selected={tierSelected == "Silver"}>Silver</option>
      <option key={`option2_3_${tokenId}`} value="Black" selected={tierSelected == "Black"}>Black</option>
      <option key={`option2_4_${tokenId}`} value="" selected={tierSelected == ""}></option>
    </select>
    <label key={`label3_${tokenId}`} htmlFor="foreground">Foreground</label>
    <select key={`select3_${tokenId}`} name="foreground" onChange={(e) => {
      setFgSelected(e.target.value);
    }}>
      <option key={`option3_1_${tokenId}`} value="white" selected={fgSelected == "white"}>white</option>
      <option key={`option3_2_${tokenId}`} value="black" selected={fgSelected == "black"}>black</option>
      <option key={`option3_3_${tokenId}`} value="" selected={fgSelected == ""}></option>
    </select>
    <label key={`label4_${tokenId}`} htmlFor="background">Background</label>
    <select key={`select4_${tokenId}`} name="background" onChange={(e) => {
      setBgSelected(e.target.value);
    }}>
      <option key={`option4_1_${tokenId}`} value="fire" selected={bgSelected == "fire"}>fire</option>
      <option key={`option4_2_${tokenId}`} value="water" selected={bgSelected == "water"}>water</option>
      <option key={`option4_3_${tokenId}`} value="earth" selected={bgSelected == "earth"}>earth</option>
      <option key={`option4_4_${tokenId}`} value="clouds" selected={bgSelected == "clouds"}>clouds</option>
      <option key={`option4_5_${tokenId}`} value="" selected={bgSelected == ""}></option>
    </select>
    </div>
    
    <hr />
    </>
  )
};

export default NFTPreview;
