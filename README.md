# 🧠 TaskIt — Visual Task Management with React Flow

**TaskIt** is a modern, interactive task management system where you can visualize tasks, subtasks, and their relationships using an intuitive node-based interface powered by [React Flow](https://reactflow.dev/). It’s perfect for planning, assigning, and tracking progress on complex workflows.

![TaskIt Screenshot](./public/taskit-screenshot.png) <!-- Add a screenshot if available -->

---

## ✨ Features

✅ **Visual Task Nodes**
✅ **Connect Tasks and Subtasks Visually**
✅ **Dynamic Status Updates**
✅ **Color-Coded Node Status**
✅ **Inline Editing: Task, Status, Assigned To, Deadline**
✅ **Automatic Parent Status Propagation**
✅ **Download Graph as Image (PNG)**
✅ **Persistent Save/Load via API**
✅ **Responsive UI with Sidebar**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/taskit.git
cd taskit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm start
```

### 4. Backend Server (Node/Express assumed)

Ensure your backend is running at:

```
http://localhost:2999/
```

It should expose:

* `GET /load` – loads saved graph
* `POST /save` – saves nodes and edges

---

## 📦 Project Structure

```
src/
├── components/
│   ├── CircleNode.jsx       # Custom React Flow node
│   ├── ReactFlowContext.jsx # Main React Flow logic
│   ├── ContextMenu.jsx      # Right-click context menu
│   └── Sidebar.jsx          # Sidebar form & controls
└── App.js
    index.js
```

---

## 🧹 Core Technologies

* ⚛️ **React.js**
* 🎯 **React Flow**
* 🧙 **React Hooks (useState, useEffect, useCallback)**
* 🎨 **Tailwind CSS or Custom Styling**
* 📡 **Axios (API requests)**
* 🖼️ **html-to-image** (PNG Export)

---

## 🔧 Development Highlights

### 🔗 Node Relationships

Each node can have:

* **Subtasks** (via incoming edges)
* **Parent Tasks** (via outgoing edges)

When all **child nodes** are marked `"completed"`, the **parent node** auto-updates its status.

### ✍️ Editable Fields per Node

* **Task Name** (inline editable)
* **Assigned To**
* **Deadline (datetime-local)**
* **Status** (`unpicked`, `in-progress`, `completed`)

### 🎨 Dynamic Styling

Node background and border colors change based on their status.

### 📂 Save/Load

Graph is saved in your backend via POST and loaded via GET when app starts.

---

## 📸 Export as PNG

Click the **"Download"** button in the sidebar to capture the current flow graph as a `.png` image.

---

## 🧑‍📚 Future Ideas / Features

* ✅ Deadline warnings (red border if past due)
* ⏰ Reminders or email integration
* 📂 Projects categorization
* 👥 Multiple users/collaborators
* 🔍 Search/filter tasks
* 🗕️ Calendar integration

---

## 🙌 Acknowledgements

* [React Flow](https://reactflow.dev/) — for powering the interactive diagrams.
* [html-to-image](https://github.com/bubkoo/html-to-image) — for PNG download.
* Inspiration from [task visualizers](https://excalidraw.com/) & flow editors.

---

## 🧑‍💼 Author

Built with ❤️ by **Suraj Kotagi**

> Want to contribute or collaborate? Drop a ⭐ and connect on [LinkedIn](https://linkedin.com/).

---

## 📜 License

MIT License — Feel free to fork and customize it as needed.
