import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// Realizar o login com um novo usuário
// Ramp up 5 VU em 5s
// Carga 5 VU por 5s
// Ramp up 50 VU em 2s
// Carga de 50 VU em 2s
// Ramp down 0 VU em 5s
// Requisição com falha inferior a 1%

// Etapa de configurações do Script
export const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 5 },
        { duration: '2s', target: 50 },
        { duration: '2s', target: 50 },
        { duration: '5s', target: 0 },

    ],
    thresholds: {
        http_req_failed: ['rate < 0.01']
    }
};

// Exportar e utilizar o arquivo csv criado com os usuários
const csvData = new SharedArray('Ler dados', function(){
    return papaparse.parse(open('./usuarios_criados_k6.csv'), {header: true}).data;
});

// Etapa de execução do Script
export default function(){
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email
    const PASS = 'user123';
    const BASE_URL = 'https://test-api.k6.io';

    console.log( USER );

    const res = http.post(`${BASE_URL}/auth/token/login/`,{
        username: USER,
        password: PASS
    });

    check(res, {
        'Sucesso ao realizar Login': (r) => r.status === 200,
        'Token Gerado': (r) => r.json('acess') !== ''
    });

    sleep(1);
};