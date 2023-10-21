import { FC } from 'react';
import Rules from './rules/Rules.tsx';

export const GameHeader: FC = () => {
  return (
    <header>
      <h1>Морской бой</h1>
      <sub>
        <Rules/>
      </sub>
    </header>
  );
};
