import React from 'react';
import perception from '../../images/34_64_12.png';
import memory from '../../images/31_64_15.png';
import willpower from '../../images/34_64_15.png';
import intelligence from '../../images/31_64_16.png';
import charisma from '../../images/31_64_14.png';


const CharInfo = ({ publicInfo, attributes, characterSkills }) => {
  return (
    <div className='personalBlock'>
      <div className='personalBlock__avatar'>
        <img src={publicInfo.portrait} />
      </div>
      <div className='personalBlock__info'>
        <span>Character</span><p>{publicInfo.name}</p>
        <span>Corporation</span><p>{publicInfo.corporation_name}</p>
        <span>Total SP</span><p>{characterSkills.total_sp}</p>
        <span>Unallocated SP</span><p>{characterSkills.unallocated_sp}</p>
        <span>Skill points</span>
        <div className='personalBlock__skillPoints' >
          <div className='skillPoint' title='perception'>
            <img src={perception} alt='percetion'/>
            <p>{attributes.perception}</p>
          </div>
          <div className='skillPoint' title='memory'>
            <img src={memory} alt='memory'/>
            <p>{attributes.memory}</p>
          </div>
          <div className='skillPoint' title='willpower'>
            <img src={willpower} alt='willpower'/>
            <p>{attributes.willpower}</p>
          </div>
          <div className='skillPoint' title='intelligence'>
            <img src={intelligence} alt='intelligence'/>
            <p>{attributes.intelligence}</p>
          </div>
          <div className='skillPoint' title='charisma'>
            <img src={charisma} alt='charisma'/>
            <p>{attributes.charisma}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharInfo;
