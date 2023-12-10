import './App.css';
import Footer from './component/footer';
import Home from './component/home';
import InstructorPage from './component/instructorPage';
import InstructorDashboard from './component/instructorDashboard';
import Navbar from './component/navbar';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import AddCourse from './component/addCoursePage';
import Test from './component/test';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path='/' Component={Home}></Route>
          <Route exact path='/instructor-login' Component={InstructorPage}></Route>
          <Route exact path='/instructor-dashboard' Component={InstructorDashboard}></Route>
          <Route exact path='/instructor-addcourse' Component={AddCourse}></Route>
          <Route exact path='/test' Component={Test}></Route>
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
