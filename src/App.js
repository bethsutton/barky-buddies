import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// COMPONENTS
import Navbar from './components/Navbar';
import title from './components/assets/barky-buddies-title.png';
import PrivateRoute from './components/PrivateRoute';
// PAGES
import Explore from './pages/Explore';
import Train from './pages/Train';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Category from './pages/Category';
import CreateBuddy from './pages/CreateBuddy';

function App() {
  return (
    <>
      <Router>
        <img className="barky-buddies-title" src={title} alt="Barky Buddies" />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/train" element={<Train />} />

          {/* :buddyType NAME FOR PARAMS IN CATEGORY PAGE */}
          <Route path="/category/:buddyType" element={<Category />} />

          {/* PRIVATE ROUTE */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/create-buddy" element={<CreateBuddy />} />
          {/* <Route path="/edit-buddy/:buddyId" element={<EditBuddy />} /> */}
          {/* <Route
            path="/category/:buddyType/:buddyId"
            element={<Buddy />}
          /> */}
          {/* <Route path="/contact/:parentId" element={<Contact />} /> */}
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
