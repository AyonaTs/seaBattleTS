import { useState } from 'react';
import { Button, Drawer } from 'antd';

const Rules = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Правила
      </Button>
      <Drawer title="Правила игры" placement="right" onClose={onClose} open={open}>
        <p>Морской бой - это популярная настольная игра для двух игроков, цель которой - потопить все корабли
          противника.</p>

        <h4>Игровое поле</h4>
        <p>Игровое поле имеет размер 10x10 клеток.</p>

        <h4>Типы кораблей</h4>
        <ul>
          <li>Катер (1 клетка)</li>
          <li>Эсминец (2 клетки)</li>
          <li>Крейсер (3 клетки)</li>
          <li>Линкор(4 клетки)</li>
        </ul>

        <h4>Расстановка кораблей</h4>
        <p>Игроки поочередно расставляют свои корабли на своем поле перед началом игры. Корабли не могут перекрываться и
          соприкасаться друг с другом по горизонтали, вертикали или диагонали.</p>

        <h4>Очередь хода</h4>
        <p>Игра начинается с того, что один из игроков делает ход, выбирая клетку на поле соперника, в которую он хочет
          выстрелить.</p>

        <h4>Попадания и промахи</h4>
        <p>Если снаряд попадает в клетку с кораблем противника, то корабль считается "подбитым". Если снаряд попадает в
          пустую клетку, то это "промах". Игрок отмечает результаты на своем поле.</p>

        <h4>Потопление корабля</h4>
        <p>Когда все клетки корабля поражены, он считается "потопленным". Игрок должен объявить об этом.</p>

        <h4>Цель игры</h4>
        <p>Целью игры является потопить все корабли противника, до того, как сделает это сам соперник. Побеждает игрок,
          который первым потопит все корабли противника.</p>

      </Drawer>
    </>
  );
};

export default Rules;
