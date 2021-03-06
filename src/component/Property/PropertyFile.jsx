import React from 'react'
import PropTypes from 'prop-types'

import Field from '../Field'

import modelStyle from '../../model/style'

class PropertyFile extends React.Component {

	handleChange = async ({value})=>{
		const {handle, name, path} = this.props
		if (handle && handle.change) return handle.change({name, path, value})
		await modelStyle.actions.setIn({
			path,
			value,
		})
	}

	render (){
		const {autoFocus, error, name, options, path, placeholder, value} = this.props

		const handle = {
			change: this.handleChange
		}

		return <div className="form-group mb-0">
			<Field 
				autoFocus={autoFocus}
				error={error}
				handle={handle}
				name={name}
				options={options}
				path={path}
				placeholder={placeholder}
				type={'file'}
				value={value}
			/>
		</div>
	}
}

PropertyFile.propTypes = {
	autoFocus: PropTypes.bool,
	error: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	handle: PropTypes.shape({
		change: PropTypes.func,
	}),
	name: PropTypes.string.isRequired,
	path: PropTypes.array,
	placeholder: PropTypes.string,
	type: PropTypes.string, // enum, point
	value: PropTypes.any,
	valueDefault: PropTypes.any,
}

export default PropertyFile