import React , { FunctionComponent , useEffect, useState, useRef } from 'react'





const VNC_Client : FunctionComponent = () => {
    const [socket , setSocket] = useState<WebSocket>();
    const img = useRef<HTMLCanvasElement>(null);
    
    

    return (
        <div>
            18
            <canvas ref={img} />
        </div>
    )
}


export default VNC_Client;