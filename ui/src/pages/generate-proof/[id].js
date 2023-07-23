import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import GenerateProof, { generateTransactionJSON } from '../GenerateProof';


function ZKProof() {
  const router = useRouter();
  const { id: txHash } = router.query;
  const [imageData, setImageData] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const getZkProofImage = async () => {
      if (!txHash) return;
      // You also might have to pass the state to this function
      const transactionJSON = await GenerateProof(); 
      setImageData(transactionJSON);
    }
    getZkProofImage();
  }, [txHash]);

  const copyImageToClipboard = () => {
    const imageUrl = imgRef.current.src;
    const newWindow = window.open();
    newWindow.document.write('<img src="' + imageUrl + '">');
  }

  return (
    <div>
      <h1>ZKProof for transaction: {txHash}</h1>
      {imageData && 
        <div>
          { /* Here this image might be a qr code that has been converted to base64 */ }
          <img ref={imgRef} src={`data:image/png;base64,${imageData}`} alt='Proof image with QR code' />
          <button onClick={copyImageToClipboard}>Copy Image</button>
        </div>
      }
    </div>
  )
}

export default ZKProof;
