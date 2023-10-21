import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './views/login-page/LoginPage.tsx';
import { GamePage } from './views/game-page/GamePage.tsx';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<LoginPage/>}/>
          <Route path={'/game'} element={<GamePage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
