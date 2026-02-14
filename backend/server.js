const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const complaints = require('./routes/complaints');
const notifications = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// io.on connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (complaintId) => {
        socket.join(complaintId);
        console.log(`User joined room: ${complaintId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            const { complaintId, senderId, text } = data;
            const newMessage = await Message.create({
                complaint: complaintId,
                sender: senderId,
                text
            });

            const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name role');

            io.to(complaintId).emit('receive_message', populatedMessage);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/complaints', complaints);
app.use('/api/notifications', notifications);

// Basic Route
app.get('/', (req, res) => {
    res.send('Digital Complaint Portal API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Start background services interval
const { runAutoAssignmentInternal, runSLAEscalationInternal } = require('./controllers/complaints');
const BACKGROUND_SERVICE_INTERVAL = 1 * 60 * 1000; // Check every 1 minute

setInterval(async () => {
    try {
        // Run Auto-Assignment
        const assigned = await runAutoAssignmentInternal();
        if (assigned > 0) console.log(`[Service] Auto-assigned ${assigned} complaints.`);

        // Run SLA Escalation
        const escalated = await runSLAEscalationInternal();
        if (escalated > 0) console.log(`[Service] Escalated ${escalated} overdue complaints.`);

    } catch (err) {
        console.error('[Service] Error in background services:', err);
    }
}, BACKGROUND_SERVICE_INTERVAL);
