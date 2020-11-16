import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {NavLink, Redirect, Route, Switch} from 'react-router-dom'

import React from 'react'

import Icon from '../Icon'
import LayerEditActions from './LayerEditActions'
import LayerEditFeatures from './LayerEditFeatures'
import LayerEditJson from './LayerEditJson'
import LayerEditView from './LayerEditView'
import Infotip from '../Infotip'
import modelMap from '../../model/map'
import modelPreference from '../../model/preference'
import modelStyle from '../../model/style'

import Property from '../Property'

class GlobalLayerEdit extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			regex:''
		}
	}

	handleRegexChange = ({value})=>{

		const {handleSearchChange} = this.props

		//('got here')
		this.setState({
			regex: value,
		})
		console.log('passing this:'+value)
		handleSearchChange(value)
	}

	render (){
		const {searchSubset} = this.props

		console.log("HERE IS YOUR SUBSET: " + searchSubset)

		const {layer} = this.props

		if (!layer) return <div/>

		return <div>
			{this.renderTitle()}
			<div className="position-relative">
				{this.renderSection()}
			</div>


		</div>
	}

	renderSection (){
		const {editMode, focusFeatures, error, match, layer, path, style} = this.props

		let redirect
		if (focusFeatures.length > 0){
			redirect = `${match.url}/features`
		} else if (editMode === 'json'){
			redirect = `${match.url}/json`
		} else {
			redirect = `${match.url}/editor`
		}

		return (
			<Switch>
				<Route path={`${match.url}/actions`}
					render={(props) => (
						<LayerEditActions
							error={error}
							layer={layer}
							path={path}
							style={style}
						/>
					)}/>
				<Route path={`${match.url}/json`}
					render={(props) => (
						<LayerEditJson
							error={error}
							layer={layer}
							path={path}
							style={style}
						/>
					)}/>

				<Route path={`${match.url}/editor`}
					render={(props) => (
						<LayerEditView
							error={error}
							layer={layer}
							path={path}
							style={style}
							searchSubset={props.searchSubset}
						/>
					)}/>
				<Route path={`${match.url}/features`}
					render={(props) => (
						<LayerEditFeatures
							error={error}
							layer={layer}
							path={path}
							style={style}
						/>
					)}/>
				<Redirect to={redirect}/>
			</Switch>
		)
	}

	renderTitle (){
		const {focusFeatures, match, layer, handleSearchChange} = this.props,
			{search} = this.state

		const label = layer.getIn(['id'])

		const handle = {
			change: this.handleRegexChange
		}

		console.log("handleSearchChange="+handleSearchChange)

		const {searchSubset} = this.props

		const itemsArray = searchSubset.split(';');
		const items = itemsArray.map(function(item){
      return <li> {item} </li>;
    });

		return (
			<h2 className="content-title content-title-sub content-title-light clearfix">
				<span className="text-overflow-ellipsis content-title-label">
				<h6>{items}</h6>
				<Property
								handle={handle}
								info={'layer filter regex'}
								label={'layersearch'}
								name={'layersearch'}
								path={null}
								required={true}
								type={'string'}
								value={search}
				/>
				</span>
				<div className="content-title-options">
					{focusFeatures.length > 0 && (
						<NavLink to={`${match.url}/features`} className={'content-title-option interactive infotip-trigger'}>
							<Icon className="text-info" icon={'map-focus'} weight={'solid'}/>
							<Infotip direction={'y'} message={'layer features'}/>
						</NavLink>
					)}
					<NavLink to={`${match.url}/editor`} className={'content-title-option interactive infotip-trigger'}>
						<Icon icon={'editor'}/>
						<Infotip direction={'y'} message={'layer editor'}/>
					</NavLink>
					<NavLink to={`${match.url}/json`} className={'content-title-option interactive infotip-trigger'}>
						<Icon icon={'code'}/>
						<Infotip direction={'y'} message={'layer json'}/>
					</NavLink>
					<NavLink to={`${match.url}/actions`} className={'content-title-option interactive infotip-trigger'}>
						<Icon icon={'action'}/>
						<Infotip direction={'y'} message={'layer actions'}/>
					</NavLink>
				</div>
			</h2>
		)
	}
}

GlobalLayerEdit.propTypes = {
	editMode: PropTypes.string,
	error: PropTypes.object, // map
	layer: PropTypes.object,
	layerId: PropTypes.string,
	match: PropTypes.object,
	path: PropTypes.array,
	style: PropTypes.object
}


const mapStateToProps = (state, props) => {
	const {layerId} = props
	return {
		editMode: modelPreference.selectors.getIn(state, {path:['editMode']}),
		focusFeatures: modelMap.selectors.focusFeaturesByLayerId(state, {layerId}),
		layer: modelStyle.selectors.getIn(state, {path: props.path}),
	}
}
export default connect(
  mapStateToProps,{}
)(GlobalLayerEdit)
