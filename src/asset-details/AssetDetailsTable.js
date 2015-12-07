import React from 'react';

const AssetDetailsTable = ({ asset }) => (
	<table>
		<thead>
			<tr>
				<th>Property</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			{asset.map((val, key) =>
				<tr>
					<td>{key}</td>
					<td>{val}</td>
				</tr>
			)}
		</tbody>
	</table>
);


AssetDetailsTable.propTypes = {
	asset: React.PropTypes.object.isRequired,
};

export default AssetDetailsTable;
