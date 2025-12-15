import { Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import { UserProvider } from "./state/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Layout>
        <Outlet />
      </Layout>
    </UserProvider>
  );
};

export default App;
