import React from 'react'
import ReactDOM from 'react-dom/client'
import Cell from './components/Cell'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Cell
			isBeige={true}
			isClickable={true}
			isPlayerBlack={true}>
		</Cell>
	</React.StrictMode>,
)
