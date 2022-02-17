import Home from "./component/Home";
import Cryptocurrency from "./component/Cryptocurrency";
import { Route, Routes } from "react-router-dom";
import Exchanges from "./component/Exchanges";
import "./component/style.css";
import Portfolio from "./component/Portfolio";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import News from "./component/News";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const login = () => {
    signInWithPopup(auth, provider);
  };

  const logout = () => {
    signOut(auth);
  };
  return (
    <div className="App">
      <div className="navbar" id="nav">
        <Link className="logo" to="/">
          CRYPTO WALLET
        </Link>
        <div className="link">
          <Link to="/">Home</Link>
          <Link to="/Cryptocurrency">Cryptocurrency</Link>
          <Link to="/Exchanges">Exchanges</Link>
          {user ? (
            <>
              <Link to="/Portfolio">Portfolio</Link>
              <Link to="/News">News</Link>
              <Link to="/" onClick={logout}>
                {user.displayName} <BiLogOut />
              </Link>
            </>
          ) : (
            <>
              <Link to="/News">News</Link>
              <Link to="/" onClick={login}>
                Login <BiLogIn />
              </Link>
            </>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cryptocurrency" element={<Cryptocurrency />} />
        <Route path="/Exchanges" element={<Exchanges />} />
        <Route path="/Portfolio" element={<Portfolio user={user} />} />
        <Route path="/News" element={<News />} />
      </Routes>
    </div>
  );
}

export default App;
