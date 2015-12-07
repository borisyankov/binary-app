import React from 'react';

const AssetIndexRow = ({ assetIndex }) => (
    <tr>
        <td>
            {assetIndex[1]}
        </td>
        {assetIndex[2].map(idx =>
            <td key={idx}>{idx[2]}–{idx[3]}</td>
        )}
        {Array(8 - assetIndex[2].length).fill(<td></td>)}
    </tr>
);

AssetIndexRow.propTypes = {
    assetIndex: React.PropTypes.array.isRequired,
};

export default AssetIndexRow;
