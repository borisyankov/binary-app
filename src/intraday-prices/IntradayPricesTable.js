import React from 'react';
import Direction from '../_common/Direction';
import M from '../_common/M';

export default () => (
	<table>
		<thead>
			<tr>
				<th><M m="Time" /></th>
				<th><M m="Price" /></th>
				<th><M m="Change" /></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>07:05</td>
				<td>169.00</td>
				<td>0.18 (0.11%)<Direction diff={-0.11} /></td>
			</tr>
			<tr>
				<td>07:10</td>
				<td>169.23</td>
				<td>0.23 (0.14%)<Direction diff={0.14} /></td>
			</tr>
			<tr>
				<td>07:15</td>
				<td>169.38</td>
				<td>0.15 (0.09%)<Direction diff={0.09} /></td>
			</tr>
		</tbody>
	</table>
);
