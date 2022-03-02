import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// COMPONENTS
import Navbar from './components/Navbar';
import title from './components/assets/barky-buddies-title.png';
import PrivateRoute from './components/PrivateRoute';
// PAGES
import Explore from './pages/Explore';
import Buddies from './pages/Buddies';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <>
      <Router>
        <img className="barky-buddies-title" src={title} alt="Barky Buddies" />
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/buddies" element={<Buddies />} />
          {/* :categoryName NAME FOR PARAMS IN CATEGORY PAGE */}
          {/* <Route path="/category/:categoryName" element={<Category />} /> */}

          {/* PRIVATE ROUTE */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/create-listing" element={<CreateListing />} /> */}
          {/* <Route path="/edit-listing/:listingId" element={<EditListing />} /> */}
          {/* <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          /> */}
          {/* <Route path="/contact/:landlordId" element={<Contact />} /> */}
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
