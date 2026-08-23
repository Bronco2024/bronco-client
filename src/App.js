import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";
import Loading from "./components/loading-screen/Loading";
import Layout from './components/layout/Layout'
import NotFound from "./NotFound";
import './App.css'

const Homepage = lazy(() => import("./components/homepage/Homepage"))
const Dogs = lazy(() => import("./components/dogs/Dogs"));
const ItemPage = lazy(() => import("./components/item/Item"));
const Login = lazy(() => import("./components/login/Login"));
const ForgotPassword = lazy(() => import("./components/login/ForgotPassword"));
const Register = lazy(() => import("./components/register/Register"));
const Profile = lazy(() => import("./components/profile/Profile"));
const PublishAd = lazy(() => import("./components/publish_ad/PublishAd"));
const Horses = lazy(() => import("./components/horses/Horses"));
const UpdateAd = lazy(() => import("./components/profile/UpdateAd"))
const Admin = lazy(() => import("./components/admin/Admin"))
const AddSponsor = lazy(() => import("./components/admin/AddSponsor"))
const Seeds = lazy(() => import("./components/seeds/Seeds"))
const Accessories = lazy(() => import("./components/accessories/Accessories"))
const Boarding = lazy(() => import("./components/boarding/Boarding"))
const Groomers = lazy(() => import("./components/groomers/Groomers"))
const Veterinarian = lazy(() => import("./components/veterinarians/Veterinarian"))
const Exhibitors = lazy(() => import("./components/exhibitors/Exhibitor"))
const Breeders = lazy(() => import("./components/breeders/Breeders"))
const Schools = lazy(() => import("./components/schools/Schools"))
const Trips = lazy(() => import("./components/trips/Trips"))
const ShowsAndCompetitions = lazy(() => import("./components/shows_and_competitions/ShowsAndCompetitions"))
const CategoryListings = lazy(() => import("./components/pets/CategoryListings"));
const Favorites = lazy(() => import("./components/pets/Favorites"));

const PET_CATEGORY_ROUTES = [
  "cats",
  "birds",
  "fish",
  "rabbits",
  "reptiles",
  "chickens",
  "farm-animals",
  "small-animals",
];

/**
 * PAYMENTS
 * This is currently closed until customer decides to make payments in the website
 */
//const Subscribe = lazy(() => import("./components/subscribe/Subscribe"));
//const Payment = lazy(() => import("./components/payment/Payment"));
const OurProducts = lazy(() => import("./components/our_products/OurProducts"))
// const MyPurchases = lazy(() => import("./components/my_purchases/MyPurchases"))
// const PurchaseDetails = lazy(() => import("./components/my_purchases/PurchaseDetails"))
// const AllPurchases = lazy(() => import("./components/admin/AllPurchases"))
// const Cart = lazy(() => import("./components/cart/Cart"));
// const PaymentForm = lazy(() => import("./components/cart/PaymentForm"));
//const ThankYou = lazy(() => import("./components/payment/ThankYou"))

const AboutUs = lazy(() => import("./components/layout/footer/about-links/aboutus/AboutUs"));
const Regulations = lazy(() => import("./components/layout/footer/about-links/regulations/Regulations"));
const PrivacyPolicy = lazy(() => import("./components/layout/footer/about-links/privacypolicy/PrivacyPolicy"));

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Homepage />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/item/:adId"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <ItemPage />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/item"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <ItemPage />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Login />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/login/forgot-password"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <ForgotPassword />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/register"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Register />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/profile"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/publish_ad"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <PublishAd />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route path="/subscribe/*" element={<Navigate to="/" replace />} />

      {/* <Route path="/subscribe"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <Subscribe />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      {/* <Route path="/subscribe/payment"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      {/* <Route path="/subscribe/payment/thank-you"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <ThankYou />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      <Route
        path="/horses"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Horses />
            </Layout>
          </Suspense>
        }
      />

      {/* DOGS */}
      <Route
        path="/dogs"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Dogs />
            </Layout>
          </Suspense>
        }
      />

      {PET_CATEGORY_ROUTES.map((slug) => (
        <Route
          key={slug}
          path={`/${slug}`}
          element={
            <Suspense fallback={<Loading />}>
              <Layout>
                <CategoryListings slug={slug} />
              </Layout>
            </Suspense>
          }
        />
      ))}

      <Route
        path="/adoption"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <CategoryListings adoptionOnly />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/listings"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <CategoryListings />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/favorites"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Favorites />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/seeds"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Seeds />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/accessories"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Accessories />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/boarding"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Boarding />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/groomers"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Groomers />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/exhibitors"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Exhibitors />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/breeders"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Breeders />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/veterinarians"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Veterinarian />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/schools"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Schools />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/trips"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Trips />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/shows-and-competitions"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <ShowsAndCompetitions />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/our-products"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <OurProducts />
            </Layout>
          </Suspense>
        }
      />

      {/* 
       *
       * PAYMENTS
       * This is currently closed until customer decides to make payments in the website
      <Route path="/cart"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      {/* 
       *
       * PAYMENTS
       * This is currently closed until customer decides to make payments in the website
      <Route path="/cart/payment-form"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <PaymentForm />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      <Route
        path="/profile/update_ad"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <UpdateAd />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/admin"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      {/* 
       *
       * PAYMENTS
       * This is currently closed until customer decides to make payments in the website
      <Route path="/admin/all-purchases"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <AllPurchases />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      <Route
        path="/admin/add-sponsor"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute adminOnly>
              <Layout>
                <AddSponsor />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/about-us"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <AboutUs />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="/regulations"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <Regulations />
            </Layout>
          </Suspense>
        }
      />

      {/*
       *
       * PAYMENTS
       * This is currently closed until customer decides to make payments in the website
      <Route path="/my-purchases"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <MyPurchases />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      {/* 
       *
       * PAYMENTS
       * This is currently closed until customer decides to make payments in the website
      <Route path="/purchase/:id"
        element={
          <Suspense fallback={<Loading />}>
            <ProtectedRoute>
              <Layout>
                <PurchaseDetails />
              </Layout>
            </ProtectedRoute>
          </Suspense>
        }
      /> */}

      <Route
        path="/privacy-policy"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <PrivacyPolicy />
            </Layout>
          </Suspense>
        }
      />

      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <NotFound />
            </Layout>
          </Suspense>
        }
      />

    </Routes>
  );
}

export default App;
