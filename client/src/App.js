import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './components/Login';
import SignUp from './components/SignUp';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<><Calendar/> </>}/>
          <Route path='login' element= {<> <Login/></>}/>
          <Route path='signUp' element= {<> <SignUp/></>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
