import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, Radio} from 'antd';
import {useActions} from "../store/actions.ts";
import {GameSlicePayload} from "../store/reducer/GameSlice.ts";
import styles from '../scss/loginPage.module.scss'
const LoginPage = () => {
  const {setGameParams} = useActions();

  const navigate = useNavigate();

  const playerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSecondInputVisible(event.target.value === "users")
  }

  const [isSecondInputVisible, setIsSecondInputVisible] = useState(false);
  const onFinish = (values: GameSlicePayload) => {
    setGameParams(values)
    navigate('/game/')
  }

  return (
    <div className={styles.authForm}>
      <Form
        onFinish={onFinish}
        style={{maxWidth: 300}}
      >
        <Form.Item
          label="Введи имя"
          name="firstUser"
          rules={[{required: true, message: 'Введи своё имя!'}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="gameType"
          label="Тип игры"
          rules={[{required: true, message: 'Выбери тип игры!'}]}
        >
          <Radio.Group>
            <Radio.Button value="miss">Игра до промаха</Radio.Button>
            <Radio.Button value="queue">Игра по очереди</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="playerType"
          rules={[{required: true, message: 'Выбери тип игры!'}]}
        >
          <Radio.Group onChange={() => playerChange}>
            <Radio.Button value="computer">Игра с компьютером</Radio.Button>
            <Radio.Button value="users">Игра вдвоём</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {isSecondInputVisible &&
            <Form.Item
                label="Введи имя второго игрока"
                name="secondUser"
                rules={[{required: true, message: 'Введи имя!'}]}
            >
                <Input/>
            </Form.Item>
        }
        <Form.Item wrapperCol={{span: 12, offset: 6}}>
          <Button type="primary" htmlType="submit">
            Играть
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;