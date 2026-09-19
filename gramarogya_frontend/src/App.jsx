import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./components/common/ToastProvider";
import './App.css';
import NetworkStatusTest from './offline/NetworkStatusTest';
import SyncTest from './offline/SyncTest';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        {/* <SyncTest/>
        <NetworkStatusTest/> */}
        <AppRoutes />
      </ToastProvider>
    </Provider>
  );
}

export default App;
