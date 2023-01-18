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
    <h2>{artist} # {tokenId}</h2>
    <div className="image_block">
      {metadata.attributes.map((a: any) => (<button key={`${a.trait_type}`} style={{lineHeight: 'initial'}}><small>{a.trait_type}</small><br />{a.value}</button>))}
    </div>
    <div className="image_block">
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
    </div>
    {(bgSelected != "" && fgSelected != "") && 
    <Image 
    src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${tokenId}_${artist}_${bgSelected}_${fgSelected}.jpg`} 
    alt={`${tokenId}_${bgSelected}_${fgSelected}`} 
    width={500}
    height={500}
    />
  }
  {(bgSelected == "" && fgSelected == "") && false && 
    <Image 
    src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${tokenId}_${artist}_clouds_black.jpg`} 
    alt={`${tokenId}_${bgSelected}_${fgSelected}`} 
    width={500}
    height={500}
    />
  }
    <div className="image_block">
    <label htmlFor="title">Title</label><input name="title" onChange={(e)=> {
      setTitle(e.target.value);
    }} value={title} />
    <label htmlFor="tier">Tier</label>
    <select name="tier" onChange={(e) => {
      setTier(e.target.value);
    }}>
      <option value="Gold" selected={tierSelected == "Gold"}>Gold</option>
      <option value="Silver" selected={tierSelected == "Silver"}>Silver</option>
      <option value="Black" selected={tierSelected == "Black"}>Black</option>
      <option value="" selected={tierSelected == ""}></option>
    </select>
    <label htmlFor="foreground">Foreground</label>
    <select name="foreground" onChange={(e) => {
      setFgSelected(e.target.value);
    }}>
      <option value="white" selected={fgSelected == "white"}>white</option>
      <option value="black" selected={fgSelected == "black"}>black</option>
      <option value="" selected={fgSelected == ""}></option>
    </select>
    <label htmlFor="background">Background</label>
    <select name="background" onChange={(e) => {
      setBgSelected(e.target.value);
    }}>
      <option value="fire" selected={bgSelected == "fire"}>fire</option>
      <option value="water" selected={bgSelected == "water"}>water</option>
      <option value="earth" selected={bgSelected == "earth"}>earth</option>
      <option value="clouds" selected={bgSelected == "clouds"}>clouds</option>
      <option value="" selected={bgSelected == ""}></option>
    </select>
    </div>
    
    <hr />
    </>
  )
};

export default NFTPreview;
