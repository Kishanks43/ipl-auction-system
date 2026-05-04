// import { useEffect, useState } from "react";
// import socket from "../socket";

// export default function Display() {
//   const [state, setState] = useState(null);

//   useEffect(() => {
//     socket.on("state:update", setState);
//     return () => socket.off("state:update");
//   }, []);

//   if (!state) return <h1>Connecting to auction…</h1>;

//   return (
//     <div>
//       <h1>📺 Auction Display</h1>
//       <h2>Phase: {state.phase}</h2>
//     </div>
//   );
// }

//1st Edit 

// import { useEffect, useState } from "react";
// import socket from "../socket";

// export default function Display() {
//   const [state, setState] = useState(null);

//   useEffect(() => {
//     socket.on("state:update", setState);
//     return () => socket.off("state:update");
//   }, []);

//   if (!state) return <h1>Connecting…</h1>;

//   const player = state.players.find(p => p.id === state.currentPlayerId);

//   if (!player) {
//     return <h1>🕒 Waiting for next player…</h1>;
//   }

//   if (player.isMystery && state.phase === "standby") {
//     return (
//       <div>
//         <h1>❓ MYSTERY PLAYER</h1>
//         <h2>Bidding is Open</h2>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>{player.name}</h1>
//       <p>Base Price: {player.basePrice}</p>
//       <p>Points: {player.points}</p>
//       <p>Nationality: {player.nationality}</p>
//       <p>Status: {player.status}</p>
//     </div>
//   );
// }

//2nd Edit 

import { useRef, useEffect, useState, useMemo } from "react";
import socket from "../socket";
// import { getImage } from "../utils/imageDB"; // After 2nd Edit




export default function Display() {
  const [imageURL, setImageURL] = useState(null); // After 2nd Edit 
  const [state, setState] = useState(null);
  const soldSound = useRef(new Audio("/sounds/gavel.mp3"));
  const unsoldSound = useRef(new Audio("/sounds/buzz.mp3"));
  const revealSound = useRef(new Audio("/sounds/drumroll.mp3"));
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
      socket.on("state:update", setState);
      return () => socket.off("state:update");
  }, []);


  const player = useMemo(() => {
    // If state is null/undefined, return null immediately
    if (!state || !state.players) return null;
    return state.players.find(p => p.id === state.currentPlayerId);
    // Depend only on the players array and the current ID
  }, [state?.players, state?.currentPlayerId]); 


  useEffect(() => {
      if (!audioEnabled || !state || !player) return;

      if (state.phase === "sold" && player.status === "sold") {
          soldSound.current.play();
      }

      if (state.phase === "sold" && player.status === "unsold") {
          unsoldSound.current.play();
      }

      if (state.phase === "reveal") {
          revealSound.current.play();
      }
  }, [state, player, audioEnabled]);

  if (!state) return <h1>Connecting…</h1>;


  if (!state.currentPlayerId) {
      return (
          <div className="display-wrapper">
              <div className="fixed-logos">
                  <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
                  <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
              </div>
              {!audioEnabled && (
                <div className="audio-overlay" onClick={() =>{ 
                        soldSound.current.play().catch(()=>{});
                        setAudioEnabled(true)}}>
                   <h2>🔊 Tap to Enable Sound</h2>
                </div>
              )}
            
              <div className="standby-screen">

                  <h1>🏏 IPL AUCTION</h1>
                  <h2>Get Ready for the Next Player</h2>
                  <p>Waiting for Admin…</p>
            
              </div>
          </div>
      );
  }


//   getImage(player.imageId).then(blob => {
//       console.log("Fetched blob:", blob);
//       if (blob) {
//           setImageURL(URL.createObjectURL(blob));
//       }
//     });


  if (!player) {
    return <h1>🕒 Waiting for next player…</h1>;
  }

  if (player.isMystery && state.phase === "standby") {
    return (
          <div className="display-wrapper">

              <div className="fixed-logos">
                  <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
                  <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
              </div>

              <div className="mystery-standby">
                  <h1>🎭 MYSTERY PLAYER</h1>
                  <div className="mystery-subtext">Identity Hidden</div>
                  <div className="mystery-bidding">Bidding is LIVE</div>
              </div>
          </div>
    );
  }

  if (player.isMystery && state.phase === "reveal") {
      return (
          <div className="display-wrapper">
              <div className="fixed-logos">
                  <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
                  <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
              </div>

              <div className="reveal-screen">
                
                {player.imageId && (
                  <img src={`${window.location.protocol}//${window.location.hostname}:3001/uploads/${player.imageId}`} className="reveal-image" alt="Player" />
                )}
                
                  <h1 className="reveal-name">{player.name}</h1>
                
                  <h2>{player.nationality}</h2>
                
                  <h3>Points: {player.points}</h3>
            
              </div>
          </div>
      );
  }


  if (state.phase === "sold") {
      if (player.status === "sold") {
          return (
          
          <div className="display-wrapper">
              <div className="fixed-logos">
                  <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
                  <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
              </div>
        
              <div className="sold-container">
                {/*Handles if image doesnt exist*/}
                {player.imageId && (
                  <img src={`${window.location.protocol}//${window.location.hostname}:3001/uploads/${player.imageId}`} className="player-image" alt="Player" />
                )}

                  <h2 className="player-name">{player.name} : {player.points} points</h2>

                  <div className="sold-banner">
                      SOLD to {player.soldTo} for {player.soldAmount}L
                  </div>

                <div className="team-logo-container">       
                    <img
                    src={`/logos/${player.soldTo}.png`}
                    className="team-logo"
                    alt="Team Logo"
                    />
                </div>

              </div>
          </div>

          );
      } else {
          return (

          <div className="display-wrapper">
              <div className="fixed-logos">
                  <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
                  <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
              </div>

              <div className="sold-container unsold-bg">

                {player.imageId && (
                  <img src={`${window.location.protocol}//${window.location.hostname}:3001/uploads/${player.imageId}`} className="player-image grayscale" alt="Player" />
                )}

                  <h2 className="player-name">{player.name} : {player.points} Points</h2>

                  <div className="unsold-banner">❌ UNSOLD</div>
              
                  <div className="unsold-subtext"> No bids for the player </div>

              </div>
          </div>
          );
      }
  }


  return (

      <div className="display-wrapper">
          <div className="fixed-logos">
              <img src="/logos/leftLogo.png" className="logo left-logo" alt="Left Logo" />
              <img src="/logos/rightLogo.png" className="logo right-logo" alt="Right Logo" />
          </div>
  
          <div className="bidding-container">
        
            {player.imageId && (
              <img src={`${window.location.protocol}//${window.location.hostname}:3001/uploads/${player.imageId}`} className="player-image bidding-image" alt="Player" />
            )}
              <h1 className="player-name">{player.name}</h1>

              <div className="bidding-badge">🟢 BIDDING LIVE</div>
  
                  <div className="player-info">
                      <p>Base Price: {player.basePrice}L</p>
                      <p>Points: {player.points}</p>
                      <p>Nationality: {player.nationality}</p>
                  </div>
        
          </div>
      </div>
  );
}
