import React from 'react'
import { CModal, CButton } from '@coreui/react'

const ConfirmModal = ({ showConfirm, onOk, onCancel }) => {
  return (
    <>
      <CModal
        alignment="center"
        visible={showConfirm}
        backdrop="static"
        aria-labelledby="CenteredConfirmBox"
        style={{
          background: 'rgba(0, 0, 0, 0.4)', // dimmed background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="confirm-box"
          style={{
            width: '300px',
            minHeight: '200px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '25px 20px',
            animation: 'zoomIn 0.35s ease-in-out',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #0984e3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
              marginBottom: '15px',
              color: 'white',
              fontSize: '38px',
            }}
          >
            ❓
          </div>

          <h6
            style={{
              fontWeight: '700',
              color: '#2f3542',
              fontSize: '17px',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Are you sure want to payment?
          </h6>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <CButton
              color="light"
              style={{
                borderRadius: '10px',
                padding: '6px 20px',
                fontWeight: '600',
                border: '1px solid #dfe6e9',
              }}
              onClick={onCancel}
            >
              Cancel
            </CButton>
            <CButton
              color="primary"
              style={{
                borderRadius: '10px',
                padding: '6px 25px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #6c5ce7, #0984e3)',
                border: 'none',
                boxShadow: '0 4px 10px rgba(108, 92, 231, 0.4)',
              }}
              onClick={onOk}
            >
              OK
            </CButton>
          </div>
        </div>

        <style>
          {`

            .btn:hover {
                color: black !important;
                background-color: #f3f4f7 !important;
                border: 1px solid rgb(223, 230, 233) !important;
            }
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

export default ConfirmModal
