import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser, refreshToken } from '../services/serverService';
import { fetchToken, deleteToken, getPublicInfo, getAttributes, getCharacterSkills, getAllSkills } from '../store/actions';
import CharInfo from './home/charInfo';

const url = `https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_CALLBACK}&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${process.env.REACT_APP_SCOPES}`

class Home extends Component {

  componentDidMount = () => {
    this.props.fetchToken();
    this.props.getAllSkills();
  }
  
  componentDidUpdate = (prevProps) => {
    // eslint-disable-next-line no-shadow
    const { authorization, getPublicInfo, getAttributes, getCharacterSkills } = this.props;
    if (authorization !== prevProps.authorization &&
        authorization.charId) {
      const time = authorization.date + 1080000 - +(new Date());
      
      if (time > 2000) {
        console.log('поставил сет тайм аут');
        setTimeout(() => refreshToken(authorization.token), time);
        
      } else {
        console.log('сразу выполнил рефреш');
        refreshToken(authorization.token);
      }
      getPublicInfo(authorization.charId);
      getAttributes(authorization);
      getCharacterSkills(authorization);
      

    }
  }

  render() {
    // eslint-disable-next-line no-shadow
    const { authorization, publicInfo, attributes, universe, deleteToken, characterSkills } = this.props;
    return ( 
      <div className='container container-back'>
        <div className="row">
          <header>
            <h1> eveSkills </h1>
            { authorization ? (
              <div>
                <p> { authorization.char} </p>
                <button 
                  type="button"
                  onClick={() => {
                    
                    logoutUser();
                    deleteToken();
                  }}>Logout
                </button>
              </div>
          ) : <a href={url}>Login</a> }
          </header>
          <main>
            <CharInfo 
              publicInfo={publicInfo}
              attributes={attributes}
              characterSkills={characterSkills}
              universe={universe}
            />
          </main>
        </div>
      </div>
    );
  }

};

const loadData = (store, param) => {
  return store.dispatch(fetchToken(param));
};

const mapStateToProps = state => ({

  authorization: state.authorization,
  publicInfo: state.publicInfo,
  attributes: state.attributes,
  characterSkills: state.characterSkills,
  universe: state.universe
});

const mapDispatchToProps = {
  fetchToken,
  getPublicInfo,
  getAttributes,
  deleteToken,
  getCharacterSkills,
  getAllSkills
};

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home),
  loadData
};