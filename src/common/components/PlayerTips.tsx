import { useAppSelector } from '../../store/redux.ts';
import Restart from './Restart.tsx';

export const PlayerTips = () => {
  const {winner} = useAppSelector((state) => state.gameParamsReducer);
  const {hitsByFirstPlayer} = useAppSelector((state) => state.firstPlayerReducer);
  const {hitsByComputer} = useAppSelector((state) => state.computerReducer);

  let numberOfHits = hitsByFirstPlayer.length;
  let numberOfSuccessfulHits = hitsByFirstPlayer.filter((hit) => hit.type === 'hit').length;
  let accuracyScore = Math.round(100 * (numberOfSuccessfulHits / numberOfHits));
  let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

  let gameOverPanel = (
    <div>
      <div className="tip-box-title">Игра окончена</div>
      <p className="player-tip">
        {`${winner} победил`}
      </p>
      <Restart/>
    </div>
  );

  let tipsPanel = (
    <div>
      <div className="tip-box-title">Статистика</div>
      <div className="statistic">
        <ul>
          <li>{numberOfSuccessfulHits} удачные попадания</li>
          <li>{accuracyScore > 0 ? `${accuracyScore}%` : `0%`} точность</li>
          <Restart/>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="player-tips">
      {numberOfSuccessfulHits === 20 || successfulComputerHits === 20
        ? gameOverPanel
        : tipsPanel}
    </div>
  );
};
