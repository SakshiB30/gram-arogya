import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "./MainLayout";
import AshaOfflineLayout from "./AshaOfflineLayout";
import useNetworkStatus from "../offline/useNetworkStatus";


const NetworkAwareLayout = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const online = useNetworkStatus();
  const location = useLocation();


  const isAsha =
    user?.role === "ASHA";

  const isOfflineRoute =
    location.pathname.startsWith(
      "/app/offline"
    );


  /*
   * ==========================================================
   * ASHA OFFLINE
   * ==========================================================
   *
   * If ASHA loses internet while using
   * any normal online page, redirect to
   * the offline beneficiaries page.
   */
  if (
    isAsha &&
    !online &&
    !isOfflineRoute
  ) {
    return (
      <Navigate
        to="/app/offline/beneficiaries"
        replace
      />
    );
  }


  /*
   * ==========================================================
   * ASHA ONLINE
   * ==========================================================
   *
   * If internet comes back while ASHA
   * is inside the offline workspace,
   * return to the normal beneficiary page.
   */
  if (
    isAsha &&
    online &&
    isOfflineRoute
  ) {
    return (
      <Navigate
        to="/app/beneficiaries"
        replace
      />
    );
  }


  /*
   * ==========================================================
   * OFFLINE ASHA WORKSPACE
   * ==========================================================
   */
  if (
    isAsha &&
    !online
  ) {
    return <AshaOfflineLayout />;
  }


  /*
   * ==========================================================
   * NORMAL APPLICATION
   * ==========================================================
   *
   * ADMIN
   * ANM
   * ONLINE ASHA
   */
  return <MainLayout />;
};


export default NetworkAwareLayout;