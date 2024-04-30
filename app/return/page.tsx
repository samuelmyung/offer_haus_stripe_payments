// "use client";
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';


export default async function Return(data: { searchParams: { session_id: string }}) {
    // const [status, setStatus] = useState(null);
    // const [customerEmail, setCustomerEmail] = useState('');

    // useEffect(function fetchingPaymentSessionDataOnMount() {
    // async function fetchingPaymentSessionData() {
        // const queryString = window.location.search;
        const sessionId = data.searchParams.session_id;
        // const urlParams = new URLSearchParams(queryString);
        // const sessionId = queryString.get('session_id');

        const response = await fetch(`http://localhost:3000/api/checkout_sessions?session_id=${sessionId}`, {
            method: "GET",
        });
        const sessionData = await response.json();
        // setStatus(data.status);
        // setCustomerEmail(data.customer_email);

    // fetchingPaymentSessionData();
    // }, []);



    if (sessionData!.status === 'open') {
        return (
            redirect('/')
        );
    }

    if (sessionData!.status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {sessionData!.customer_email}.

                    If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                </p>
            </section>
        );
    }

    return null;
}