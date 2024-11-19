import React from 'react';

export function verificationCodeSuccess(data) {
    console.log('data');
    console.log(data);
    return {status: true, msg: ''};
}

export function verificationCodeFail(data) {
    console.log('data');
    console.log(data);
    return {status: false, msg: 'failed to send OPT'};
}

export function verifyFail(data) {
    console.log('data');
    console.log(data);
    return {status: false, msg: 'OPT verification failed'};
}

export function verifySuccess(data) {
    console.log('data');
    console.log(data);
    return {status: true, msg: ''};
}

export function signupSuccess(data) {
    console.log('data');
    console.log(data);
    return {status: true, msg: '', token: {email: data.email}};
}

export function signupFail(data) {
    console.log('data');
    console.log(data);
    return {status: false, msg: 'signup failed', token: {email: data.email}};
}