import { useActions } from '../../store/actions.ts';
import { Button } from 'antd';

const Restart = () => {
  const action = useActions();

  const handleRestart = () => {
    action.restartGame();
    action.restartFirstUser();
    action.restartComputer();
  };
  return (
    <Button type="primary"
            shape="round"
            onClick={handleRestart}>
      Рестарт
    </Button>
  );
};

export default Restart;
