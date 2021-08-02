import TextEditor from "./TextEditor";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom"
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/notes/${uuidV4()}`}/>
        </Route>
        <Route path="/notes/:id" >
          <TextEditor/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;