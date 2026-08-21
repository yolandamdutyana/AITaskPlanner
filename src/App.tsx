import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import EmailGenerator from '@/pages/EmailGenerator';
import MeetingNotes from '@/pages/MeetingNotes';
import TaskPlanner from '@/pages/TaskPlanner';
import ResearchAssistant from '@/pages/ResearchAssistant';
import Chatbot from '@/pages/Chatbot';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/email" element={<EmailGenerator />} />
          <Route path="/meeting" element={<MeetingNotes />} />
          <Route path="/tasks" element={<TaskPlanner />} />
          <Route path="/research" element={<ResearchAssistant />} />
          <Route path="/chat" element={<Chatbot />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
