import React from 'react';
import {
  CModal,
} from '@coreui/react';

const SuccessModal = (props) => {
  return (
    <>
      <CModal
        alignment="center"
        visible={props.showSuccess}
        backdrop="static"
        aria-labelledby="CenteredSuccessBox"
        style={{
          background: 'rgba(0, 0, 0, 0.4)', // dark overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="success-box"
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
            animation: 'popIn 0.3s ease-in-out',
            border: '3px solid #2ecc71',
            position: 'relative',
          }}
        >
           <div
          style={{
            fontSize: '70px',
            color: '#ffffff', // ✅ pure white
            textShadow: '0 0 20px rgba(255,255,255,0.9)', // ✅ white glow
            animation: 'fadeZoom 0.6s ease-in-out',
          }}
        >
          ✔️
        </div>


          <h6
            style={{
              fontWeight: '700',
              color: '#2f3542',
              marginBottom: '6px',
              fontSize: '17px',
            }}
          >
            {props.successText1 || 'Success!'}
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
            {props.successText2 || 'Your action has been completed successfully.'}
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

            @keyframes popIn {
              0% {
                opacity: 0;
                transform: scale(0.7) rotate(-5deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0);
              }
            }
          `}
        </style>
      </CModal>
    </>
  );
};

export default SuccessModal;
