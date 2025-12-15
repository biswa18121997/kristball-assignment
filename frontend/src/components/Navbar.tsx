
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem("userAuth") || "null");

  function signOut() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav className="bg-neutral-700/50 flex gap-5 p-4">
      <div className="flex gap-2">
        <img src="3cbd9c1b732a3d8d683b356b53b5c1c0.jpg" className="h-10 w-10 rounded-full" />
        Indian Army
      </div>

      <div className="flex gap-3 justify-center items-center">
        {authData ? (
          <>
            <span>Welcome, <b>{authData.userDetails.name}</b></span>
            <div className='flex flex-col'>
                        <h1> You Are : {authData?.userDetails?.role}   </h1>
                        <h1>from Base: {authData?.userDetails?.base?.name}({authData?.userDetails?.base?.location})</h1>
                        <h1>Base code : {authData?.userDetails?.base?.baseCode}</h1>

            </div>
            <button onClick={signOut} className="border p-1 rounded ml-20">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
