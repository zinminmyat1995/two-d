import React from 'react';
import {CRow,CButton,CModal,CModalBody,CButtonToolbar,CModalHeader ,CModalTitle ,CModalFooter,CCol,CFormSelect  } from '@coreui/react';
import Message from "../../common/SuccessError";

const ErrorModal = props => {
    return (
        <>
        <CModal
            alignment="center"
            visible={props.showError}
            backdrop="static"
            aria-labelledby="CenteredErrorBox"
            style={{
            background: 'rgba(0, 0, 0, 0.4)', // dark overlay
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}
        >
            <div
            className="error-box"
            style={{
                width: '260px',
                height: '260px',
                background: 'white',
                borderRadius: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                animation: 'zoomIn 0.3s ease-in-out',
                border: '3px solid #ff6b6b',
                position: 'relative',
            }}
            >
            <div
                style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)',
                marginBottom: '15px',
                }}
            >
                <span style={{ fontSize: '38px', color: 'white' }}>⚠️</span>
            </div>

            <h6
                style={{
                fontWeight: '700',
                color: '#2f3542',
                marginBottom: '6px',
                fontSize: '17px',
                }}
            >
                {props.errorText1}
            </h6>
            <p
                style={{
                color: '#57606f',
                fontSize: '13px',
                textAlign: 'center',
                margin: 0,
                padding: '0 20px',
                }}
            >
                {props.errorText2}
            </p>
            </div>

            <style>
                {`
                /* ✅ Remove default modal background and border */
                .modal-content {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                @keyframes zoomIn {
                    0% {
                    opacity: 0;
                    transform: scale(0.7);
                    }
                    100% {
                    opacity: 1;
                    transform: scale(1);
                    }
                }
                `}
            </style>
        </CModal>
      </>
    )
}
export default ErrorModal



