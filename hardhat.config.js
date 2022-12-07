require('@nomiclabs/hardhat-waffle');

const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
    solidity: '0.8.4',
    paths: {
        artifacts: './src/backend/artifacts',
        sources: './src/backend/contracts',
        cache: './src/backend/cache',
        tests: './src/backend/test',
    },
    defaultNetwork: 'ganache',
    networks: {
        ganache: {
            url: 'HTTP://172.21.48.1:7545',
        },
        bsc: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            accounts: [privateKey] ,
        },
    },
};
