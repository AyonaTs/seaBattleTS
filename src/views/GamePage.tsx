import {useState} from "react";
import {Button, Modal} from "antd";
import Instructions from "./Insructions.tsx";
import styles from '../scss/gamePage.module.scss'
import Game, {ScenesType} from "../classes/Game.ts";

const GamePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const game = new Game()
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.gamePageWrapper}>
      <div className={styles.gamePageHeader}>
      <Button type="primary" onClick={() => game.start(ScenesType.PREPARATION)}>
        Старт
      </Button>
      <Button type="primary" onClick={showModal}>
        Открыть правила
      </Button>
      <Modal title="Правила морского боя" open={isModalOpen} onOk={handleOk}>
        <Instructions/>
      </Modal>
      </div>

      <div className={styles.battlefieldWrapper}>
        <div id="battlefield">

        </div>
      </div>
    </div>
  );
};

export default GamePage