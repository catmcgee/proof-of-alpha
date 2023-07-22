import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

function ZKProof() {
  const router = useRouter();
  const { id: txHash } = router.query;
  const [imageData, setImageData] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const getZkProofImage = async () => {
      const res = await axios.get(`/api/zkproof?txHash=${txHash}`);
      setImageData(res.data);
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
          <img ref={imgRef} src={`data:image/png;base64,${imageData}`} alt='Proof image with QR code' />
          <button onClick={copyImageToClipboard}>Copy Image</button>
        </div>
      }
    </div>
  )
}

export default ZKProof;
