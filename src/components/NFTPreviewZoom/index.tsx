import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import handler from '@/pages/api/hello';

const ZOOMS = [
  '100',
  '95',
  '90',
  '85',
  '80',
  '75',
  '70',
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
  zoom_selected?: string;
  metadata?: any;
  handler: any;
}

const NFTPreviewZoom = ({
  tokenId,
  artist,
  title,
  tier,
  zoom_selected,
  metadata,
  handler
}: INFTPreviewProps) => {
  const [zoomSelected, setZoomSelected] = useState(zoom_selected);
  
  const [titleSelected, setTitle] = useState(title);
  const [tierSelected, setTier] = useState(tier); 
  
  useEffect(() => {
    if(zoom_selected != zoomSelected || title != titleSelected || tier != tierSelected){
      handler(tokenId, zoomSelected, titleSelected, tierSelected);
    }
  }, [zoom_selected, tier, tierSelected, title, titleSelected, tokenId, handler, zoomSelected])

  return (
    <>
    <h2 key={`h2_${tokenId}`}>{artist} # {tokenId}
    <button onClick={()=>{
      updateToken({tid: tokenId, data: {_zoom: zoomSelected, _title: titleSelected, _tier: tierSelected}})
    }}>Save</button>
    </h2>
    <div key={`div1_${tokenId}`} className="image_block">
      {metadata.attributes.map((a: any) => (<button key={`${a.trait_type}`} style={{lineHeight: 'initial'}}><small>{a.trait_type}</small><br />{a.value}</button>))}
    </div>
    <div key={`div2_${tokenId}`} className="image_block">
    {ZOOMS.map((zoom) => {
      
        return (
        <Image 
          src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${artist}_${tokenId}_${zoom}_percent.jpg`} 
          key={`${tokenId}_${zoom}`}
          alt={`${tokenId}_${zoom}`} 
          width={50}
          height={50}
          onClick={()=>{setZoomSelected(zoom);}}
          className={(zoom == zoomSelected) ? 'selected' : ''}
          />
        )
       
    })}
    <button style={{height: '50px', width:'50px', padding:'0px 0px'}} onClick={()=>{setZoomSelected('');}}><small>Clear</small></button>
    </div>
    {(zoomSelected != "") && 
    <Image 
    src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${artist}_${tokenId}_${zoomSelected}_percent.jpg`} 
    alt={`${tokenId}_${zoomSelected}`} 
    width={500}
    height={500}
    key={`img_${tokenId}`}
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
    
    <label key={`label4_${tokenId}`} htmlFor="background">Zoom</label>
    <select key={`select4_${tokenId}`} name="background" onChange={(e) => {
      setZoomSelected(e.target.value);
    }}>
      <option key={`option4_1_${tokenId}`} value="100" selected={zoomSelected == "100"}>100%</option>
      <option key={`option4_2_${tokenId}`} value="95" selected={zoomSelected == "95"}>95%</option>
      <option key={`option4_3_${tokenId}`} value="90" selected={zoomSelected == "90"}>90%</option>
      <option key={`option4_4_${tokenId}`} value="85" selected={zoomSelected == "85"}>85%</option>
      <option key={`option4_5_${tokenId}`} value="80" selected={zoomSelected == "80"}>80%</option>
      <option key={`option4_6_${tokenId}`} value="75" selected={zoomSelected == "75"}>75%</option>
      <option key={`option4_7_${tokenId}`} value="70" selected={zoomSelected == "70"}>70%</option>
      <option key={`option4_8_${tokenId}`} value="" selected={zoomSelected == ""}>?</option>
    </select>
    </div>
    
    <hr />
    </>
  )
};

export default NFTPreviewZoom;
