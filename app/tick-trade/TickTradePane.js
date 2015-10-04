import React from 'react';

export default (props) => (
	<div>
		<button>Change Time Settings</button>
		<fieldset>
			<label>USD/JPY will RISE over next 5 ticks</label>
		</fieldset>
		<div>CHART HERE</div>
		<fieldset>
			<label>Payout: USD</label><input type="number" defaultValue={15} /> <button>+</button><button>-</button>
		</fieldset>
		<fieldset>
			<label>Price: USD 7.1</label><button>Buy!</button>
		</fieldset>
		<table>
			<tbody>
				<tr><td>Buy Price</td><td>7.1</td></tr>
				<tr><td>Final Price</td><td>15</td></tr>
				<tr><td>Profit</td><td>7.3</td></tr>
				<tr><td>Account Balance</td><td>45.53</td></tr>
			</tbody>
		</table>

		<label>Underlying</label>
		<fieldset>
			<button>Forex</button><button>Randoms</button>
		</fieldset>
		<label>USD/JPY</label>
		<label>Select Trade</label>
		<fieldset>
			<button>Up</button><button>Down</button><button>Digit Match</button><button>Digit Differs</button>
		</fieldset>
		<fieldset>
			<label>No. ticks:</label>
			<button>5</button><button>6</button><button>7</button><button>8</button><button>9</button><button>10</button>
		</fieldset>
		<label>Select Amount</label>
		<fieldset>
			<button>Payout</button><button>Stake</button>
		</fieldset>
		<label>USD</label><input type="number" defaultValue={15} />
		<fieldset>
			<button>Save</button>
		</fieldset>
	</div>
);
