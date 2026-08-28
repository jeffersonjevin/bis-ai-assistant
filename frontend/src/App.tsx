import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Standards from './pages/Standards';
import Services from './pages/Services';
import About from './pages/About';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
