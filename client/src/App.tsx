import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/Common/NavBar";
import Home from "./pages/Home";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  MsalProvider,
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "create",
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => instance.logout();

  return (
    <div className="">
      <AuthenticatedTemplate>
        <NavBar>
          {activeAccount && (
            <div className="text-gray-300 ">{activeAccount.name}</div>
          )}
          <button className="p-2 bg-gray-300 rounded-xl" onClick={handleLogout}>
            Sign Out
          </button>
        </NavBar>

        <Home />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="flex items-center justify-center w-full h-screen text-3xl">
          <button
            className="p-4 bg-gray-500 rounded-xl"
            onClick={handleRedirect}
          >
            Sign In
          </button>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
};

function App({ instance }) {
  return (
    <MsalProvider instance={instance}>
      <WrappedView />
    </MsalProvider>
  );
}

export default App;
