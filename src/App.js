import {Test} from "./TestRestaurant";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

function App() {
  return (
    <div style={{ backgroundColor: 'black', display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Test />
    </div>
  );
}

export default App;
