import {TX_COMPLETED, TX_CONFIRMATIONS, TX_ERROR, TX_STARTED,} from './txConstants';

export default (state = {}, action) => {
    // if (action.type === RESOLVE_PENDING_TRANSACTIONS) {
    //   return action.payload;
    // }

    if (!state.transactions) {
        state.transactions = [];
    }

    if (!(action.payload && action.payload.hash)) {
        return {...state};
    }

    console.warn('TX REDUCER:::::::::::::');
    console.warn('ACTION: ', action);
    console.warn('STATE: ', state);

    if (action.type === TX_STARTED) {
        state.transactions.unshift({
            unseen: true,
            ...action.payload,
            status: 'PENDING'
        });
        return {...state};
    }
    if (action.type === TX_CONFIRMATIONS) {
        // return {
        //     ...state,
        //     transactions: state.transactions.unshift({
        //         unseen: true,
        //         ...action.payload
        //     })
        // };
    }
    if (action.type === TX_COMPLETED) {
        let found = false;
        const updatedTransactions = state.transactions && state.transactions.map((tx) => {
            if (tx.hash === action.payload.hash) {
                found = true;
                return {...tx, ...action.payload, unseen: true, status: 'COMPLETED'}
            }
            else {
                return tx;
            }
        });
        if (!found) {
            state.transactions.unshift({
                unseen: true,
                ...action.payload,
                status: 'COMPLETED'
            })
        } else {
            state.transactions = updatedTransactions;
        }
        return {...state};
    }
    if (action.type === TX_ERROR) {
        let found = false;
        const updatedTransactions = state.transactions && state.transactions.map((tx) => {
            if (tx.hash === action.payload.hash) {
                found = true;
                return {...tx, error: action.payload.error, unseen: true, status: 'FAILED'}
            }
            else {
                return tx;
            }
        });
        if (!found) {
            state.transactions.unshift({
                unseen: true,
                ...action.payload.tx,
                error: action.payload.error,
                status: 'FAILED'
            })
        }
        else {
            state.transactions = updatedTransactions;
        }
        return {...state};
    }

    return state;
};
