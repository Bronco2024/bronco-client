import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import Layout from './components/layout/Layout'

const Homepage = lazy(() => import("./components/homepage/Homepage"))
const ItemPage = lazy(() => import("./components/item/Item"));
const Login = lazy(() => import("./components/login/Login"));
const Register = lazy(() => import("./components/register/Register"));
const Profile = lazy(() => import("./components/profile/Profile"));
const PublishAd = lazy(() => import("./components/publish_ad/PublishAd"));
const Subscribe = lazy(() => import("./components/subscribe/Subscribe"));
const Horses = lazy(() => import("./components/horses/Horses"));
const Test = lazy(() => import("./components/test/Test"));


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
      <Route path="/item"
        element={
          <Suspense fallback={<Loading message="Loading Item page..." />}>
            <Layout>
              <ItemPage />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/login"
        element={
          <Suspense fallback={<Loading message="Loading Login..." />}>
            <Layout>
              <Login />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/register"
        element={
          <Suspense fallback={<Loading message="Loading Register..." />}>
            <Layout>
              <Register />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/profile"
        element={
          <Suspense fallback={<Loading message="Loading Profile..." />}>
            <Layout>
              <Profile />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/publish_ad"
        element={
          <Suspense fallback={<Loading message="Loading Publish Ad..." />}>
            <Layout>
              <PublishAd />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/subscribe"
        element={
          <Suspense fallback={<Loading message="Loading Subscribe..." />}>
            <Layout>
              <Subscribe />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/horses"
        element={
          <Suspense fallback={<Loading message="Loading horses..." />}>
            <Layout>
              <Horses />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/test"
        element={
          <Suspense fallback={<Loading message="Loading horses..." />}>
            <Layout>
              <Test />
            </Layout>
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;