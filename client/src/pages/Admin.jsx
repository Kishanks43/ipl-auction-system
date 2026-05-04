// import { useEffect, useState } from "react";
// import socket from "../socket";

// export default function Admin() {
//   const [state, setState] = useState(null);

//   useEffect(() => {
//     socket.on("state:update", setState);
//     return () => socket.off("state:update");
//   }, []);

//   const startBidding = () => {
//     socket.emit("state:update", {
//       ...state,
//       phase: "bidding"
//     });
//   };

//   return (
//     <div>
//       <h1>🎛 Admin Panel</h1>
//       <button onClick={startBidding}>Start Bidding</button>
//       <pre>{JSON.stringify(state, null, 2)}</pre>
//     </div>
//   );
// }

//1st edit

// import { useEffect, useState } from "react";
// import socket from "../socket";

// export default function Admin() {
//   const [state, setState] = useState(null);

//   // Player form
//   const [player, setPlayer] = useState({
//     name: "",
//     basePrice: "",
//     points: "",
//     nationality: "",
//     isMystery: false
//   });

//   useEffect(() => {
//     socket.on("state:update", setState);
//     return () => socket.off("state:update");
//   }, []);

//   if (!state) return <h2>Loading...</h2>;

//   const addPlayer = () => {
//     const newPlayer = {
//       ...player,
//       id: Date.now(),
//       status: "available",
//       soldTo: null,
//       soldAmount: null,
//       imageId: null
//     };

//     const newState = {
//       ...state,
//       players: [...state.players, newPlayer]
//     };

//     socket.emit("state:update", newState);
//     setPlayer({
//       name: "",
//       basePrice: "",
//       points: "",
//       nationality: "",
//       isMystery: false
//     });
//   };

//   const setCurrentPlayer = (id) => {
//     socket.emit("state:update", {
//       ...state,
//       currentPlayerId: id,
//       phase: "standby"
//     });
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>🎛 Admin Panel</h1>

//       <h2>Add Player</h2>
//       <input placeholder="Name" value={player.name}
//         onChange={e => setPlayer({...player, name: e.target.value})} />
//       <input placeholder="Base Price" value={player.basePrice}
//         onChange={e => setPlayer({...player, basePrice: e.target.value})} />
//       <input placeholder="Points" value={player.points}
//         onChange={e => setPlayer({...player, points: e.target.value})} />
//       <input placeholder="Nationality" value={player.nationality}
//         onChange={e => setPlayer({...player, nationality: e.target.value})} />

//       <label>
//         <input type="checkbox"
//           checked={player.isMystery}
//           onChange={e => setPlayer({...player, isMystery: e.target.checked})}
//         />
//         Mystery Player
//       </label>

//       <br />
//       <button onClick={addPlayer}>➕ Add Player</button>

//       <hr />

//       <h2>Player Pool</h2>
//       {state.players.map(p => (
//         <div key={p.id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
//           <b>{p.name || "MYSTERY PLAYER"}</b> | {p.status}
//           <button onClick={() => setCurrentPlayer(p.id)}>🎯 Set Current</button>
//         </div>
//       ))}
//     </div>
//   );
// }

//2nd Edit

import Login from "./Login";

import { useEffect, useState } from "react";
import socket from "../socket";
// import { saveImage } from "../utils/imageDB"; //added after 2nd edit

export default function Admin() {
  const [state, setState] = useState(null);
  const [team, setTeam] = useState("");
  const [amount, setAmount] = useState("");
  const [previousState, setPreviousState] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const [player, setPlayer] = useState({
    name: "",
    basePrice: "",
    points: "",
    nationality: "",
    isMystery: false,
  });

  const INITIAL_TEAMS = [
    { name: "RCB", purse: 3500 },
    { name: "CSK", purse: 3500 },
    { name: "RR", purse: 3500 },
    { name: "LSG", purse: 3500 },
    { name: "MI", purse: 3500 },
    { name: "DC", purse: 3500 },
    { name: "GT", purse: 3500 },
    { name: "SRH", purse: 3500 },
    { name: "KKR", purse: 3500 },
    { name: "PBKS", purse: 3500 },
  ];

  useEffect(() => {
    socket.on("state:update", (newState) => {
      if (!newState.teams) {
        newState.teams = INITIAL_TEAMS.map((t) => ({
          ...t,
          spent: 0,
          players: [],
        }));
      }
      setState(newState);
    });
    return () => socket.off("state:update");
  }, []);

  if (!authenticated) {
    return <Login onLogin={setAuthenticated} />;
  }

  const resetAuctionCompletely = () => {
    const confirmReset = window.confirm(
      "⚠️ This will RESET the entire auction.\n\n" +
        "- All players set to AVAILABLE\n" +
        "- Team purse & squads cleared\n" +
        "- Auction history deleted\n\n" +
        "Are you sure?",
    );

    if (!confirmReset) return;

    const resetPlayers = state.players.map((p) => ({
      ...p,
      status: "available",
      soldTo: null,
      soldAmount: null,
    }));

    const resetTeams = state.teams.map((t) => ({
      ...t,
      spent: 0,
      players: [],
    }));

    socket.emit("state:update", {
      ...state,
      currentPlayerId: null,
      phase: "standby",
      players: resetPlayers,
      teams: resetTeams,
      history: [],
    });
  };

  const downloadCSV = (filename, rows) => {
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportHistory = () => {
    const rows = [
      ["No", "Player Name", "Points", "Status", "Team", "Amount", "Time"],
      ...state.history.map((h, i) => [
        i + 1,
        h.name,
        h.points,
        h.status,
        h.team || "",
        h.amount || "",
        h.time,
      ]),
    ];

    downloadCSV("auction_history.csv", rows);
  };

  const exportTeamSquads = () => {
    const rows = [["Team", "Player Name"]];

    state.teams.forEach((team) => {
      team.players.forEach((player) => {
        rows.push([team.name, player]);
      });
    });

    downloadCSV("team_squads.csv", rows);
  };

  const exportPurseSummary = () => {
    const rows = [
      ["Team", "Total Purse", "Spent", "Remaining", "Players Bought"],
    ];

    state.teams.forEach((t) => {
      rows.push([
        t.name,
        t.purse,
        t.spent,
        t.purse - t.spent,
        t.players.length,
      ]);
    });

    downloadCSV("purse_summary.csv", rows);
  };

  if (!state) return <h2>Loading...</h2>;

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `${window.location.protocol}//${window.location.hostname}:3001/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.filename;
  };

  const addPlayer = async () => {
    let imageName = null;

    if (player.imageFile) {
      imageName = await uploadImage(player.imageFile);
    }

    const newPlayer = {
      id: Date.now(),
      name: player.name,
      basePrice: player.basePrice,
      points: player.points,
      nationality: player.nationality,
      isMystery: player.isMystery,
      status: "available",
      soldTo: null,
      soldAmount: null,
      imageId: imageName,
    };

    socket.emit("state:update", {
      ...state,
      players: [...state.players, newPlayer],
    });

    setPlayer({
      name: "",
      basePrice: "",
      points: "",
      nationality: "",
      isMystery: false,
      imageFile: null,
    });
  };

  const setCurrentPlayer = (id) => {
    setTeam("");
    setAmount("");
    socket.emit("state:update", {
      ...state,
      currentPlayerId: id,
      phase: "standby",
    });
  };

  const startBidding = () => {
    socket.emit("state:update", {
      ...state,
      phase: "bidding",
    });
  };

  const markSold = () => {
    setPreviousState(JSON.parse(JSON.stringify(state))); //used for undo

    const soldPlayer = state.players.find(
      //added for log
      (p) => p.id === state.currentPlayerId,
    );

    //Update players list
    const updatedPlayers = state.players.map((p) =>
      p.id === state.currentPlayerId
        ? {
            ...p,
            status: "sold",
            soldTo: team,
            soldAmount: amount,
          }
        : p,
    );

    //Update teams
    const updatedTeams = state.teams.map((t) => {
      if (t.name === team) {
        return {
          ...t,
          spent: t.spent + Number(amount),
          players: [
            ...t.players,
            {
              name: soldPlayer.name,
              points: soldPlayer.points,
            },
          ],
        };
      }
      return t;
    });

    const newHistoryItem = {
      //added for log
      id: Date.now(),
      name: soldPlayer.name,
      points: soldPlayer.points,
      status: "SOLD",
      team,
      amount,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("state:update", {
      ...state,
      players: updatedPlayers,
      teams: updatedTeams,
      phase: "sold",
      history: [...state.history, newHistoryItem], //line added for log
    });

    setTeam("");
    setAmount("");
  };

  const markUnsold = () => {
    setPreviousState(state); //used for undo

    const unsoldPlayer = state.players.find(
      //added for log
      (p) => p.id === state.currentPlayerId,
    );

    const updatedPlayers = state.players.map((p) =>
      p.id === state.currentPlayerId ? { ...p, status: "unsold" } : p,
    );

    const newHistoryItem = {
      id: Date.now(),
      name: unsoldPlayer.name,
      points: unsoldPlayer.points,
      status: "UNSOLD",
      team: null,
      amount: null,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("state:update", {
      ...state,
      players: updatedPlayers,
      phase: "sold",
      history: [...state.history, newHistoryItem],
    });
  };

  const undoLastAction = () => {
    if (!previousState) return;
    socket.emit("state:update", previousState);
    setPreviousState(null);
  };

  const nextPlayer = () => {
    socket.emit("state:update", {
      ...state,
      currentPlayerId: null,
      phase: "standby",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎛 Admin Panel</h1>

      <h2>Add Player</h2>
      <input
        placeholder="Name"
        value={player.name}
        onChange={(e) => setPlayer({ ...player, name: e.target.value })}
      />
      <select
        value={player.basePrice}
        onChange={(e) => setPlayer({ ...player, basePrice: e.target.value })}
      >
        <option value="">Base Price</option>

        {Array.from({ length: 14 }, (_, i) => 20 + i * 10).map((price) => (
          <option key={price} value={price}>
            {price} L
          </option>
        ))}
      </select>

      <input
        placeholder="Points"
        value={player.points}
        onChange={(e) => setPlayer({ ...player, points: e.target.value })}
      />
      <select
        value={player.nationality}
        onChange={(e) => setPlayer({ ...player, nationality: e.target.value })}
      >
        <option value="">Nationality</option>
        <option value="IN">IN</option>
        <option value="OV">OV</option>
      </select>

      <input
        type="file"
        accept="image/*" //After 2nd edit
        onChange={(e) => setPlayer({ ...player, imageFile: e.target.files[0] })}
      />

      <label>
        <input
          type="checkbox"
          checked={player.isMystery}
          onChange={(e) =>
            setPlayer({ ...player, isMystery: e.target.checked })
          }
        />
        Mystery Player
      </label>
      <div>
        <button
          onClick={addPlayer}
          disabled={
            !player.name ||
            !player.basePrice ||
            !player.points ||
            !player.nationality ||
            !player.imageFile // ← image compulsory
          }
        >
          ➕ Add Player
        </button>
      </div>
      <hr />

      <h2>Player Pool</h2>
      {state.players.map((p) => (
        <div key={p.id}>
          <b>{p.name || "MYSTERY PLAYER"}</b> | {p.status}
          <button onClick={() => setCurrentPlayer(p.id)}>🎯 Set Current</button>
        </div>
      ))}

      <hr />

      <h2>🎯 Auction Controls</h2>
      <button onClick={startBidding} disabled={!state.currentPlayerId ||
        (player?.isMystery && state.phase === "standby")
      }>
        🔔 Start Bidding
      </button>

      <button
        onClick={undoLastAction}
        disabled={!previousState}
        style={{ background: "crimson", color: "white", marginTop: "10px" }}
      >
        {" "}
        🔁 Undo Last Action{" "}
      </button>

      <div>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="">Select Team</option>
          {state.teams.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        onClick={() =>
          socket.emit("state:update", { ...state, phase: "reveal" })
        }
      >
        🎭 Reveal Mystery
      </button>

      <button onClick={markSold} disabled={!team || !amount}>
        🏆 Mark SOLD
      </button>
      <button onClick={markUnsold}>❌ Mark UNSOLD</button>

      <br />
      <br />
      <button onClick={nextPlayer}>➡ Next Player</button>

      {/* from here added for log  */}
      <hr />
      <h2>📜 Auction History</h2>

      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {state.history.length === 0 && <p>No auction history yet.</p>}

        {state.history.map((h, index) => (
          <div
            key={h.id}
            style={{
              padding: "6px",
              marginBottom: "6px",
              background: h.status === "SOLD" ? "#d4ffd4" : "#ffd4d4",
            }}
          >
            <b>
              {index + 1}. {h.name}
            </b>
            ({h.points} pts) — {h.status}
            {h.status === "SOLD" && (
              <>
                {" "}
                | {h.team} for {h.amount}
              </>
            )}
            <span style={{ float: "right", fontSize: "0.8rem" }}>
              {" "}
              {h.time}{" "}
            </span>
          </div>
        ))}
      </div>

      {/* from here added for teams dashboard */}
      <hr />
      <h2>🏏 Team Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {state.teams.map((t) => {
          const remaining = t.purse - t.spent;
          const totalPoints = t.players.reduce(
            (sum, p) => sum + Number(p.points || 0),
            0,
          );

          return (
            <div
              key={t.name}
              style={{
                border: "2px solid #333",
                padding: "15px",
                borderRadius: "10px",
                background: "#f4f4f4",
              }}
            >
              <h3>{t.name}</h3>
              <p>
                <b>Total Purse:</b> {t.purse}
              </p>
              <p>
                <b>Spent:</b> {t.spent}
              </p>
              <p>
                <b>Remaining:</b> {remaining}
              </p>
              <p>
                <b>Total Points:</b> {totalPoints}
              </p>
              <p>
                <b>Players Bought:</b> {t.players.length}
              </p>

              <details>
                <summary>View Players</summary>
                <ul>
                  {t.players.map((p, i) => (
                    <li key={i}>
                      {p.name} — {p.points} pts
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })}
      </div>

      <hr />
      <h2>📤 Export Results</h2>
      <button onClick={exportHistory}>📤 Export Auction History</button>
      <button onClick={exportTeamSquads}>📤 Export Team Squads</button>
      <button onClick={exportPurseSummary}>📤 Export Purse Summary</button>

      <hr />
      <h2>🧨 Auction Controls</h2>

      <button
        onClick={resetAuctionCompletely}
        disabled={state.phase === "bidding"}
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px 20px",
          fontSize: "1rem",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        🔄 Reset Entire Auction
      </button>
    </div>
  );
}
