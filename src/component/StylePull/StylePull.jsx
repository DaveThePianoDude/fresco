import PropTypes from 'prop-types'
import React from 'react'
import {withRouter} from 'react-router-dom'

import modelApp from '../../model/app'
import modelStyle from '../../model/style'

import Property from '../Property'

class StylePull extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			file: '',
		}
	}

	handleSubmit = async (e)=>{
		e.preventDefault()
		const {history, style} = this.props,
			{file} = this.state
		try{
			await modelApp.actions.setLoading(true) 
			await modelStyle.actions.updateUpload({
				file,
				style,
			})
			await modelApp.actions.setLoading(false)

			const redirect = `/style/${style.getIn(['current','id'])}`
			history.push(redirect)
		} catch(e){
			await modelApp.actions.setLoading(false)
			await modelApp.actions.setError(e)
		}
	}

	handleChange = ({name, value})=>{

		let state = {}
		state[name] = value

		this.setState(state)
	}

	render (){
		const {file} = this.state

		const handle = {
			change: this.handleChange
		}

		const isReady = file? true: false

		return <form className="content-body" onSubmit={this.handleSubmit}>
			<h4 className="content-body-title">
				<span>From Git Repository:</span>
			</h4>
			<div className="property-content">
				<Property 
					handle={handle}
					info={'specify git repository url'}
					key={'repo'}
					label={'repo'}
					name={'repo'}
					path={null}
					required={true}
					type={'file'}
					value={file}
				/>

				<div className="form-group mt-3 text-right">
					<button type="submit" className={`btn btn-primary ${isReady? '': 'disabled'}`}>Pull</button>
				</div>
			</div>
		</form>
	}
}

StylePull.propTypes = {
	history: PropTypes.object,
	match: PropTypes.object,
	style: PropTypes.object,
}

export default withRouter(StylePull)
