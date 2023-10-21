import { useState } from 'react';

import { Button, Input, Radio, RadioChangeEvent } from 'antd';
import styles from './loginPage.module.scss';

import { useNavigate } from 'react-router-dom';
import { useActions } from '../../store/actions.ts';
import { GameMode, Opponent } from '../../common/models/game-models.ts';


const optionsOpponentMode = [
  {label: 'Против компьютера', value: Opponent.Ai},
  {label: 'Против игрока', value: Opponent.User},
];
const optionsGameMode = [
  {label: 'Стрельба до промаха', value: GameMode.Miss},
  {label: 'Стрельба по очереди', value: GameMode.Queue},

];

const LoginPage = () => {
  const [gameMode, setGameMode] = useState(GameMode.Miss);
  const [opponent, setOpponent] = useState(Opponent.Ai);
  const [firstUser, setFirstUser] = useState('');
  const [secondUser, setSecondUser] = useState('');
  const navigate = useNavigate();
  const actions = useActions();
  const handleOpponent = ({target: {value}}: RadioChangeEvent) => {
    setOpponent(value);
  };
  const handleGameMode = ({target: {value}}: RadioChangeEvent) => {
    setGameMode(value);
  };
  const handleStartPlay = () => {
    actions.setGameParams({
      firstUser,
      secondUser,
      gameMode,
      opponent,
    });
    navigate('/game/');
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPageHeader}><h1>Морской бой</h1></div>
      <Input placeholder="Имя игрока"
             onInput={(value) => setFirstUser((value.target as HTMLInputElement).value)}/>

      <Radio.Group
        options={optionsGameMode}
        onChange={handleGameMode}
        value={gameMode}
        optionType="button"
        buttonStyle="solid"/>
      <Radio.Group
        options={optionsOpponentMode}
        onChange={handleOpponent}
        value={opponent}
        optionType="button"
        buttonStyle="solid"/>
      {(opponent === 'user') &&
        <Input placeholder="Имя второго игрока"
               onInput={(value) => setSecondUser((value.target as HTMLInputElement).value)}/>
      }
      <Button
        type="primary"
        shape="round"
        onClick={handleStartPlay}>К игре</Button>
    </div>
  );
};

export default LoginPage;
