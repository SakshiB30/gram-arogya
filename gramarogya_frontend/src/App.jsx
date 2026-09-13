import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./components/common/ToastProvider";
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </Provider>
  );
}

export default App;
