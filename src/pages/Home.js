import React, { Component } from 'react';
import { connect } from 'react-redux';
import SkillService from '../services/skillService';
import { logoutUser, refreshToken } from '../services/serverService';
import { fetchToken, deleteToken, getPublicInfo, getAttributes } from '../store/actions';
import CharInfo from './home/charInfo';

const url = `https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_CALLBACK}&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=${process.env.REACT_APP_SCOPES}`

class Home extends Component {

  skills = new SkillService();

  componentDidMount = () => {
    this.props.fetchToken();
  }
  
  componentDidUpdate = (prevProps) => {
    const { authorization, fetchToken, getPublicInfo, getAttributes } = this.props;

    if (authorization !== prevProps.authorization &&
        authorization.charId) {
      const time = authorization.date + 1080000 - +(new Date());
      
      if (time > 2000) {
        console.log('поставил сет тайм аут')
        setTimeout(() => refreshToken(authorization.token), time);
        getPublicInfo(authorization.charId);
        getAttributes(authorization);
      } else {
        console.log('сразу выполнил рефреш')
        refreshToken(authorization.token)
      }

    }
  }

  render() {
    const { authorization, publicInfo, attributes, deleteToken } = this.props;
    return ( 
      <div className='container container-back'>
        <div className="row">
        <header>
          <h1>eveSkills</h1>
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
            authorization={authorization}
            publicInfo={publicInfo}
            attributes={attributes}
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
  attributes: state.attributes
});

const mapDispatchToProps = {
  fetchToken,
  getPublicInfo,
  getAttributes,
  deleteToken
};

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home),
  loadData
};