import './App.css';
import {Container} from "react-bootstrap";
import {BrowserRouter as Router} from 'react-router-dom'
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Switch from "react-bootstrap/Switch";

function App() {
  return (
      <>
      <Container>
          <Router>
              <Switch>
                  <Route exact path="/home" component={Home}/>
                  <Route exact path="/login" component={SignIn}/>
              </Switch>
          </Router>
        <SignIn/>
      </Container>
      </>
  );
}

export default App;

