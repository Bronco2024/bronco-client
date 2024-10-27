import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import Layout from './components/layout/Layout'

const Homepage = lazy(() => import("./components/Homepage"))

const Loading = ({ message }) => <div>{message || "Loading..."}</div>;

function App() {

  return (
    <Routes>
      <Route path="/"
        element={
          <Suspense fallback={<Loading message="Loading Home..." />}>
            <Layout>
              <Homepage />
            </Layout>
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;