import { HashRouter as Router, Route, Routes } from 'react-router-dom';
// PAGES
import Home from './pages/Home';
// COMPONENTS
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="flex flex-col justify-start h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
