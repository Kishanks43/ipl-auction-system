import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#111",
      color: "#fff"
    }}>
      
      <h1 style={{ marginBottom: 40 }}>🏏 IPL Auction System</h1>

      <div style={{ display: "flex", gap: 20 }}>
        
        <button
          onClick={() => navigate("/admin")}
          style={{
            padding: "14px 28px",
            fontSize: "18px",
            background: "#ff3b3b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          🎛 Admin Panel
        </button>

        <button
          onClick={() => navigate("/display")}
          style={{
            padding: "14px 28px",
            fontSize: "18px",
            background: "#00c853",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          📺 Display Screen
        </button>

      </div>
    </div>
  );
}