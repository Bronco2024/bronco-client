import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import ProtectedRoute from "./components/context/ProtectedRoute";
import Layout from './components/layout/Layout'
import NotFound from "./NotFound";

const Homepage = lazy(() => import("./components/homepage/Homepage"))
const ItemPage = lazy(() => import("./components/item/Item"));
const Login = lazy(() => import("./components/login/Login"));
const Register = lazy(() => import("./components/register/Register"));
const Profile = lazy(() => import("./components/profile/Profile"));
const PublishAd = lazy(() => import("./components/publish_ad/PublishAd"));
const Subscribe = lazy(() => import("./components/subscribe/Subscribe"));
const Horses = lazy(() => import("./components/horses/Horses"));
const Test = lazy(() => import("./components/test/Test"));
const UpdateAd = lazy(() => import("./components/profile/UpdateAd"))
const Admin = lazy(() => import("./components/admin/Admin"))
const AddSponsor = lazy(() => import("./components/admin/AddSponsor"))
const Seeds = lazy(() => import("./components/seeds/Seeds"))


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
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/publish_ad"
        element={
          <Suspense fallback={<Loading message="Loading Publish Ad..." />}>
            <ProtectedRoute>
              <Layout>
                <PublishAd />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/subscribe"
        element={
          <Suspense fallback={<Loading message="Loading Subscribe..." />}>
            <ProtectedRoute>
              <Layout>
                <Subscribe />
              </Layout>
            </ProtectedRoute>
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

      <Route path="/seeds"
        element={
          <Suspense fallback={<Loading message="Loading seeds..." />}>
            <Layout>
              <Seeds />
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

      <Route path="/profile/update_ad"
        element={
          <Suspense fallback={<Loading message="Loading Update ad page..." />}>
            <ProtectedRoute>
              <Layout>
                <UpdateAd />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/admin"
        element={
          <Suspense fallback={<Loading message="Loading Admin page..." />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/admin/add-sponsor"
        element={
          <Suspense fallback={<Loading message="Loading Add Sponsor page..." />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <AddSponsor />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="*"
        element={
          <Suspense fallback={<Loading message="Loading Not Found..." />}>
            <NotFound />
          </Suspense>
        }
      />

    </Routes>
  );
}

export default App;