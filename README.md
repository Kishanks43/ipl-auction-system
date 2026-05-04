# 🏏 IPL Auction System (MERN)

A full-stack web application simulating a real IPL-style auction system with bidding logic, team budgets, and live display screens.

---

## 🚀 Features

- 🎮 Admin Panel to control auction flow
- 📺 Live Display Screen for projector view
- 💰 Budget & purse tracking for each team
- 📊 Team dashboards with player stats
- 📜 Auction history tracking
- 🔁 Undo last action functionality

---

## 🧠 System Design

- Centralized auction state managed via backend
- Each action updates:
  - Team purse
  - Player allocation
  - Auction history
- Separate UI for:
  - Admin (control)
  - Display (presentation)

---

## 🛠 Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Data Handling: JSON-based state management

---

## 📸 Screenshots

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ceff8c55-c73b-430f-b8c7-b6de9db0b48a" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/33bac7fe-db50-4f93-b95b-f7f88047180e" />
<img width="1919" height="1079" alt="Screenshot 2026-05-04 170344" src="https://github.com/user-attachments/assets/6e755fc6-3fa2-4eb4-8feb-4827edaae02b" />
<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/196a951a-f006-42f1-95e1-e239b8d6b2c8" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/e5502ea0-c1b6-4eb4-a514-620a5d19ca05" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/fffabd5c-2385-44e6-8452-63bacad21b02" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cb8a3b7f-2776-4750-8c86-bbd5765ce1dd" />

<img width="1919" height="1079" alt="Screenshot 2026-05-04 170212" src="https://github.com/user-attachments/assets/2c4e4428-0f4e-46c2-aa26-dd33ca3dab57" />
<img width="1891" height="1064" alt="image" src="https://github.com/user-attachments/assets/1ecb8f1e-b681-4a73-8d61-4060eb5267f9" />
<img width="1916" height="1079" alt="image" src="https://github.com/user-attachments/assets/f5347c20-8cbf-4519-b6a7-ca33028ef0b1" />

---

## ⚙️ How to Run

### Backend
cd server  
npm install  
node server.js  

### Frontend
cd client  
npm install  
npm start  

---

## 💡 Key Learnings

- Managing shared state across multiple components
- Designing real-time-like systems without conflicts
- Handling edge cases in bidding logic
- Building systems for real-world event usage
