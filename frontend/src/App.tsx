import { Outlet , useNavigate} from "react-router-dom";
import Layout from "./components/Layout";
import { UserProvider } from "./state/UserContext";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();
  const location = window.location;
  useEffect(() => {
    if(location.pathname == '/') {

      if(!localStorage.getItem('userAuth'))
        navigate('/login');
      else 
        navigate('/dashboard');
    }
  }, []);
  return (
    <UserProvider>
      <Layout>
        <Outlet />
      </Layout>
    </UserProvider>
  );
};

export default App;
