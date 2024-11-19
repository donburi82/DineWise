import React from 'react';

export function loginSuccess(data) {
    console.log('data');
    console.log(data);
    return {status: true, msg: '', token: {email: data.email}};
}

export function loginFail(data) {
    console.log('data');
    console.log(data);
    return {status: false, msg: 'Email or password is incorrect', token: {email: data.email}};
}

