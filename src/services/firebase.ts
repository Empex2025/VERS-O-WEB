import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Configuração web do Firebase (projeto iSaúde).
 * São chaves públicas de cliente — seguras para versionar no front.
 * Usadas para o fluxo de ativação de conta por e-mail (sendEmailVerification):
 * o backend cria o usuário no Firebase com emailVerified=false e bloqueia o
 * login até a verificação; aqui o front dispara o e-mail com o link de ativação.
 */
const firebaseConfig = {
    apiKey: 'AIzaSyAzVN0Y0weDQWR9iSKlbEb4xp2QL9BLy0Q',
    authDomain: 'isaude-edb38.firebaseapp.com',
    projectId: 'isaude-edb38',
    storageBucket: 'isaude-edb38.firebasestorage.app',
    messagingSenderId: '184508762411',
    appId: '1:184508762411:web:1487c1b117efba18f61d6e',
    measurementId: 'G-B5B1NL8D39',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
