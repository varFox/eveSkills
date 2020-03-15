import React from 'react';
import perception from '../../images/34_64_12.png';
import memory from '../../images/31_64_15.png';
import willpower from '../../images/34_64_15.png';
import intelligence from '../../images/31_64_16.png';
import charisma from '../../images/31_64_14.png';


const CharInfo = ({ publicInfo, attributes, universe, characterSkills }) => {
  return (
    <div className='personalBlock'>
      <div className='personalBlock__avatar'>
        <img src={publicInfo.portrait} />
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
      <div className='personalBlock__info'>
        <span>Character</span><p>{publicInfo.name}</p>
        <span>Corporation</span><p>{publicInfo.corporation_name}</p>
        <span>Total SP</span><p>{characterSkills.total_sp}</p>
        <span>Unallocated SP</span><p>{characterSkills.unallocated_sp}</p>
        
      </div>  
      <div className='personalBlock__skills'>
        <h2>Skills</h2>
        <SkillsBlock 
          universe={universe}
          characterSkills={characterSkills}
        />
      </div>
    </div>
  );
};

const SkillsBlock = ({universe, characterSkills}) => {
  
  const renderItems = (groupsSkills) => {
    return groupsSkills.map(group => {     
      if(group.published) {
        let i = 0;
        group.types.map(type => {
          characterSkills.skills.map(skill => {
            if (skill.skill_id === type.typeID) {
              return i += skill.trained_skill_level;
            }
          });
          return i;
        });
        const sum = group.types.length * 5;
        const widthBlock = {
          width: `${Math.round(100 * i / sum)}%`
        }
        return (
          <div
            key={group.groupID}
            className='personalBlock__skillsGroup'>
            <div className='bgSkills' style={widthBlock}></div>
            <span>{group.name.en}</span>
            <p title='mastering the degree'>{i}/{sum}</p>
          </div>
        )
      }
    });
  }

  if(!universe.groups || !characterSkills) {
    return <></>
  }
  const items = renderItems(universe.groups)
  return (
    <div className='personalBlock__skillsGroups'>
      
        {items}
      
    </div>
  );
}

export default CharInfo;
