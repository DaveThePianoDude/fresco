import PropTypes from 'prop-types'
import React from 'react'
import {Map} from 'immutable'
import {NavLink, Redirect, Route, Switch, withRouter} from 'react-router-dom'

import Icon from '../Icon'
import StyleStylePull from './StylePull'
import Infotip from '../Infotip'

class StylePull extends React.Component {

        constructor(props) {
                super(props)

                this.state = {
                        headers: Map({}),
                        id: '',
                        makeLayers: false,
                        type: '',
                        url: '',
                }
        }

        render (){
                const {match} = this.props

                return <div>
                        <h2 className="content-title content-title-sub content-title-light">
                                <span className="content-title-label">Pull Style</span>

                                <div className="content-title-options">
                                        <NavLink to={`${match.url}/pull`} className={'content-title-option interactive infotip-trigger'}>
                                                <Icon icon={'pull'}/>
                                                <Infotip direction={'y'} message={'from git'}/>
                                        </NavLink>
                                </div>
                        </h2>

                </div>
        }

}

StylePull.propTypes = {
	handle: PropTypes.object,
	history: PropTypes.object,
	match: PropTypes.object,
	path: PropTypes.array,
	style: PropTypes.object,
}

export default withRouter(StylePull)
