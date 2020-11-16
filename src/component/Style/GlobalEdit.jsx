import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
//import {NavLink, Redirect, Route, Switch} from 'react-router-dom'
import {NavLink, Link, Redirect, Route, Switch} from 'react-router-dom'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

import modelApp from '../../model/app'
import modelLayer from '../../model/layer'
import modelMap from '../../model/map'
import modelStyle from '../../model/style'
import Field from '../Field'
import Icon from '../Icon'
import LayerAdd from '../LayerAdd'
import GlobalLayerEdit from '../GlobalLayerEdit'
import Infotip from '../Infotip'

class GlobalEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			layerAddShown:false,
			searchShow:false,
			search:'',
			searchSubset:';'
		}
	}

	handleSearchChange = ({value})=>{
		console.log('handling search chg. value='+value)
		this.setState({
			search: value,
			searchSubset: ''
		})
	}

	handleSearchShowSet = ({show})=>{
		this.setState({
			searchShow: show,
		})
	}

	handleChange = ()=>{

	}
	handleOnDragEnd = ()=>{

	}

	//handleSearchChange = ({value})=>{
	//	console.log('handing search chg.')
	//	this.setState({
	//		search: value,
	//	})
	//}

	handleSearchShowSet = ({show})=>{
		this.setState({
			searchShow: show,
		})
	}

	handleVisibility = async ({e, layerId, show})=>{
		//e.stopPropagation();

		const {style} = this.props
		// get layer path
		const layerPath = modelLayer.helpers.getLayerPath({layerId, style})
		const visibilityPath = [...layerPath, 'layout', 'visibility']
		await modelStyle.actions.setIn({
			path: visibilityPath,
			value: show? 'visible': 'none'
		})
	}

		render (){
			const {focusLayers, layers, match} = this.props,
				{search, searchShow} = this.state

			const handle = {
				change: this.handleSearchChange
			}

			return (
				<div className="content-body content-body-flex">
					<div className="content-body-left">
						{searchShow ?
							<div className="d-flex p-1">
								<div className="property flex-fill">
									<Field
										autoFocus={true}
										handle={handle}
										name={'search'}
										placeholder={'Search for layers'}
										inputClass={'form-control-sm font-sm'}
										inputNoAC={true}
										type={'string'}
										value={search}
									 />
								</div>
								<div className="search-option" onClick={()=>this.handleSearchShowSet({show:false})}>
									<Icon icon={'close'}/>
								</div>
							</div>
							:
							<h2 className="content-title content-title-sub clearfix">
								<span className="content-title-label text-overflow-ellipsis">
									Layers ({layers? layers.size: 0})
								</span>
								<div className="content-title-options">
									<span onClick={()=>this.handleSearchShowSet({show:true})} className={'content-title-option interactive infotip-trigger'}>
										<Icon icon={'search'}/>
										<Infotip direction={'y'} message={'search'}/>
									</span>
									<Link to={`${match.url}/add`} className={'content-title-option interactive infotip-trigger'}>
										<Icon icon={'add'}/>
										<Infotip direction={'y'} message={'add layer'}/>
									</Link>
								</div>
							</h2>
						}
						{focusLayers && Object.keys(focusLayers).length > 0 && (
							<div className="content-body-title bg-info pl-1">
								<Icon className="mr-1" icon={'map-focus'} weight={'solid'}/>
								{Object.keys(focusLayers).length} Layers Focused
								<button type="button" className="btn btn-outline-light btn-xs float-right"
									onClick={this.handleFocusClose}>
									<Icon icon={'close'}/>
								</button>
							</div>
						)}
						{this.renderList()}
					</div>
					{this.renderRight()}
				</div>
			)
		}

		renderList (){
			const {error, focusLayers, layers, match} = this.props,
				{search} = this.state

			if (!layers){
				return <div/>
			}

			return (
				<div className="">
					<DragDropContext onDragEnd={this.handleOnDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
								<div ref={provided.innerRef}>
									{layers !== undefined && layers.map((layer,i)=>{

										//console.log("Is this your subset? " + layers)

										if (!layer || !layer.has) return <div key={i}/>
										const layerId = layer.has('id')? layer.get('id'): `layer-${i}`

										if (focusLayers && Object.keys(focusLayers).length > 0 && !focusLayers[layerId]) return <div key={i}/>
										if (search && search.length > 0 && layerId.toLowerCase().indexOf(search.toLowerCase()) === -1) return <div key={i}/>

										let className = 'content-body-left-row row-icons '
										if (error && error.hasIn([i])) className += ' error'

										const color = modelLayer.helpers.getColor({layer}) || '#FFFFFF'
										const icon = `layer-${modelLayer.helpers.getType({layer})}`

										this.state.searchSubset += layerId + ';'

										return <Draggable key={layerId} draggableId={layerId} index={i}>
											{(provided, snapshot) => (
												<NavLink key={layerId} to={`${match.url}/${layerId}`} className={className} ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}>

														<div className="row-icon-left">
															<Icon className="md-shadow" icon={icon} color={color} weight={'solid'}/>
														</div>
														{layerId}
														{this.renderLayerOption({layer, layerId, layerInd:i})}
												</NavLink>
											)}
										</Draggable>
									})}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
			)
		}

		renderLayerOption ({layer, layerId, layerInd}){
			const {error, focusLayers} = this.props

			if (error && error.hasIn([layerInd])){
				return (
					<div className="row-icon-right">
						<Icon className="md-shadow text-danger" icon={'alert'} weight={'solid'}/>
					</div>
				)
			}

			if (focusLayers && focusLayers[layerId]){
				return (
					<div className="row-icon-right">
						<Icon className="md-shadow text-info" icon={'map-focus'} weight={'solid'}/>
						<b className="text-info focus-layer-features">{focusLayers[layerId]}</b>
					</div>
				)
			}
			if (layer.getIn(['layout','visibility']) === 'none'){
				return (
					<div onClick={(e)=>this.handleVisibility({e, layerId, show:true})} className="row-icon-right">
						<Icon className="md-shadow text-muted" icon={'invisible'} weight={'solid'}/>
					</div>
				)
			}

			return (
				<div onClick={(e)=>this.handleVisibility({e, layerId, show:false})} className="row-icon-right">
					<Icon className="md-shadow" icon={'visible'} weight={'solid'}/>
				</div>
			)
		}

		renderRight (){
			console.log('rendering right...')
			const {error, match, path, style} = this.props

			const layersPath = [...path, 'current', 'layers']

			//console.log('match='+ match.url)

			let redirect = `${match.url}/add`
			const layers = style.getIn(['current','layers'])

			console.log('layers=' + layers)

			if (layers && layers.size > 0){
				redirect = `${match.url}/${layers.getIn([0, 'id'])}`
			}

			return (
				<div className="content-body-right">
					<Switch>
						<Route path={`${match.url}/add`}
							render={(props) => <LayerAdd path={layersPath} style={style} {...props}/>}/>
						<Route path={`${match.url}/:layerId`}
							render={(props) => {
								// get index for layerId
								console.log('gettin index for layerId...')
								const layerIndex = modelLayer.helpers.getIndexById({layerId: props.match.params.layerId, path:layersPath, style})
								return (
									<GlobalLayerEdit
										error={error && error.has && error.getIn([layerIndex])}
										layerId={props.match.params.layerId}
										layerIndex={layerIndex}
										path={[...layersPath, layerIndex]}
										style={style} {...props}
										handleSearchChange={this.handleSearchChange}
										searchSubset={this.state.searchSubset}
									/>
								)
							}}/>
						<Redirect to={redirect}/>
					</Switch>
				</div>
			)
		}
	}

GlobalEdit.propTypes = {
	error: PropTypes.object,
	layers: PropTypes.object,
	match: PropTypes.object,
	path: PropTypes.array,
	style: PropTypes.object,
	styleId: PropTypes.string,
}

const mapStateToProps = (state, props) => {
	return {
		layers: modelStyle.selectors.getIn(state, {path: [...props.path, 'current', 'layers']}),
	}
}
export default connect(
  mapStateToProps,{}
)(GlobalEdit)
