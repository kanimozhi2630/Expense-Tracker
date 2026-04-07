# Smart Group Expense Management System

A modern, responsive full-stack web application for managing group expenses with real-time chat, expense tracking, and smart splitting features.

## 🎨 Design Features

- **Modern SaaS Dashboard Design**: Clean, professional interface with teal theme
- **Smooth Animations**: Card hover effects, button interactions, fade-in transitions
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Subtle Neon Glow**: Teal glow effects on hover and active elements
- **Professional Typography**: Poppins font family

### Color Palette
- Primary: Teal (#0F766E)
- Accent: Light Teal (#14B8A6)
- Success: Green (#22C55E)
- Warning: Orange (#F59E0B)
- Danger: Red (#EF4444)
- Background: Very light gray (#F1F5F9)

## 🚀 Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Recharts (for data visualization)
- CSS3 with custom animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
cd "Full-stack project"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (already created):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

Start MongoDB (if using local):
```bash
mongod
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## 📱 Application Features

### 1. Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing

### 2. Dashboard
- Welcome message with user name
- Summary cards showing:
  - Total Groups
  - Active Groups
  - Total Expenses This Month
- Create new group or use existing group
- List of all groups with:
  - Budget and spent amount
  - Animated progress bar
  - Status badge (Active/Completed)

### 3. Group Management
- Create groups with name and budget
- Add/remove members
- Real-time budget tracking
- Budget warning when exceeded

### 4. Expense Tracking
- Add expenses with:
  - Description
  - Amount
  - Category (Food, Transport, Accommodation, etc.)
- View all expenses in clean card layout
- Category badges for easy identification

### 5. Group Chat
- Real-time messaging within groups
- Message bubbles (teal for sent, gray for received)
- Timestamp display
- Sender name identification

### 6. Analysis
- Pie chart showing expenses by category
- Bar chart showing member contributions
- Highlight highest spending category
- Visual insights into spending patterns

### 7. Split Expenses
- Calculate fair split among members
- Show who owes whom
- Display total expense and per-person share
- Mark group as completed after settlement

## 🎯 Usage Flow

1. **Register/Login**: Create an account or login
2. **Dashboard**: View your groups and statistics
3. **Create Group**: Click "Create New Group" and set budget
4. **Add Members**: Invite members to your group
5. **Add Expenses**: Track expenses as they occur
6. **Chat**: Communicate with group members
7. **Analyze**: View spending patterns and insights
8. **Split**: Calculate and settle expenses fairly

## 🎨 UI Highlights

- **Card Hover Effect**: Cards lift with teal glow on hover
- **Button Animations**: Scale effect on click
- **Progress Bars**: Animated filling with color coding
  - Green: < 80% budget used
  - Orange: 80-100% budget used
  - Red: Budget exceeded
- **Tab Navigation**: Smooth underline animation
- **Modal Animations**: Slide-up effect with backdrop
- **Input Focus**: Teal glow on active input fields

## 📁 Project Structure

```
Full-stack project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── Expense.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── groups.js
│   │   ├── expenses.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── CreateGroupModal.js
    │   │   ├── ExpensesTab.js
    │   │   ├── MembersTab.js
    │   │   ├── ChatTab.js
    │   │   ├── AnalysisTab.js
    │   │   └── SplitTab.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   └── Group.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   └── Group.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Secure HTTP headers

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Groups
- POST `/api/groups` - Create group
- GET `/api/groups` - Get all user groups
- GET `/api/groups/:id` - Get group by ID
- PUT `/api/groups/:id` - Update group
- POST `/api/groups/:id/members` - Add member

### Expenses
- POST `/api/expenses` - Create expense
- GET `/api/expenses/group/:groupId` - Get group expenses

### Chat
- POST `/api/chat` - Send message
- GET `/api/chat/group/:groupId` - Get group messages

## 🎓 Learning Resources

This project demonstrates:
- Full-stack development with MERN stack
- RESTful API design
- JWT authentication
- React hooks and state management
- Responsive CSS design
- CSS animations and transitions
- Data visualization with charts

## 📝 License

This project is open source and available for educational purposes.

## 👥 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 🐛 Known Issues

- Real-time chat requires manual refresh (WebSocket can be added for live updates)
- Member addition requires user ID (can be improved with email invitation)

## 🚀 Future Enhancements

- Real-time updates with Socket.io
- Email notifications
- Export expense reports
- Multiple currency support
- Receipt upload feature
- Mobile app version

---

Built with ❤️ using React, Node.js, Express, and MongoDB
