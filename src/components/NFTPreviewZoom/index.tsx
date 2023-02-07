import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import handler from '@/pages/api/hello';

const ZOOMS = [
  '110',
  '105',
  '100',
  '95',
  '90',
  '85',
  '80',
  '75',
  '70'
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
  notes?: string;
  zoom_selected?: string;
  metadata?: any;
  handler: any;
}

const NFTPreviewZoom = ({
  tokenId,
  artist,
  title,
  tier,
  notes = "",
  zoom_selected,
  metadata,
  handler
}: INFTPreviewProps) => {
  const [zoomSelected, setZoomSelected] = useState(zoom_selected);
  const [notesSelected, setNotesSelected] = useState(notes);
  
  const [titleSelected, setTitle] = useState(title);
  const [tierSelected, setTier] = useState(tier); 
  
  
  useEffect(() => {
    if(zoom_selected != zoomSelected || title != titleSelected || tier != tierSelected || notes != notesSelected){
      handler(tokenId, zoomSelected, notes, titleSelected, tierSelected);
    }
  }, [zoom_selected, tier, tierSelected, title, titleSelected, tokenId, handler, zoomSelected, notes, notesSelected])

  return (
    <>
    <h2 key={`h2_${tokenId}`}>{artist} # {tokenId}
    <button onClick={()=>{
      updateToken({tid: tokenId, data: {_zoom: zoomSelected, _notes: notesSelected, _title: titleSelected, _tier: tierSelected}})
    }}>Save</button>
    </h2>
    <div key={`div1_${tokenId}`} className="image_block">
      {metadata.attributes.map((a: any) => (<button key={`${a.trait_type}`} style={{lineHeight: 'initial'}}><small>{a.trait_type}</small><br />{a.value}</button>))}
    </div>
    <div key={`div2_${tokenId}`} className="image_block">
    {ZOOMS.map((zoom) => {
      
        return (
          <div style={{position: 'relative', height:'50px', width:'50px', display: 'flex', justifyContent: 'flex-end', alignItems:'center', flexDirection:'column', textShadow: '0 0 3px black', color: '#f0f0f0'}} key={`${tokenId}_${zoom}`} onClick={()=>{setZoomSelected(zoom);}} className={(zoom == zoomSelected) ? 'selected' : ''}>
          <div  key={`${tokenId}_imgdiv_${zoom}`}  style={{width: '50px', height: '50px', zIndex: -1, position: 'absolute', top:0, left:0}}  >
          <Image 
            src={`http://ink-preview.s3-website.us-east-2.amazonaws.com/previews/${artist}_${tokenId}_${zoom}_percent.jpg`} 
            key={`${tokenId}_img_${zoom}`} 
            alt={`${tokenId}_${zoom}`} 
            fill
            style={{objectFit:"cover"}}
            unoptimized
            />
          </div>
          <span key={`${tokenId}_span_${zoom}`} >
          {zoom}%</span>
          </div>
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
    <div key={`div4_${tokenId}`} className="image_block">
    <label key={`label5_${tokenId}`} htmlFor="notes">Notes</label><input key={`input5_${tokenId}`} name="notes" onChange={(e)=> {
      setNotesSelected(e.target.value);
    }} value={notesSelected} style={{width: '70vw'}} />
    </div>
    
    <hr />
    </>
  )
};

export default NFTPreviewZoom;
