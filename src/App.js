import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";
import Layout from './components/layout/Layout'
import NotFound from "./NotFound";
import './App.css'

const Homepage = lazy(() => import("./components/homepage/Homepage"))
const ItemPage = lazy(() => import("./components/item/Item"));
const Login = lazy(() => import("./components/login/Login"));
const ForgotPassword = lazy(() => import("./components/login/ForgotPassword"));
const Register = lazy(() => import("./components/register/Register"));
const Profile = lazy(() => import("./components/profile/Profile"));
const PublishAd = lazy(() => import("./components/publish_ad/PublishAd"));
const Subscribe = lazy(() => import("./components/subscribe/Subscribe"));
const Payment = lazy(() => import("./components/payment/Payment"));
const Horses = lazy(() => import("./components/horses/Horses"));
const UpdateAd = lazy(() => import("./components/profile/UpdateAd"))
const Admin = lazy(() => import("./components/admin/Admin"))
const AddSponsor = lazy(() => import("./components/admin/AddSponsor"))
const Seeds = lazy(() => import("./components/seeds/Seeds"))
const Accessories = lazy(() => import("./components/accessories/Accessories"))
const Boarding = lazy(() => import("./components/boarding/Boarding"))
const Veterinarian = lazy(() => import("./components/veterinarians/Veterinarian"))
const Exhibitors = lazy(() => import("./components/exhibitors/Exhibitor"))
const Breeders = lazy(() => import("./components/breeders/Breeders"))
const Schools = lazy(() => import("./components/schools/Schools"))
const Trips = lazy(() => import("./components/trips/Trips"))
// const Shops = lazy(() => import("./components/shops/Shops"))
const ShowsAndCompetitions = lazy(() => import("./components/shows_and_competitions/ShowsAndCompetitions"))
const OurProducts = lazy(() => import("./components/our_products/OurProducts"))
const ThankYou = lazy(() => import("./components/payment/ThankYou"))
const Cart = lazy(() => import("./components/cart/Cart"));
const PaymentForm = lazy(() => import("./components/cart/PaymentForm"));
const AboutUs = lazy(() => import("./components/layout/footer/about-links/aboutus/AboutUs"));
const Regulations = lazy(() => import("./components/layout/footer/about-links/Regulations"));
const PrivacyPolicy = lazy(() => import("./components/layout/footer/about-links/PrivacyPolicy"));
const MyPurchases = lazy(() => import("./components/my_purchases/MyPurchases"))
const PurchaseDetails = lazy(() => import("./components/my_purchases/PurchaseDetails"))
const AllPurchases = lazy(() => import("./components/admin/AllPurchases"))

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

      <Route path="/login/forgot-password"
        element={
          <Suspense fallback={<Loading message="Loading ForgotPassword..." />}>
            <Layout>
              <ForgotPassword />
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
            <ProtectedRoute condition={(user) => user.numberOfAds > 0}>
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

      <Route path="/subscribe/payment"
        element={
          <Suspense fallback={<Loading message="Loading Payment..." />}>
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/subscribe/payment/thank-you"
        element={
          <Suspense fallback={<Loading message="Loading ThankYou..." />}>
            <ProtectedRoute>
              <Layout>
                <ThankYou />
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

      <Route path="/accessories"
        element={
          <Suspense fallback={<Loading message="Loading accessories..." />}>
            <Layout>
              <Accessories />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/boarding"
        element={
          <Suspense fallback={<Loading message="Loading boarding..." />}>
            <Layout>
              <Boarding />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/exhibitors"
        element={
          <Suspense fallback={<Loading message="Loading exhibitors..." />}>
            <Layout>
              <Exhibitors />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/breeders"
        element={
          <Suspense fallback={<Loading message="Loading breeders..." />}>
            <Layout>
              <Breeders />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/veterinarians"
        element={
          <Suspense fallback={<Loading message="Loading veterinarian..." />}>
            <Layout>
              <Veterinarian />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/schools"
        element={
          <Suspense fallback={<Loading message="Loading schools..." />}>
            <Layout>
              <Schools />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/trips"
        element={
          <Suspense fallback={<Loading message="Loading trips..." />}>
            <Layout>
              <Trips />
            </Layout>
          </Suspense>
        }
      />

      {/* <Route path="/shops"
        element={
          <Suspense fallback={<Loading message="Loading shops..." />}>
            <Layout>
              <Shops />
            </Layout>
          </Suspense>
        }
      /> */}

      <Route path="/shows-and-competitions"
        element={
          <Suspense fallback={<Loading message="Loading shops..." />}>
            <Layout>
              <ShowsAndCompetitions />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/our-products"
        element={
          <Suspense fallback={<Loading message="Loading products..." />}>
            <Layout>
              <OurProducts />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/cart"
        element={
          <Suspense fallback={<Loading message="Loading cart page..." />}>
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/cart/payment-form"
        element={
          <Suspense fallback={<Loading message="Loading payment form..." />}>
            <ProtectedRoute>
              <Layout>
                <PaymentForm />
              </Layout>
            </ProtectedRoute>
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

      <Route path="/admin/all-purchases"
        element={
          <Suspense fallback={<Loading message="Loading all purchases page..." />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <AllPurchases />
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

      <Route path="/about-us"
        element={
          <Suspense fallback={<Loading message="Loading About Us..." />}>
            <Layout>
              <AboutUs />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/regulations"
        element={
          <Suspense fallback={<Loading message="Loading Regulations..." />}>
            <Layout>
              <Regulations />
            </Layout>
          </Suspense>
        }
      />

      <Route path="/my-purchases"
        element={
          <Suspense fallback={<Loading message="Loading my-purchases page..." />}>
            <ProtectedRoute>
              <Layout>
                <MyPurchases />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/purchase/:id"
        element={
          <Suspense fallback={<Loading message="Loading purchase details page..." />}>
            <ProtectedRoute>
              <Layout>
                <PurchaseDetails />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/privacy-policy"
        element={
          <Suspense fallback={<Loading message="Loading Privacy Policy..." />}>
            <Layout>
              <PrivacyPolicy />
            </Layout>
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