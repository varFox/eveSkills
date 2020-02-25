import React from 'react';

const CharInfo = ({authorization, publicInfo}) => {
  return (
    <div className='personalBlock'>
      <div className='personalBlock__avatar'>
        <img src={publicInfo.portrait} />
      </div>
      <div className='personalBlock__info'>
        <span>Character</span><p>{publicInfo.name}</p>
        <span>Corporation</span><p>{publicInfo.corporation_name}</p>
      </div>
    </div>
  );
};

export default CharInfo;
