import http from 'k6/http';
import { check, sleep } from 'k6';

// 100 VU por 10s
// Requisição com falha inferior a 1%
// Duração da requisição p(95) < 250

// Etapa de configuração do Script
export const options = {
    vus: 100,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    }
}

// Configurando a API para armazenar o token de usuário
const BASE_URL = 'https://test-api.k6.io';

export function setup(){
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.3195912365996836@mail.com',
        password: 'user123'
    });
    const token = loginRes.json('access');
    return token;
}

// Etapa de execução do Script 
export default function(token){

    const params = {
        headers: {
            Authorization: `Bearer ${token}` ,
            'Content-Type': 'application/json'
        }
    }

    const res = http.get(`${BASE_URL}/my/crocodiles`, params);

    check(res, {
        'status code  200': (r) => r.status === 200
    });
}